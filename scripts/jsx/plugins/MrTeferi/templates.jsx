// Templates released by MrTeferi

var SketchTemplate = Class({
    /**
     * Sketch showcase from MH2
     * Original template by Nelynes
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "MrTeferi/sketch";
    },
    template_suffix: function () {
        return "Sketch";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        
    },
    enable_frame_layers: function () {
        this.super();
        var doc_ref = app.activeDocument;
        var text_group = doc_ref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        if ( this.layout.rarity != "common" ) {
            text_group.layers.getByName("common").visible = false;
        }
        
        /*
        
        Interesting Sketch integration?
        
        app.activeDocument.activeLayer = app.activeDocument.layers.getByName(default_layer);
        content_fill_empty_area();
        this.art_reference.visible = false;
        doc_ref.layers.getByName(LayerNames.ART_FRAME).visible=false;
        //app.activeDocument.activeLayer.applyDiffuseGlow(0,2,13)
        app.activeDocument.activeLayer.applyUnSharpMask(100,5,50)
        app.activeDocument.activeLayer.autoContrast()
        app.activeDocument.activeLayer.autoLevels()
        app.activeDocument.activeLayer.adjustBrightnessContrast(0,10)
        VibrantSaturation(100,-30)      
        // =======================================================
        var idPly = charIDToTypeID( "Ply " );
        var desc5002 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        var ref1210 = new ActionReference();
        var idActn = charIDToTypeID( "Actn" );
        ref1210.putName( idActn, "NewSketchify" );
        var idASet = charIDToTypeID( "ASet" );
        ref1210.putName( idASet, "Scoots Actions" );
        desc5002.putReference( idnull, ref1210 );
        executeAction( idPly, desc5002, DialogModes.NO );

        */
        
    }
});

