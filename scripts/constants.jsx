// TODO: consistency between camelcase and snakecase

var json_file_path = "/scripts/card.json";
var json_set_file_path = "/scripts/set.json"; // MY STUFF
var json_custom_file_path = "/scripts/custom_card.json"; // MY STUFF
var image_file_path = "/scripts/card.jpg";

// Card classes - finer grained than Scryfall layouts
var normal_class = "normal";
var transform_front_class = "transform_front";
var transform_back_class = "transform_back";
var ixalan_class = "ixalan";
var mdfc_front_class = "mdfc_front";
var mdfc_back_class = "mdfc_back";
var mutate_class = "mutate";
var adventure_class = "adventure";
var leveler_class = "leveler";
var saga_class = "saga";
var miracle_class = "miracle";
var planeswalker_class = "planeswalker";
var snow_class = "snow";
var basic_class = "basic";
var planar_class = "planar";
var jp_mystical_archive_class = "jp_mystical_archive"


// Layer names
var LayerNames = {
    WHITE: "W",
    BLUE: "U",
    BLACK: "B",
    RED: "R",
    GREEN: "G",
    WU: "WU",
    UB: "UB",
    BR: "BR",
    RG: "RG",
    GW: "GW",
    WB: "WB",
    BG: "BG",
    GU: "GU",
    UR: "UR",
    RW: "RW",
    ARTIFACT: "Artifact",
    COLOURLESS: "Colourless",
    LAND: "Land",
    GOLD: "Gold",
    VEHICLE: "Vehicle",

    // frame layer group names
    PT_BOX: "PT Box",
    PT_AND_LEVEL_BOXES: "PT and Level Boxes",
    TWINS: "Name & Title Boxes",
    LEGENDARY_CROWN: "Legendary Crown",
    PINLINES_TEXTBOX: "Pinlines & Textbox",
    PINLINES_AND_SAGA_STRIPE: "Pinlines & Saga Stripe",
    PINLINES: "Pinlines",
    LAND_PINLINES_TEXTBOX: "Land Pinlines & Textbox",
    COMPANION: "Companion",
    BACKGROUND: "Background",
    NYX: "Nyx",

    // borders
    BORDER: "Border",
    NORMAL_BORDER: "Normal Border",
    LEGENDARY_BORDER: "Legendary Border",

    // shadows
    SHADOWS: "Shadows",
    HOLLOW_CROWN_SHADOW: "Hollow Crown Shadow",

    // legal
    LEGAL: "Legal",
    ARTIST: "Artist",
    SET: "Set",
    COLLECTOR: "Collector",
    TOP_LINE: "Top",
    BOTTOM_LINE: "Bottom",

    // text and icons
    TEXT_AND_ICONS: "Text and Icons",
    NAME: "Card Name",
    NAME_SHIFT: "Card Name Shift",
    NAME_ADVENTURE: "Card Name - Adventure",
    TYPE_LINE: "Typeline",
    TYPE_LINE_SHIFT: "Typeline Shift",
    TYPE_LINE_ADVENTURE: "Typeline - Adventure",
    MANA_COST: "Mana Cost",
    MANA_COST_ADVENTURE: "Mana Cost - Adventure",
    EXPANSION_SYMBOL: "Expansion Symbol",
    EXPANSION_REFERENCE: "Expansion Reference",
    EXPANSION_SYMBOL_EXTRAS: "Expansion Symbol Extras",
    COLOUR_INDICATOR: "Colour Indicator",
    POWER_TOUGHNESS: "Power / Toughness",
    FLIPSIDE_POWER_TOUGHNESS: "Flipside Power / Toughness",
    RULES_TEXT: "Rules Text",
    RULES_TEXT_NONCREATURE: "Rules Text - Noncreature",
    RULES_TEXT_NONCREATURE_FLIP: "Rules Text - Noncreature Flip",
    RULES_TEXT_CREATURE: "Rules Text - Creature",
    RULES_TEXT_CREATURE_FLIP: "Rules Text - Creature Flip",
    RULES_TEXT_ADVENTURE: "Rules Text - Adventure",
    MUTATE: "Mutate",

    // planar text and icons
    STATIC_ABILITY: "Static Ability",
    CHAOS_ABILITY: "Chaos Ability",
    CHAOS_SYMBOL: "Chaos Symbol",
    PHENOMENON: "Phenomenon",
    TEXTBOX: "Textbox",

    // textbox references
    TEXTBOX_REFERENCE: "Textbox Reference",
    TEXTBOX_REFERENCE_LAND: "Textbox Reference Land",
    TEXTBOX_REFERENCE_ADVENTURE: "Textbox Reference - Adventure",
    MUTATE_REFERENCE: "Mutate Reference",
    PT_REFERENCE: "PT Adjustment Reference",
    PT_TOP_REFERENCE: "PT Top Reference",

    // planeswalker
    FIRST_ABILITY: "First Ability",
    SECOND_ABILITY: "Second Ability",
    THIRD_ABILITY: "Third Ability",
    FOURTH_ABILITY: "Fourth Ability",
    STARTING_LOYALTY: "Starting Loyalty",
    LOYALTY_GRAPHICS: "Loyalty Graphics",
    STATIC_TEXT: "Static Text",
    ABILITY_TEXT: "Ability Text",
    TEXT: "Text",
    COST: "Cost",

    // art frames
    ART_FRAME: "Art Frame",
    FULL_ART_FRAME: "Full Art Frame",
    BASIC_ART_FRAME: "Basic Art Frame",
    PLANESWALKER_ART_FRAME: "Planeswalker Art Frame",
    SCRYFALL_SCAN_FRAME: "Scryfall Scan Frame",

    // transform
    TF_FRONT: "tf-front",
    TF_BACK: "tf-back",
    MDFC_FRONT: "mdfc-front",
    MDFC_BACK: "mdfc-back",
    MOON_ELDRAZI_DFC: "mooneldrazidfc",

    // mdfc
    TOP: "Top",
    BOTTOM: "Bottom",
    LEFT: "Left",
    RIGHT: "Right",

    // classic
    NONLAND: "Nonland",
    LAND: "Land",
};

