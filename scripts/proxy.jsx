function proxy(file, ye) {
  var expansionSymbol = ""; // Feather
  var filePath = File($.fileName).parent.parent.fsName;
  $.evalFile(filePath + "/scripts/json2.js");

  // Retrieve the card's name from the given filepath
  var filename;
  if (ye == 1) filename = decodeURI(file.name);
  else filename = decodeURI(file[0].name);
  fullCardName = filename.slice(0, filename.lastIndexOf("."));

  // Retrieve the card's name and artist
  var openIndex = fullCardName.lastIndexOf(" (");
  var closeIndex = fullCardName.lastIndexOf(")");
  var cardName = ""; var cardArtist = "";
  if (openIndex < 0 || closeIndex < 0) {
    // File name didn't include the artist name - retrieve it from card.json
    cardName = fullCardName;
  } else {
    // File name includes artist name - slice and dice
    cardArtist = fullCardName.slice(openIndex + 2, closeIndex);
    cardName = fullCardName.slice(0, openIndex);
  }


  if (cardName == "Plains" || cardName == "Island" || cardName == "Swamp" || cardName == "Mountain" || cardName == "Forest") {
    proxyBasic(cardName, cardArtist, ye, expansionSymbol);
  } else {
    // Run Python script to get info from Scryfall
    // Execute this with different commands, depending on operating system
    // Assumes users are only using either Windows or macOS
    // Thanks to jamesthe500 on stackoverflow for the OS-detecting code
    if ($.os.search(/windows/i) != -1) {
      // Windows
      app.system("python get_card_info.py \"" + cardName + "\"");
    } else {
      // macOS
      app.system("/usr/local/bin/python3 " + filePath + "/scripts/get_card_info.py \"" + cardName + "\" >> " + filePath + "/scripts/debug.log 2>&1");
    }

    var cardJSONFile = new File(filePath + "/scripts/card.json");
    cardJSONFile.open('r');
    var cardJSON = cardJSONFile.read();
    cardJSONFile.close();

    // Why do we have to parse this twice? To be honest only God knows lmao
    var jsonParsed = JSON.parse(JSON.parse(cardJSON));

    // If no artist name was supplied, use the name from Scryfall
    if (cardArtist == "") cardArtist = jsonParsed.artist;

    proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol);
  }
}

function proxyBasic(cardName, cardArtist, ye, expansionSymbol) {
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");

  templateName = "basic";
  var fileRef = new File(filePath + "/templates/classic-basic.psd");
  app.open(fileRef);

  var docRef = app.activeDocument;

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);
  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);
  docRef.paste();

  // Create a reference to the active document for convenience
  docRef = app.activeDocument;
  var textAndIcons = docRef.layers.getByName("Text and Icons");

  // Move art into position
  var artLayerFrameName = "Basic Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"));

  // Rarity gradient
  textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
  gradient(textAndIcons, "common");

  docRef.layers.getByName(cardName).visible = true;
  replaceText("Artist", cardArtist);

  saveImage(cardName + " (" + cardArtist + ")");
}

function proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol) {

  // Load in json2.js and some function files
  $.evalFile(filePath + "/scripts/json2.js");
  $.evalFile(filePath + "/scripts/formatText.jsx");
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");
  $.evalFile(filePath + "/scripts/framelogic.jsx");

  var fileRef;
  fileRef = new File(filePath + "/templates/classic-normal.psd");

  app.open(fileRef);

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);

  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;
  var textAndIcons = docRef.layers.getByName("Text and Icons");

  // Retrieve some more info about the card.
  var typeLine = jsonParsed.type;
  var cardPower = jsonParsed.power;
  var cardTough = jsonParsed.toughness;
  var cardText = jsonParsed.text;
  var cardRarity = jsonParsed.rarity;
  var flavourText = jsonParsed.flavourText;
  var cardManaCost = jsonParsed.manaCost;

  // Run the layer selection algorithm
  selectedLayers = selectFrameLayers(jsonParsed);

  // Paste art and move it into position
  docRef.paste();
  var artLayerFrame = docRef.layers.getByName("Art Frame");
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"));

  // Set up some layer name & other utility variables
  var cardnameLayerName = "Card Name";
  var typelineLayerName = "Typeline";
  var textLayerName = "Rules Text";
  var nameboxName = "Name & Title Boxes";
  var pinlinesName = "Pinlines & Textbox";
  var ptBoxGroup = "PT Box";
  var isCreature = cardPower != null && cardTough != null;
  var textColour = new SolidColor();
  textColour.rgb.red = 255.0; textColour.rgb.blue = 255.0; textColour.rgb.green = 255.0;

  var frameGroupName = "Nonland";
  var frameName; var frameGroup;
  // alert(selectedLayers);
  if (typeLine.indexOf("Land") >= 0) {
    frameGroupName = "Land";
    frameName = selectedLayers[1];

    frameGroup = docRef.layers.getByName("Land");
    frameGroup.layers.getByName(selectedLayers[1]).visible = true;
  }
  else {
    frameGroup = docRef.layers.getByName("Nonland");
    if (selectedLayers[1].length == 2) frameName = "Gold";
    else frameName = selectedLayers[1];
  }

  frameGroup = docRef.layers.getByName(frameGroupName);
  frameGroup.layers.getByName(frameName).visible = true;

  // Rarity gradient
  textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
  gradient(textAndIcons, cardRarity);

  // Insert basic text fields
  replaceText("Artist", cardArtist);
  insertManaCost(textAndIcons, cardManaCost);
  insertName(textAndIcons, cardName, cardnameLayerName);
  insertTypeline(textAndIcons, typeLine, typelineLayerName);

  // P/T Text
  var ptLayer = textAndIcons.layers.getByName("Power / Toughness");
  if (isCreature) {
    ptLayer.textItem.contents = cardPower + "/" + cardTough;
  } else ptLayer.visible = false;

  // ---------- Rules Text ----------
  var rulesTextLayer = textAndIcons.layers.getByName(textLayerName);
  if (cardText !== undefined) cardText = cardText.replace(/\n/g, "\r");
  else cardText = "";
  rulesTextLayer.textItem.contents = cardText;

  // ---------- Italics Text ----------
  // Build an array of italics text, starting with identifying any
  // reminder text in the card's text body (anything in brackets).
  var reminderTextBool = true;

  var italicText = [];
  endIndex = 0;
  while (reminderTextBool) {
    startIndex = cardText.indexOf("(", endIndex);
    if (startIndex >= 0) {
      endIndex = cardText.indexOf(")", startIndex + 1);
      italicText.push(cardText.slice(startIndex, endIndex + 1));
    } else {
      reminderTextBool = false;
    }
  }

  // Also attach the ability word Threshold and the cards' flavour text
  // to the italics array.
  var flavourIndex = -1;
  const abilityWords = [
    "Adamant",
    "Addendum",
    "Battalion",
    "Bloodrush",
    "Channel",
    "Chroma",
    "Cohort",
    "Constellation",
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
    "Will of the council"
  ];

  for (var i = 0; i < abilityWords.length; i++) {
    italicText.push(abilityWords[i] + " \u2014"); // Include em dash
  }

  if (flavourText.length > 1) {
    flavourText = flavourText.replace(/\n/g, "\r");
    italicText.push(flavourText);
    flavourIndex = cardText.length;
  }
  // Jam the rules text and flavour text together
  var completeString = "";
  if (flavourText.length > 0) {
    completeString = cardText + "\r" + flavourText;
  } else {
    completeString = cardText;
  }

  // Maybe centre justify the text box
  var centredText = flavourText.length <= 1 && cardText.length <= 70 && cardText.indexOf("\r") < 0;

  // Insert those mana symbols and italic text
  docRef.activeLayer = rulesTextLayer;
  formatText(completeString, italicText, flavourIndex, centredText);
  if (centredText) rulesTextLayer.textItem.justification = Justification.CENTER;

  // Scale the text to fit in the text box
  var textboxReference = "Textbox Reference";
  if (typeLine.indexOf("Land") >= 0) textboxReference = "Textbox Reference Land";
  var textboxRef = textAndIcons.layers.getByName(textboxReference);
  var tolerance = new UnitValue(10, "px"); // 10 px tolerance from textbox reference
  var layerHeight = textboxRef.bounds[3] - textboxRef.bounds[1] - tolerance.as("cm");
  var scaled = scaleTextToFitBox(rulesTextLayer, layerHeight);

  // Align card text in text box
  verticallyAlignText(textLayerName);

  // Write image to file and close document
  saveImage(cardName);
}