var CrimsonFangTemplate = Class({
    /**
     * The crimson vow showcase template.
     * Original template by michayggdrasil
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "MrTeferi/crimson-fang";
    },
    template_suffix: function () {
        return "Fang";
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        
        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;
        
        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );
            
            power_toughness.visible = false;
        }
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);
        if (this.layout.is_colourless) this.art_reference = docref.layers.getByName(LayerNames.FULL_ART_FRAME);

        this.name_shifted = this.layout.transform_icon !== null && this.layout.transform_icon !== undefined;
        this.type_line_shifted = this.layout.colour_indicator !== null && this.layout.colour_indicator !== undefined;

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
        this.rules_text_and_pt_layers(text_and_icons);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;
        var tf_twins = this.layout.twins + "-mdfc"; // Twins if transform card
        var twins = docref.layers.getByName(LayerNames.TWINS);
        
        // Transform stuff + twins
        if ( this.name_shifted ) {
            docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName("Button").visible = true;
            if (this.layout.face == 0 ) docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(LayerNames.TF_FRONT).visible = true;
            else docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(LayerNames.TF_BACK).visible = true;
            twins.layers.getByName(tf_twins).visible = true;
        } else twins.layers.getByName(this.layout.twins).visible = true;
        
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        if ( this.name_shifted && this.layout.face == 1 ) { 
            pinlines = docref.layers.getByName("MDFC "+LayerNames.PINLINES_TEXTBOX);
            app.activeDocument.layers.getByName(LayerNames.COLOUR_INDICATOR).layers.getByName(this.layout.pinlines).visible = true;
        } else if (this.is_land) pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        docref.layers.getByName(LayerNames.BACKGROUND).layers.getByName(this.layout.pinlines).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            border = docref.layers.getByName(LayerNames.BORDER);
            border.layers.getByName(LayerNames.NORMAL_BORDER).visible = false;
            border.layers.getByName(LayerNames.LEGENDARY_BORDER).visible = true;
        }
        
    }
});

var KaldheimTemplate = Class({
    /**
     * Kaldheim viking legendary showcase.
     * Original Template by FeuerAmeise
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "MrTeferi/kaldheim";
    },
    template_suffix: function () {
        return "Kaldheim";
    },
    rules_text_and_pt_layers: function (text_and_icons) {

        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;

        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );
            
            power_toughness.visible = false;
        }
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);
        if (this.layout.is_colourless) this.art_reference = docref.layers.getByName(LayerNames.FULL_ART_FRAME);

        this.name_shifted = this.layout.transform_icon !== null && this.layout.transform_icon !== undefined;
        this.type_line_shifted = this.layout.colour_indicator !== null && this.layout.colour_indicator !== undefined;

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
        this.rules_text_and_pt_layers(text_and_icons);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // PT Box, no title boxes for this one
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            // Check if vehicle
            if (this.layout.type_line.slice(-7) == "Vehicle") pt_box.layers.getByName("Vehicle").visible = true;
            else pt_box.layers.getByName(this.layout.twins).visible = true;
        } else docref.layers.getByName(LayerNames.PT_BOX).visible = false;
        
        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        if (this.is_land) {
            
            // Change to land group
            pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
            
            // Check if vehicle
            if (this.layout.type_line.slice(-7) == "Vehicle") pinlines.layers.getByName("Vehicle").visible = true;
            else pinlines.layers.getByName(this.layout.pinlines).visible = true;
            
        } else {
            
            // Check if vehicle
            if (this.layout.type_line.slice(-7) == "Vehicle") pinlines.layers.getByName("Vehicle").visible = true;
            else pinlines.layers.getByName(this.layout.pinlines).visible = true;
            
        }
        
    },
});

var PhyrexianTemplate = Class({
    /**
     * From the Phyrexian secret lair promo
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "MrTeferi/phyrexian";
    },
    template_suffix: function () {
        return "Phyrexian";
    },
    rules_text_and_pt_layers: function (text_and_icons) {

        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;

        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );
            
            power_toughness.visible = false;
        }
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);
        if (this.layout.is_colourless) this.art_reference = docref.layers.getByName(LayerNames.FULL_ART_FRAME);

        this.name_shifted = this.layout.transform_icon !== null && this.layout.transform_icon !== undefined;
        this.type_line_shifted = this.layout.colour_indicator !== null && this.layout.colour_indicator !== undefined;

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
        this.rules_text_and_pt_layers(text_and_icons);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // PT Box, no title boxes for this one
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            pt_box.layers.getByName(this.layout.twins).visible = true;
        } else docref.layers.getByName(LayerNames.PT_BOX).visible = false;
        
        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        if (this.is_land) {
            
            // Change to land group
            pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
            pinlines.layers.getByName(this.layout.pinlines).visible = true;
            
        } else {
            
            pinlines.layers.getByName(this.layout.pinlines).visible = true;
            
        }
        
    },
});

var JPMysticalArchiveTemplate = Class({
    /**
     * Japanese Mystical Archive from Strixhaven
     * Original Template by VittorioMasia
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "MrTeferi/jp_mystical_archive";
    },
    template_suffix: function () {
        return "JPMA";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        
    },
    enable_frame_layers: function () {
        this.super();
        var doc_ref = app.activeDocument;
        var text_group = doc_ref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        
    }
})

/* Classic variant with the promo star enabled */

var PromoNormalClassicTemplate = Class({
    /**
     * A template for 7th Edition frame. Each frame is flattened into its own singular layer.
	 * Promo star added
     */
	
    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "normal-classic";
    },
    template_suffix: function () {
        return "Classic Promo";
    },
    constructor: function (layout, file, file_path) {
		
		layout.is_classic = true;
        this.super(layout, file, file_path);

        var docref = app.activeDocument;
        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);

        // artist
        replace_text(docref.layers.getByName(LayerNames.LEGAL).layers.getByName(LayerNames.ARTIST), "Artist", this.layout.artist);
        this.text_layers = [];

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
		
		// Add the promo star
		text_and_icons.layers.getByName("Promo Star").visible = true;

        // rules text
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;
        var reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE);
        if (this.is_land) {
            reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE_LAND);
        }
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT);
        this.text_layers.push(
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = this.layout.flavour_text,
                is_centred = is_centred,
                reference_layer = reference_layer,
            ),
        );

        // pt
        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            this.text_layers.push(
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
            )
        } else {
            power_toughness.visible = false;
        }
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;
		
        var layers = docref.layers.getByName(LayerNames.NONLAND);
        var selected_layer = this.layout.background;
        if (this.is_land) {
            layers = docref.layers.getByName(LayerNames.LAND);
            selected_layer = this.layout.pinlines;
        }

        layers.layers.getByName(selected_layer).visible = true;
    }
});

