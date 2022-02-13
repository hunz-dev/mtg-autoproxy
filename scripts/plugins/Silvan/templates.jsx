// Templates released by Silvan MTG

var SilvanExtendedTemplate = Class({
    /**
     * Silvan's legendary extended template used for WillieTanner proxies
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "Silvan/extended";
    },
    template_suffix: function () {
        return "Extended";
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

		// Hide top border if legendary
		if (this.is_legendary) {
			docref.activeLayer = background;
			enable_active_layer_mask();
		}

        // Hide top of shadow if nyx legendary or companion
        if ((this.is_legendary && this.layout.is_nyx) || this.is_companion) {
            docref.activeLayer = docref.layers.getByName("Shadows").layers.getByName("Shadows Light");
            enable_active_layer_mask();
        }
		
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
        if (this.is_land) pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
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

var SilvanMDFCBackTemplate = Class({
    /**
     * Silvan extended template modified for MDFC
     */

    extends_: NormalTemplate,
    template_file_name: function () {
		return "Silvan/extended-mdfc-back";
    },
    dfc_layer_group: function () {
		return LayerNames.MDFC_BACK;
    },
    template_suffix: function () {
        return "Extended";
    },
    constructor: function (layout, file, file_path) {
		this.layout = layout;
        this.super(layout, file, file_path);
        // set visibility of top & bottom mdfc elements and set text of left & right text
        var mdfc_group = app.activeDocument.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(this.dfc_layer_group());
        mdfc_group.layers.getByName(LayerNames.TOP).layers.getByName(this.layout.twins).visible = true;
        mdfc_group.layers.getByName(LayerNames.BOTTOM).layers.getByName(this.layout.other_face_twins).visible = true;
        var left = mdfc_group.layers.getByName(LayerNames.LEFT);
        var right = mdfc_group.layers.getByName(LayerNames.RIGHT);
        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = right,
                text_contents = this.layout.other_face_right,
                text_colour = get_text_layer_colour(right),
            ),
            new ScaledTextField(
                layer = left,
                text_contents = this.layout.other_face_left,
                text_colour = get_text_layer_colour(left),
                reference_layer = right,
            ),
        ]);

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
        if (this.is_land) pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
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
	}
});

var SilvanMDFCFrontTemplate = Class({
    /**
     * Silvan extended template modified for MDFC
     */

    extends_: SilvanMDFCBackTemplate,
    template_file_name: function () {
        return "Silvan/extended-mdfc-front";
    },
    dfc_layer_group: function () {
        return LayerNames.MDFC_FRONT;
    },
    template_suffix: function () {
        return "Extended";
    },
});