var default_layer = "Layer 1";

var BasicLandNames = [
    "Plains",
    "Island",
    "Swamp",
    "Mountain",
    "Forest",
    "Wastes",
    "Snow-Covered Plains",
    "Snow-Covered Island",
    "Snow-Covered Swamp",
    "Snow-Covered Mountain",
    "Snow-Covered Forest"
];

// Card faces
var Faces = {
    FRONT: 0,
    BACK: 1,
}

// Font names
var font_name_mplantin = "MPlantin";
var font_name_mplantin_italic = "MPlantin-Italic";
var font_name_ndpmtg = "NDPMTG";
var font_name_beleren_smallcaps = "Beleren Small Caps Bold";
var font_name_relay_medium = "Relay-Medium";

// Font spacing
var modal_indent = 5.7;
var line_break_lead = 2.4;
var flavour_text_lead = 4.4;

// Symbol colours
var rgb_c = new SolidColor();
rgb_c.rgb.red = 204;
rgb_c.rgb.green = 194;
rgb_c.rgb.blue = 193;

var rgb_w = new SolidColor();
rgb_w.rgb.red = 255;
rgb_w.rgb.green = 251;
rgb_w.rgb.blue = 214;

var rgb_u = new SolidColor();
rgb_u.rgb.red = 170;
rgb_u.rgb.green = 224;
rgb_u.rgb.blue = 250;

var rgb_b = new SolidColor();
rgb_b.rgb.red = 159;
rgb_b.rgb.green = 146;
rgb_b.rgb.blue = 143;

var rgb_r = new SolidColor();
rgb_r.rgb.red = 249;
rgb_r.rgb.green = 169;
rgb_r.rgb.blue = 143;

var rgb_g = new SolidColor();
rgb_g.rgb.red = 154;
rgb_g.rgb.green = 211;
rgb_g.rgb.blue = 175;

// Symbol colors JP Mystical Archive
var jrgb_c = new SolidColor();
jrgb_c.rgb.red = 61;
jrgb_c.rgb.green = 88;
jrgb_c.rgb.blue = 109;

var jrgb_w = new SolidColor();
jrgb_w.rgb.red = 138;
jrgb_w.rgb.green = 126;
jrgb_w.rgb.blue = 104;

