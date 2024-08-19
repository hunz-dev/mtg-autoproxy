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

// Set symbols
var set_symbols = {
	"2X2": "",
	"40K": "",
	"40K": "",
	"BRC": "",
	"BRO": "",
	"CC2": "",
	"CLB": "",
	"DMC": "",
	"DMR": "",
	"DMU": "",
	"J22": "",
	"LCI": "",
	"LTR": "",
	"MAT": "",
	"MKC": "",
	"MKM": "",
	"MOC": "",
	"MOM": "",
	"NEC": "",
	"ONE": "",
	"PTG": "",
	"PTG": "",
	"SNC": "",
	"WHO": "",
	"WOC": "",
    "10E": "",
    "2ED": "",
    "2XM": "",
    "3ED": "",
    "4ED": "",
    "5DN": "",
    "5ED": "",
    "6ED": "",
    "7ED": "",
    "8ED": "",
    "9ED": "",
    "A25": "",
    "AER": "",
    "AFC": "",
    "AFR": "",
    "AKH": "",
    "AKR": "",
    "ALA": "",
    "ALL": "",
    "APC": "",
    "ARB": "",
    "ARC": "",
    "ARN": "",
    "ATH": "",
    "ATQ": "",
    "AVR": "",
    "BBD": "",
    "BFZ": "",
    "BNG": "",
    "BOK": "",
    "BRB": "",
    "BTD": "",
    "C13": "",
    "C14": "",
    "C15": "",
    "C16": "",
    "C17": "",
    "C18": "",
    "C19": "",
    "C20": "",
    "C21": "",
    "CC1": "",
    "CHK": "",
    "CHR": "",
    "CM1": "",
    "CM2": "",
    "CMA": "",
    "CMC": "",
    "CMD": "",
    "CMR": "",
    "CN2": "",
    "CNS": "",
    "CON": "",
    "CSP": "",
    "DCI": "", // Judge Promo
    "DD2": "",
    "DDC": "",
    "DDD": "",
    "DDE": "",
    "DDF": "",
    "DDG": "",
    "DDH": "",
    "DDI": "",
    "DDJ": "",
    "DDK": "",
    "DDL": "",
    "DDM": "",
    "DDN": "",
    "DDO": "",
    "DDP": "",
    "DDQ": "",
    "DDR": "",
    "DDS": "",
    "DDT": "",
    "DDU": "",
    "DGM": "",
    "DIS": "",
    "DKA": "",
    "DKM": "",
    "DOM": "",
    "DPA": "",
    "DRB": "",
    "DRK": "",
    "DST": "",
    "DTK": "",
    "E01": "",
    "E02": "",
    "ELD": "",
    "EMA": "",
    "EMN": "",
    "EVE": "",
    "EVG": "",
    "EXO": "",
    "EXP": "",
    "FEM": "",
    "FRF": "",
    "FUT": "",
    "GN2": "",
    "GNT": "",
    "GPT": "",
    "GRN": "",
    "GS1": "",
    "GTC": "",
    "H09": "",
    "HML": "",
    "HOP": "",
    "HOU": "",
    "ICE": "",
    "IKO": "",
    "IMA": "",
    "INV": "",
    "ISD": "",
    "J21": "",
    "JMP": "",
    "JOU": "",
    "JUD": "",
    "KHC": "",
    "KHM": "",
    "KLD": "",
    "KLR": "",
    "KTK": "",
    "LEA": "",
    "LEB": "",
    "LEG": "",
    "LGN": "",
    "LRW": "",
    "LTC": "",
    "M10": "",
    "M11": "",
    "M12": "",
    "M13": "",
    "M14": "",
    "M15": "",
    "M19": "",
    "M20": "",
    "M21": "",
    "MBS": "",
    "MD1": "",
    "ME2": "",
    "ME3": "",
    "ME4": "",
    "MED": "",
    "MED": "",
    "MED": "",
    "MH1": "",
    "MH2": "",
    "MIC": "",
    "MID": "",
    "MIR": "",
    "MM2": "",
    "MM3": "",
    "MMA": "",
    "MMQ": "",
    "MOR": "",
    "MP2": "",
    "MPS": "",
    "MRD": "",
    "NEM": "",
    "NEO": "",
    "NPH": "",
    "ODY": "",
    "OGW": "",
    "ONS": "",
    "ORI": "",
    "OTJ": "",
    "P02": "",
    "PC2": "",
    "PCA": "",
    "PCY": "",
    "PD2": "",
    "PD3": "",
    "PLC": "",
    "PLS": "",
    "POR": "",
    "PTK": "",
    "PZ1": "",
    "PZ2": "",
    "RAV": "",
    "RIX": "",
    "RNA": "",
    "ROE": "",
    "RTR": "",
    "S00": "",
    "S99": "",
    "SCG": "",
    "SHM": "",
    "SLD": "",
    "SOI": "",
    "SOK": "",
    "SOM": "",
    "SS1": "",
    "SS2": "",
    "SS3": "",
    "STA": "",
    "STH": "",
    "STX": "",
    "TD2": "",
    "THB": "",
    "THS": "",
    "TMP": "",
    "TOR": "",
    "TPR": "",
    "TSP": "",
    "TSR": "",
    "UDS": "",
    "UGL": "",
    "ULG": "",
    "UMA": "",
    "UND": "",
    "UNF": "",
    "UNH": "",
    "USG": "",
    "UST": "",
    "V09": "",
    "V10": "",
    "V11": "",
    "V12": "",
    "V13": "",
    "V14": "",
    "V15": "",
    "V16": "",
    "V17": "",
    "VIS": "",
    "VMA": "",
    "VOC": "",
    "VOW": "",
    "W16": "",
    "W17": "",
    "WAR": "",
    "WTH": "",
    "WWK": "",
    "XLN": "",
    "Y22": "",
    "ZEN": "",
    "ZNC": "",
    "ZNE": "",
    "ZNR": "",
}

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

function generate_set_symbol(set) {
    set = set.toUpperCase();
    return set in set_symbols ? set_symbols[set] : default_expansion_symbol_character;
}