function insertManaCost(textAndIcons, cardManaCost) {
  var docRef = app.activeDocument;
  // textAndIcons = docRef.layers.getByName("Text and Icons");
  manaCostLayer = textAndIcons.layers.getByName("Mana Cost");
  if (cardManaCost != "") {
    $.evalFile(filePath + "/scripts/formatText.jsx");
    docRef.activeLayer = manaCostLayer;
    formatText(cardManaCost, [], -1, false);
    docRef.activeLayer.name = "Mana Cost";
  } else {
    manaCostLayer.visible = false;
  }
}

function insertName(textAndIcons, cardName, cardnameLayerName) {
  var docRef = app.activeDocument;
  // var textAndIcons = docRef.layers.getByName("Text and Icons");
  var cardnameLayer = textAndIcons.layers.getByName(cardnameLayerName);
  cardnameLayer.textItem.contents = cardName;

  // Scale down the name to fit in case it's too long
  var symbolLeftBound = textAndIcons.layers.getByName("Mana Cost").bounds[0];
  var typelineRightBound = cardnameLayer.bounds[2];
  var nameFontSize = cardnameLayer.textItem.size;
  while (typelineRightBound > symbolLeftBound - new UnitValue(16, "px")) { // minimum 16 px gap
    cardnameLayer.textItem.size = new UnitValue(nameFontSize - 1, "px");
    nameFontSize = nameFontSize - 1;
    typelineRightBound = cardnameLayer.bounds[2];
  }
}

function insertTypeline(textAndIcons, typeLine, typelineLayerName) {
  var docRef = app.activeDocument;
  // textAndIcons = docRef.layers.getByName("Text and Icons");
  var typelineLayer = textAndIcons.layers.getByName(typelineLayerName);
  typelineLayer.textItem.contents = typeLine;

  // Scale down the typeline to fit in case it's too long
  var symbolLeftBound = textAndIcons.layers.getByName("Expansion Symbol").bounds[0];
  var typelineRightBound = typelineLayer.bounds[2];
  var typelineFontSize = typelineLayer.textItem.size;
  while (typelineRightBound > symbolLeftBound) {
    typelineLayer.textItem.size = new UnitValue(typelineFontSize - 1, "px");
    typelineFontSize = typelineFontSize - 1;
    typelineRightBound = typelineLayer.bounds[2];
  }
}

function saveImage(cardName) {
  var docRef = app.activeDocument;
  // ----------Save as PNG in the out folder ----------
  var idsave = charIDToTypeID("save");
  var desc3 = new ActionDescriptor();
  var idAs = charIDToTypeID("As  ");
  var desc4 = new ActionDescriptor();
  var idPGIT = charIDToTypeID("PGIT");
  var idPGIN = charIDToTypeID("PGIN");
  desc4.putEnumerated(idPGIT, idPGIT, idPGIN);
  var idPNGf = charIDToTypeID("PNGf");
  var idPGAd = charIDToTypeID("PGAd");
  desc4.putEnumerated(idPNGf, idPNGf, idPGAd);
  var idPNGF = charIDToTypeID("PNGF");
  desc3.putObject(idAs, idPNGF, desc4);
  var idIn = charIDToTypeID("In  ");
  var filename = filePath + '/out/' + cardName + '.png';
  desc3.putPath(idIn, new File(filename));
  var idCpy = charIDToTypeID("Cpy ");
  desc3.putBoolean(idCpy, true);
  executeAction(idsave, desc3, DialogModes.NO);

  // Close the thing without saving
  docRef.close(SaveOptions.DONOTSAVECHANGES);
}