var jrgb_u = new SolidColor();
jrgb_u.rgb.red = 0;
jrgb_u.rgb.green = 86;
jrgb_u.rgb.blue = 133;

var jrgb_b = new SolidColor();
jrgb_b.rgb.red = 41;
jrgb_b.rgb.green = 32;
jrgb_b.rgb.blue = 23;

var jrgb_r = new SolidColor();
jrgb_r.rgb.red = 135;
jrgb_r.rgb.green = 34;
jrgb_r.rgb.blue = 27;

var jrgb_g = new SolidColor();
jrgb_g.rgb.red = 24;
jrgb_g.rgb.green = 135;
jrgb_g.rgb.blue = 64;

var jrgb_back = new SolidColor();
jrgb_g.rgb.red = 245;
jrgb_g.rgb.green = 234;
jrgb_g.rgb.blue = 216;

// NDPMTG font dictionary to translate Scryfall symbols to font character sequences
var symbols = {
    "{W/P}": "Qp",
    "{U/P}": "Qp",
    "{B/P}": "Qp",
    "{R/P}": "Qp",
    "{G/P}": "Qp",
    "{W/U/P}": "Qqp",
    "{U/B/P}": "Qqp",
    "{B/R/P}": "Qqp",
    "{R/G/P}": "Qqp",
    "{G/W/P}": "Qqp",
    "{W/B/P}": "Qqp",
    "{B/G/P}": "Qqp",
    "{G/U/P}": "Qqp",
    "{U/R/P}": "Qqp",
    "{R/W/P}": "Qqp", // To do: Implement hybrid phyrexian
    "{E}": "e",
    "{T}": "ot",
    "{X}": "ox",
    "{0}": "o0",
    "{1}": "o1",
    "{2}": "o2",
    "{3}": "o3",
    "{4}": "o4",
    "{5}": "o5",
    "{6}": "o6",
    "{7}": "o7",
    "{8}": "o8",
    "{9}": "o9",
    "{10}": "oA",
    "{11}": "oB",
    "{12}": "oC",
    "{13}": "oD",
    "{14}": "oE",
    "{15}": "oF",
    "{16}": "oG",
    "{20}": "oK",
    "{W}": "ow",
    "{U}": "ou",
    "{B}": "ob",
    "{R}": "or",
    "{G}": "og",
    "{C}": "oc",
    "{W/U}": "QqLS",
    "{U/B}": "QqMT",
    "{B/R}": "QqNU",
    "{R/G}": "QqOV",
    "{G/W}": "QqPR",
    "{W/B}": "QqLT",
    "{B/G}": "QqNV",
    "{G/U}": "QqPS",
    "{U/R}": "QqMU",
    "{R/W}": "QqOR",
    "{2/W}": "QqWR",
    "{2/U}": "QqWS",
    "{2/B}": "QqWT",
    "{2/R}": "QqWU",
    "{2/G}": "QqWV",
    "{S}": "omn",
    "{Q}": "ol",
    "{CHAOS}": "?"
};

