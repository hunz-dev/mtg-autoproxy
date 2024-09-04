// Instantiate the template map
var class_template_map = {};

#include "json2.js";
#include "../settings.jsx";
#include "layouts.jsx";

function retrieve_card_name_and_artist(file) {
    /**
     * Retrieve card name and (if specified) artist from the input file.
     */

    var filename = decodeURI(file.name);
    var filename_no_ext = filename.slice(0, filename.lastIndexOf("."));

    var open_index = filename_no_ext.lastIndexOf(" (");
    var close_index = filename_no_ext.lastIndexOf(")");
	
	// MY STUFF - Check for set and creator
	var open_index_set = filename_no_ext.lastIndexOf(" [");
    var close_index_set = filename_no_ext.lastIndexOf("]");
	var open_index_creator = filename_no_ext.lastIndexOf(" {");
    var close_index_creator = filename_no_ext.lastIndexOf("}");

    var card_name = filename_no_ext;
    var artist = "";
	
	// MY STUFF - See if the file name has a set defined
	var set = "";
	var creator = "";
	if (open_index_set > 0 && close_index_set > 0) set = filename_no_ext.slice(open_index_set + 2, close_index_set);
	if (open_index_creator > 0 && close_index_creator > 0) creator = filename_no_ext.slice(open_index_creator + 2, close_index_creator);
	
    if (open_index > 0 && close_index > 0) {
        // File name includes artist name - slice and dice
        artist = filename_no_ext.slice(open_index + 2, close_index);
        card_name = filename_no_ext.slice(0, open_index);
    }

    return {
        card_name: card_name,
        artist: artist,
		set: set,
		creator: creator
    }
}

function call_json(card_name, file_path) {
    /**
     * Grabs json info from custom card
     */

    var json_file = new File(file_path + json_custom_file_path);
    json_file.open('r');
    var json_string = json_file.read();
    json_file.close();
    if (json_string === "") {
        throw new Error(
            "Folks we have an issue with Json!"
        );
    }
    return JSON.parse(JSON.parse(json_string));
}

function select_template(layout, file, file_path, new_template) {
    /**
     * Instantiate a template object based on the card layout and user settings.
     */
	
    var template_class = class_template_map[layout.card_class];
    var template = template_class.default_;
	if (new_template !== null && in_array(template_class.other, new_template)) {
        // a template was specified and it's allowed to be used for this card class
        template = new_template;
    }
    return new template(layout, file, file_path);
}


function render(file,current_template) {
	
	// -- MY STUFF
	var my_template = current_template;
	
    // TODO: specify the desired template for a card in the filename?
    var file_path = File($.fileName).parent.parent.fsName;

    var ret = retrieve_card_name_and_artist(file);
    var card_name = ret.card_name;
    var artist = ret.artist;

    if (in_array(BasicLandNames, card_name)) {
        // manually construct layout obj for basic lands
        var layout = {
            artist: artist,
            name: card_name,
            card_class: basic_class,
        };
		
    } else {
        var scryfall = call_json(card_name, file_path);
        var layout_name = scryfall.layout;

        // instantiate layout obj (unpacks scryfall json and stores relevant parts in obj properties)
        if (layout_name in layout_map) {
            var layout = new layout_map[layout_name](scryfall, card_name);
        } else {
            throw new Error("Layout" + layout_name + " is not supported. Sorry!");
        }

        // if artist specified in file name, insert the specified artist into layout obj
        if (artist !== "") layout.artist = artist;
		
    }
	
	// Remove flavour text? -- MY STUFF
	if ( remove_flavour_text == true ) layout.flavour_text = "";
	
	// If artist isn't defined set Unknown -- MY STUFF
	if (layout.artist == "" || layout.artist == null) layout.artist = "Unknown";
	
	// Include setcode -- MY STUFF
	if (ret.set) layout.set = ret.set;
	else if (scryfall) layout.set = scryfall.set;
	else layout.set = "MTG";
	
	// Include creator -- MY STUFF
	if (ret.creator) layout.creator = ret.creator;
	else layout.creator = null;
	
	// Strip reminder text? -- MY STUFF
	if ((layout.oracle_text) && remove_reminder_text == true ) layout.oracle_text = strip_reminder_text(layout.oracle_text);
	
    // select and execute the template - insert text fields, set visibility of layers, etc. - and save to disk
    var file_name = select_template(layout, file, file_path, my_template).execute();
    if (exit_early) {
        throw new Error("Exiting...");
    }
    save_and_close(file_name, file_path);
}
