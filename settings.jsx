#include "scripts/templates.jsx";

// Expansion symbol - characters copied from Keyrune cheatsheet
var expansion_symbol_character = "";  // M
//var expansion_symbol_character = "";  // Cube

// Specify a template to use (if the card's layout is compatible) rather than the default template
var specified_template = null;
//var specified_template = SilvanExtendedTemplate; // EXTENDED - Looks like WillieTanner proxies
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
//var specified_template = [CrimsonFangTemplate]; // Do multiple templates at a time

// Specify whether to end the script when the card is finished being formatted (for manual intervention)
var exit_early = false;
//var exit_early = true;

// Specify whethere to attempt to automatically input appropriate set symbol
//var automatic_set_symbol = false;
var automatic_set_symbol = true;

// Manually set size, line shift to position set symbol, useful for classic templates
// Manually set stroke weight for thicker or thinner outline
var expansion_symbol_size = null; // (9.8 Classic) (13 MID)
var expansion_symbol_shift = null; // (-.2 Classic) (-1.4 MID)
var expansion_symbol_stroke_weight = 5; // 4-6 generally, 6 is default

// Remove the flavour text
var remove_flavour_text = false;
//var remove_flavour_text = true;

// Remove the reminder text
var remove_reminder_text = false;
//var remove_reminder_text = true;

// Realistic collector info? (requires the LATEST PSD files
//var real_collector_info = false;
var real_collector_info = true;

// MY STUFF -- File extension
var file_extension = ".psd";
//var file_extension = ".psb";

// Function to automatically choose set symbol
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
	else if ( set == "DCI" ) var output = ""; //Judge Promo
	else if ( set == "VOW" ) var output = "";
	else if ( set == "VOC" ) var output = "";
	else if ( set == "NEO" ) var output = "";
	else if ( set == "UNF" ) var output = "";
	else if ( set == "Y22" ) var output = "";
	else var output = expansion_symbol_character;
	
	return output;
	
}