// Ability words which should be italicised in formatted text
var ability_words = [
    "Adamant",
    "Addendum",
    "Battalion",
    "Bloodrush",
    "Channel",
    "Chroma",
    "Cohort",
    "varellation",
    "Converge",
    "Council's dilemma",
    "Delirium",
    "Domain",
    "Eminence",
    "Enrage",
    "Fateful hour",
    "Ferocious",
    "Formidable",
    "Grandeur",
    "Hellbent",
    "Heroic",
    "Imprint",
    "Inspired",
    "Join forces",
    "Kinship",
    "Landfall",
    "Lieutenant",
    "Metalcraft",
    "Morbid",
    "Parley",
    "Radiance",
    "Raid",
    "Rally",
    "Revolt",
    "Spell mastery",
    "Strive",
    "Sweep",
    "Tempting offer",
    "Threshold",
    "Undergrowth",
    "Will of the council",
    "Magecraft",

    // AFR ability words
    "Antimagic Cone",
    "Fear Ray",
    "Pack tactics",
    "Acid Breath",
    "Teleport",
    "Lightning Breath",
    "Wild Magic Surge",
    "Two-Weapon Fighting",
    "Archery",
    "Bear Form",
    "Mage Hand",
    "Cure Wounds",
    "Dispel Magic",
    "Gentle Reprise",
    "Beacon of Hope",
    "Displacement",
    "Drag Below",
    "Siege Monster",
    "Dark One's Own Luck",
    "Climb Over",
    "Tie Up",
    "Rappel Down",
    "Rejuvenation",
    "Engulf",
    "Dissolve",
    "Poison Breath",
    "Tragic Backstory",
    "Cunning Action",
    "Stunning Strike",
    "Circle of Death",
    "Bardic Inspiration",
    "Song of Rest",
    "Sneak Attack",
    "Tail Spikes",
    "Dominate Monster",
    "Flurry of Blows",
    "Divine Intervention",
    "Split",
    "Magical Tinkering",
    "Keen Senses",
    "Grant an Advantage",
    "Smash the Chest",
    "Pry It Open",
    "Fire Breath",
    "Cone of Cold",
    "Brave the Stench",
    "Search the Body",
    "Bewitching Whispers",
    "Whispers of the Grave",
    "Animate Walking Statue",
    "Trapped!",
    "Invoke Duplicity",
    "Combat Inspiration",
    "Cold Breath",
    "Life Drain",
    "Fight the Current",
    "Find a Crossing",
    "Intimidate Them",
    "Fend Them Off",
    "Smash It",
    "Lift the Curse",
    "Steal Its Eyes",
    "Break Their Chains",
    "Interrogate Them",
    "Foil Their Scheme",
    "Learn Their Secrets",
    "Journey On",
    "Make Camp",
    "Rouse the Party",
    "Set Off Traps",
    "Form a Party",
    "Start a Brawl",
    "Make a Retreat",
    "Stand and Fight",
    "Distract the Guards",
    "Hide",
    "Charge Them",
    "Befriend Them",
    "Negative Energy Cone",

    // Midnight Hunt words
    "Coven",

    // CLB abilities
    "Mold Earth",
];

// Card rarities
rarity_common = "common";
rarity_uncommon = "uncommon";
rarity_rare = "rare";
rarity_mythic = "mythic";
rarity_special = "special";
rarity_bonus = "bonus";

// Map card classes to template classes
// (have to insert one at a time - otherwise the key will be the variable name)
class_template_map[normal_class] = {
    default_: NormalTemplate,
    other: [
        NormalClassicTemplate,
        NormalExtendedTemplate,
		NormalFullartTemplate,
        WomensDayTemplate,
        StargazingTemplate,
        MasterpieceTemplate,
        ExpeditionTemplate,
        MiracleTemplate,
        SnowTemplate,
    ],
};
class_template_map[transform_front_class] = {
    default_: TransformFrontTemplate,
    other: [],
};
class_template_map[transform_back_class] = {
    default_: TransformBackTemplate,
    other: [],
};
class_template_map[ixalan_class] = {
    default_: IxalanTemplate,
    other: [],
};
class_template_map[mdfc_front_class] = {
    default_: MDFCFrontTemplate,
    other: [],
};
class_template_map[mdfc_back_class] = {
    default_: MDFCBackTemplate,
    other: [],
};
class_template_map[mutate_class] = {
    default_: MutateTemplate,
    other: [],
};
class_template_map[adventure_class] = {
    default_: AdventureTemplate,
    other: [],
};
class_template_map[leveler_class] = {
    default_: LevelerTemplate,
    other: [],
};
class_template_map[saga_class] = {
    default_: SagaTemplate,
    other: [],
};
class_template_map[miracle_class] = {
    default_: MiracleTemplate,
    other: [],
};
class_template_map[planeswalker_class] = {
    default_: PlaneswalkerExtendedTemplate,
    other: [
        PlaneswalkerExtendedTemplate,
    ],
};
class_template_map[snow_class] = {
    default_: SnowTemplate,
    other: [],
};
class_template_map[basic_class] = {
    default_: BasicLandTherosTemplate,
    other: [
        BasicLandTemplate,
        BasicLandClassicTemplate,
        BasicLandUnstableTemplate,
    ],
};
class_template_map[planar_class] = {
    default_: PlanarTemplate,
    other: [],
};

