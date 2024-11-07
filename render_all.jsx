#include "scripts/jsx/render.jsx";
#include "settings.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;

// Render all images in /art
var folder = new Folder(file_path + "/art");
var files = folder.getFiles(/.\.(jpg|jpeg|png|tif)$/i);

// Run through each file
for (var n = 0; n < files.length; n++) {
    
	// Are templates an array
	if ( specified_template === null ) render(files[n],specified_template);
	else if ( (specified_template[1] !== undefined) && specified_template[1] !== null ) {
		
		// Run through each template
		for (var z = 0; z < specified_template.length; z++) {
			render(files[n],specified_template[z]);
		}
	
	} else render(files[n],specified_template);

}
