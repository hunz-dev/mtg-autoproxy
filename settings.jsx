#include "scripts/constants.jsx";
#include "scripts/templates.jsx";
#include "scripts/helpers.jsx";
includeFolder("scripts/plugins");

// Default expansion symbol - character copied from Keyrune cheatsheet
var expansion_symbol_character = "";  // Cube symbol by default ()

// Specify a template to use (if the card's layout is compatible) rather than the default template
var specified_template = null;
//var specified_template = SilvanExtendedTemplate; // EXTENDED - Looks like WillieTanner proxies
//var specified_template = SilvanMDFCFrontTemplate; // EXTENDED - WT proxies for mdfc
//var specified_template = NormalExtendedTemplate; // EXTENDED - OG Chilli extended
//var specified_template = WomensDayTemplate; // FULLART - 2XM Showcase
//var specified_template = MasterpieceTemplate; // FULLART - Hour of devastation masterpiece
//var specified_template = SnowTemplate; // REGULAR - Snow 
//var specified_template = SketchTemplate; // REGULAR - MH2 Sketch
//var specified_template = StargazingTemplate; // FULLART - Nyx secret lair
//var specified_template = ExpeditionTemplate; // FULLART - Zendikar Rising expedition
//var specified_template = NormalClassicTemplate; // REGULAR - Cassic mtg frame
//var specified_template = BasicLandClassicTemplate; // REGULAR - Classic mtg basics frame
//var specified_template = MiracleTemplate; // REGULAR - Miracle frame ex: Temporal Mastery
//var specified_template = KaldheimTemplate; // REGULAR - Kaldheim showcase
//var specified_template = PhyrexianTemplate; // REGULAR - Secret lair praetor showcase
//var specified_template = CrimsonFangTemplate; // REGULAR - Crimson Vow showcase
//var specified_template = [NormalTemplate, KaldheimTemplate, SilvanExtendedTemplate, NormalClassicTemplate]; // Do multiple templates at a time

// Specify whether to end the script when the card is finished being formatted (for manual intervention)
var exit_early = false;

// Automatically input and size set symbol, change outline thickness
var automatic_set_symbol = true;
var automatic_set_symbol_size = true;
var expansion_symbol_stroke_weight = 6; // 4-6 generally, 6 is default

// Remove the flavour or reminder text
var remove_flavour_text = false;
var remove_reminder_text = false;

// Realistic collector info? (requires the LATEST PSD files
var real_collector_info = true;

// Enable fast saving? Results in much large file sizes
var fast_saving = false;

// Choose file extension, advanced users only
var file_extension = ".psd";