// Function to automatically choose set symbol
// TODO: Use dictionary
function generate_set_symbol ( set ) {

    set = set.toUpperCase();

    if ( set == "LEA" ) var output = "";
    else if ( set == "LEB" ) var output = "";
    else if ( set == "2ED" ) var output = "";
    else if ( set == "ARN" ) var output = "";
    else if ( set == "ATQ" ) var output = "";
    else if ( set == "3ED" ) var output = "";
    else if ( set == "LEG" ) var output = "";
    else if ( set == "DRK" ) var output = "";
    else if ( set == "FEM" ) var output = "";
    else if ( set == "4ED" ) var output = "";
    else if ( set == "ICE" ) var output = "";
    else if ( set == "CHR" ) var output = "";
    else if ( set == "HML" ) var output = "";
    else if ( set == "ALL" ) var output = "";
    else if ( set == "MIR" ) var output = "";
    else if ( set == "VIS" ) var output = "";
    else if ( set == "5ED" ) var output = "";
    else if ( set == "POR" ) var output = "";
    else if ( set == "WTH" ) var output = "";
    else if ( set == "TMP" ) var output = "";
    else if ( set == "STH" ) var output = "";
    else if ( set == "EXO" ) var output = "";
    else if ( set == "P02" ) var output = "";
    else if ( set == "UGL" ) var output = "";
    else if ( set == "USG" ) var output = "";
    else if ( set == "ATH" ) var output = "";
    else if ( set == "ULG" ) var output = "";
    else if ( set == "6ED" ) var output = "";
    else if ( set == "PTK" ) var output = "";
    else if ( set == "UDS" ) var output = "";
    else if ( set == "S99" ) var output = "";
    else if ( set == "MMQ" ) var output = "";
    else if ( set == "BRB" ) var output = "";
    else if ( set == "NEM" ) var output = "";
    else if ( set == "S00" ) var output = "";
    else if ( set == "PCY" ) var output = "";
    else if ( set == "INV" ) var output = "";
    else if ( set == "BTD" ) var output = "";
    else if ( set == "PLS" ) var output = "";
    else if ( set == "7ED" ) var output = "";
    else if ( set == "APC" ) var output = "";
    else if ( set == "ODY" ) var output = "";
    else if ( set == "DKM" ) var output = "";
    else if ( set == "TOR" ) var output = "";
    else if ( set == "JUD" ) var output = "";
    else if ( set == "ONS" ) var output = "";
    else if ( set == "LGN" ) var output = "";
    else if ( set == "SCG" ) var output = "";
    else if ( set == "8ED" ) var output = "";
    else if ( set == "MRD" ) var output = "";
    else if ( set == "DST" ) var output = "";
    else if ( set == "5DN" ) var output = "";
    else if ( set == "CHK" ) var output = "";
    else if ( set == "UNH" ) var output = "";
    else if ( set == "BOK" ) var output = "";
    else if ( set == "SOK" ) var output = "";
    else if ( set == "9ED" ) var output = "";
    else if ( set == "RAV" ) var output = "";
    else if ( set == "GPT" ) var output = "";
    else if ( set == "DIS" ) var output = "";
    else if ( set == "CSP" ) var output = "";
    else if ( set == "TSP" ) var output = "";
    else if ( set == "PLC" ) var output = "";
    else if ( set == "FUT" ) var output = "";
    else if ( set == "10E" ) var output = "";
    else if ( set == "MED" ) var output = "";
    else if ( set == "LRW" ) var output = "";
    else if ( set == "EVG" ) var output = "";
    else if ( set == "MOR" ) var output = "";
    else if ( set == "SHM" ) var output = "";
    else if ( set == "EVE" ) var output = "";
    else if ( set == "DRB" ) var output = "";
    else if ( set == "ME2" ) var output = "";
    else if ( set == "ALA" ) var output = "";
    else if ( set == "DD2" ) var output = "";
    else if ( set == "CON" ) var output = "";
    else if ( set == "DDC" ) var output = "";
    else if ( set == "ARB" ) var output = "";
    else if ( set == "M10" ) var output = "";
    else if ( set == "V09" ) var output = "";
    else if ( set == "HOP" ) var output = "";
    else if ( set == "ME3" ) var output = "";
    else if ( set == "ZEN" ) var output = "";
    else if ( set == "DDD" ) var output = "";
    else if ( set == "H09" ) var output = "";
    else if ( set == "WWK" ) var output = "";
    else if ( set == "DDE" ) var output = "";
    else if ( set == "ROE" ) var output = "";
    else if ( set == "DPA" ) var output = "";
    else if ( set == "ARC" ) var output = "";
    else if ( set == "M11" ) var output = "";
    else if ( set == "V10" ) var output = "";
    else if ( set == "DDF" ) var output = "";
    else if ( set == "SOM" ) var output = "";
    //else if ( set == "TD0" ) var output = ""; MTGO
    else if ( set == "PD2" ) var output = "";
    else if ( set == "ME4" ) var output = "";
    else if ( set == "MBS" ) var output = "";
    else if ( set == "DDG" ) var output = "";
    else if ( set == "NPH" ) var output = "";
    else if ( set == "CMD" ) var output = "";
    else if ( set == "M12" ) var output = "";
    else if ( set == "V11" ) var output = "";
    else if ( set == "DDH" ) var output = "";
    else if ( set == "ISD" ) var output = "";
    else if ( set == "PD3" ) var output = "";
    else if ( set == "DKA" ) var output = "";
    else if ( set == "DDI" ) var output = "";
    else if ( set == "AVR" ) var output = "";
    else if ( set == "PC2" ) var output = "";
    else if ( set == "M13" ) var output = "";
    else if ( set == "V12" ) var output = "";
    else if ( set == "DDJ" ) var output = "";
    else if ( set == "RTR" ) var output = "";
    else if ( set == "CM1" ) var output = "";
    else if ( set == "TD2" ) var output = "";
    else if ( set == "GTC" ) var output = "";
    else if ( set == "DDK" ) var output = "";
    else if ( set == "DGM" ) var output = "";
    else if ( set == "MMA" ) var output = "";
    else if ( set == "M14" ) var output = "";
    else if ( set == "V13" ) var output = "";
    else if ( set == "DDL" ) var output = "";
    else if ( set == "THS" ) var output = "";
    else if ( set == "C13" ) var output = "";
    else if ( set == "BNG" ) var output = "";
    else if ( set == "DDM" ) var output = "";
    else if ( set == "JOU" ) var output = "";
    else if ( set == "MD1" ) var output = "";
    else if ( set == "CNS" ) var output = "";
    else if ( set == "VMA" ) var output = "";
    else if ( set == "M15" ) var output = "";
    else if ( set == "V14" ) var output = "";
    else if ( set == "DDN" ) var output = "";
    else if ( set == "KTK" ) var output = "";
    else if ( set == "C14" ) var output = "";
    else if ( set == "FRF" ) var output = "";
    else if ( set == "DDO" ) var output = "";
    else if ( set == "DTK" ) var output = "";
    else if ( set == "TPR" ) var output = "";
    else if ( set == "MM2" ) var output = "";
    else if ( set == "ORI" ) var output = "";
    else if ( set == "V15" ) var output = "";
    else if ( set == "DDP" ) var output = "";
    else if ( set == "BFZ" ) var output = "";
    else if ( set == "EXP" ) var output = "";
    else if ( set == "C15" ) var output = "";
    else if ( set == "PZ1" ) var output = "";
    else if ( set == "OGW" ) var output = "";
    else if ( set == "DDQ" ) var output = "";
    else if ( set == "W16" ) var output = "";
    else if ( set == "SOI" ) var output = "";
    else if ( set == "EMA" ) var output = "";
    else if ( set == "EMN" ) var output = "";
    else if ( set == "V16" ) var output = "";
    else if ( set == "CN2" ) var output = "";
    else if ( set == "DDR" ) var output = "";
    else if ( set == "KLD" ) var output = "";
    else if ( set == "MPS" ) var output = "";
    else if ( set == "PZ2" ) var output = "";
    else if ( set == "C16" ) var output = "";
    else if ( set == "PCA" ) var output = "";
    else if ( set == "AER" ) var output = "";
    else if ( set == "MM3" ) var output = "";
    else if ( set == "DDS" ) var output = "";
    else if ( set == "W17" ) var output = "";
    else if ( set == "AKH" ) var output = "";
    else if ( set == "MP2" ) var output = "";
    else if ( set == "CMA" ) var output = "";
    else if ( set == "E01" ) var output = "";
    else if ( set == "HOU" ) var output = "";
    else if ( set == "C17" ) var output = "";
    else if ( set == "XLN" ) var output = "";
    else if ( set == "DDT" ) var output = "";
    else if ( set == "IMA" ) var output = "";
    else if ( set == "E02" ) var output = "";
    else if ( set == "V17" ) var output = "";
    else if ( set == "UST" ) var output = "";
    else if ( set == "RIX" ) var output = "";
    else if ( set == "A25" ) var output = "";
    else if ( set == "DDU" ) var output = "";
    else if ( set == "DOM" ) var output = "";
    else if ( set == "CM2" ) var output = "";
    else if ( set == "BBD" ) var output = "";
    else if ( set == "SS1" ) var output = "";
    else if ( set == "GS1" ) var output = "";
    else if ( set == "M19" ) var output = "";
    else if ( set == "C18" ) var output = "";
    else if ( set == "MED" ) var output = "";
    else if ( set == "GRN" ) var output = "";
    else if ( set == "GNT" ) var output = "";
    else if ( set == "UMA" ) var output = "";
    else if ( set == "MED" ) var output = "";
    else if ( set == "RNA" ) var output = "";
    else if ( set == "WAR" ) var output = "";
    else if ( set == "MH1" ) var output = "";
    else if ( set == "SS2" ) var output = "";
    else if ( set == "M20" ) var output = "";
    else if ( set == "C19" ) var output = "";
    else if ( set == "ELD" ) var output = "";
    else if ( set == "GN2" ) var output = "";
    else if ( set == "THB" ) var output = "";
    else if ( set == "UND" ) var output = "";
    else if ( set == "IKO" ) var output = "";
    else if ( set == "C20" ) var output = "";
    else if ( set == "SS3" ) var output = "";
    else if ( set == "M21" ) var output = "";
    else if ( set == "JMP" ) var output = "";
    else if ( set == "2XM" ) var output = "";
    else if ( set == "AKR" ) var output = "";
    else if ( set == "ZNR" ) var output = "";
    else if ( set == "ZNE" ) var output = "";
    else if ( set == "ZNC" ) var output = "";
    else if ( set == "KLR" ) var output = "";
    else if ( set == "CMR" ) var output = "";
    else if ( set == "CMC" ) var output = "";
    else if ( set == "CC1" ) var output = "";
    else if ( set == "KHM" ) var output = "";
    else if ( set == "KHC" ) var output = "";
    else if ( set == "TSR" ) var output = "";
    else if ( set == "STX" ) var output = "";
    else if ( set == "STA" ) var output = "";
    else if ( set == "C21" ) var output = "";
    else if ( set == "MH2" ) var output = "";
    else if ( set == "AFR" ) var output = "";
    else if ( set == "AFC" ) var output = "";
    else if ( set == "SLD" ) var output = "";
    else if ( set == "J21" ) var output = "";
    else if ( set == "MID" ) var output = "";
    else if ( set == "MIC" ) var output = "";
    else if ( set == "DCI" ) var output = ""; // Judge Promo
    else if ( set == "VOW" ) var output = "";
    else if ( set == "VOC" ) var output = "";
    else if ( set == "NEO" ) var output = "";
    else if ( set == "UNF" ) var output = "";
    else if ( set == "Y22" ) var output = "";
	else if ( set == "CC2" ) var output = "";
	else if ( set == "40K" ) var output = "";
	else if ( set == "SNC" ) var output = "";
	else if ( set == "DMU" ) var output = "";
	else if ( set == "BRO" ) var output = "";
	else if ( set == "ONE" ) var output = "";
	else if ( set == "DMR" ) var output = "";
	else if ( set == "2X2" ) var output = "";
	else if ( set == "J22" ) var output = "";
	else if ( set == "NEC" ) var output = "";
	else if ( set == "40K" ) var output = "";
	else if ( set == "CLB" ) var output = "";
	else if ( set == "BRC" ) var output = "";
	else if ( set == "DMC" ) var output = "";
	else if ( set == "MOM" ) var output = "";
    else var output = expansion_symbol_character;
    return output;

}