var DoubleFeatureTemplate = Class({
    /**
     * Midnight Hunt / Vow Double Feature Showcase
     * Original assets from Warpdandy's Proximity Template
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "MrTeferi/double-feature";
    },
    template_suffix: function () {
        return "Double Feature";
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        
        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;
        
        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );
            
            power_toughness.visible = false;
        }
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);

        this.name_shifted = this.layout.transform_icon !== null && this.layout.transform_icon !== undefined;
        this.type_line_shifted = this.layout.colour_indicator !== null && this.layout.colour_indicator !== undefined;

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
        this.rules_text_and_pt_layers(text_and_icons);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;
        
        // Transform stuff
        if ( this.name_shifted ) {
            docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName("Button").visible = true;
            if (this.layout.face == 0 ) docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(LayerNames.TF_FRONT).visible = true;
            else docref.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(LayerNames.TF_BACK).visible = true;
        }
        
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX)
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        if ( this.name_shifted && this.layout.face == 1 ) app.activeDocument.layers.getByName(LayerNames.COLOUR_INDICATOR).layers.getByName(this.layout.pinlines).visible = true;

        // background
        docref.layers.getByName(LayerNames.BACKGROUND).layers.getByName(this.layout.pinlines).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            border = docref.layers.getByName(LayerNames.BORDER);
            border.layers.getByName(LayerNames.NORMAL_BORDER).visible = false;
            border.layers.getByName(LayerNames.LEGENDARY_BORDER).visible = true;
        }
        
    }
});

var MaleMPCTemplate = Class({
    /**
     * MaleMPC's extended black box template.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "MrTeferi/male-mpc";
    },
    template_suffix: function () {
        return "Extended Black";
    },
    constructor: function (layout, file, file_path) {
        // strip out reminder text for extended cards
        if ( layout.oracle_text ) layout.oracle_text = strip_reminder_text(layout.oracle_text);
        layout.is_silvan = true;
        
        this.super(layout, file, file_path);
        var docref = app.activeDocument;
        
        // Which background?
        var background = docref.layers.getByName(LayerNames.BACKGROUND);
        if (this.layout.is_nyx) background = docref.layers.getByName(LayerNames.NYX);
        
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        var background = docref.layers.getByName(LayerNames.BACKGROUND);
        if (this.layout.is_nyx) background = docref.layers.getByName(LayerNames.NYX);
        background.layers.getByName(this.layout.background).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            border = docref.layers.getByName(LayerNames.BORDER);
            border.layers.getByName(LayerNames.NORMAL_BORDER).visible = false;
            border.layers.getByName(LayerNames.LEGENDARY_BORDER).visible = true;
        } else {
            // Top pinlines if not legendary
            var top_pinlines = docref.layers.getByName("Top Pinlines");
            top_pinlines.visible = true;
            top_pinlines.layers.getByName(this.layout.pinlines).visible = true;
        }

        if (this.is_companion) {
            // enable companion texture
            var companion = docref.layers.getByName(LayerNames.COMPANION);
            companion.layers.getByName(this.layout.pinlines).visible = true;
        }

        if ((this.is_legendary && this.layout.is_nyx) || this.is_companion) {
            // legendary crown on nyx background - enable the hollow crown shadow and layer mask on crown, pinlines, and shadows
            this.enable_hollow_crown(crown, pinlines);
        }

        docref.activeLayer = this.art_layer;
        content_fill_empty_area();
        
    },
});