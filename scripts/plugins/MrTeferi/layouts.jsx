// Append these templates to layout map
class_template_map[normal_class].other.push(SketchTemplate);
class_template_map[normal_class].other.push(KaldheimTemplate);
class_template_map[normal_class].other.push(PhyrexianTemplate);
class_template_map[normal_class].other.push(JPMysticalArchiveTemplate);
class_template_map[normal_class].other.push(CrimsonFangTemplate);
class_template_map[normal_class].other.push(DoubleFeatureTemplate);
class_template_map[normal_class].other.push(MaleMPCTemplate);
class_template_map[normal_class].other.push(PromoNormalClassicTemplate);
class_template_map[transform_front_class].other.push(CrimsonFangTemplate);
class_template_map[transform_back_class].other.push(CrimsonFangTemplate);

var JPMysticalArchiveLayout = Class({
    constructor: function (scryfall, card_name) {
        /**
         * Constructor for base layout calls the JSON unpacker to set object parameters from the contents of the JSON (each extending 
         * class needs to implement this) and determines frame colours for the card.
         */

        this.scryfall = scryfall;
        this.card_name_raw = card_name;

        this.unpack_scryfall();
        this.set_card_class();

        var ret = select_frame_layers_jpma(this.mana_cost, this.type_line, this.oracle_text, this.colour_identity);

        this.twins = ret.twins;
        this.pinlines = ret.pinlines;
        this.background = ret.background;
        this.is_nyx = in_array(this.frame_effects, "nyxtouched")
        this.is_colourless = ret.is_colourless;
    },
    unpack_scryfall: function () {
        /**
         * Extending classes should implement this method, unpack more information from the provided JSON, and call super(). This base method only unpacks 
         * fields which are common to all layouts.
         * At minimum, the extending class should set this.name, this.oracle_text, this.type_line, and this.mana_cost.
         */

        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;
        
        //ADD SET, MY STUFF
        if ( this.set != "MTG" ) this.set = this.scryfall.set;
        if ( this.set == "" || this.set == null ) this.set = "MTG";
        
        //ADD Collector Number, MY STUFF
        if ( this.scryfall.collector_number ) this.collector_number = this.scryfall.collector_number;
        
        this.colour_identity = this.scryfall.color_identity;
        this.keywords = [];
        if (this.scryfall.keywords !== undefined) this.keywords = this.scryfall.keywords;
        this.frame_effects = [];
        if (this.scryfall.frame_effects !== undefined) this.frame_effects = this.scryfall.frame_effects;
        
        this.name = this.scryfall.name;
        this.mana_cost = this.scryfall.mana_cost;
        this.type_line = this.scryfall.type_line;
        this.oracle_text = this.scryfall.oracle_text.replace(/\u2212/g, "-");  // for planeswalkers
        this.flavour_text = "";
        if (this.scryfall.flavor_text !== undefined) this.flavour_text = this.scryfall.flavor_text;
        this.power = this.scryfall.power;
        this.toughness = this.scryfall.toughness;
        this.colour_indicator = this.scryfall.color_indicator;

        this.scryfall_scan = this.scryfall.image_uris.large;

    },
    get_default_class: function () {
        return jp_mystical_archive_class;
    },
    set_card_class: function () {
        /**
         * Set the card's class (finer grained than layout). Used when selecting a template.
         */

        this.card_class = this.get_default_class();

    }
});