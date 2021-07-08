// Toggle between these two lines to use the normal frame or box topper frame
// boxtopper = "-boxtopper";
const boxtopper = "";

// Python interpreter location
const python = "C:/Users/evanh/Code/Environments/mtg-autoproxy/Scripts/python"

function proxy(file, ye) {
  // var expansionSymbol = ""; // Cube
  var expansionSymbol;
  var filePath = File($.fileName).parent.parent.fsName;
  $.evalFile(filePath + "/scripts/json2.js");

  // Retrieve the card's name from the given filepath
  var filename;
  if (ye == 1) filename = decodeURI(file.name);
  else filename = decodeURI(file[0].name);
  fullCardName = filename.slice(0, filename.lastIndexOf("."));

  // Retrieve the card's attributes
  const cardName = fullCardName.substring(0, fullCardName.indexOf('(') - 1);
  const cardArtist = fullCardName.substring(fullCardName.indexOf('(') + 1, fullCardName.indexOf(')'));
  const cardSet = fullCardName.substring(fullCardName.indexOf('[') + 1, fullCardName.indexOf(']'));

  if (cardName == "Plains" || cardName == "Island" || cardName == "Swamp" || cardName == "Mountain" || cardName == "Forest") {
    proxyBasic(cardName, cardArtist, ye);
  } else {
    // Run Python script to get info from Scryfall
    // Execute this with different commands, depending on operating system
    // Assumes users are only using either Windows or macOS
    // Thanks to jamesthe500 on stackoverflow for the OS-detecting code
    if ($.os.search(/windows/i) != -1) {
      // Windows
      app.system(python + " " + filePath + "/scripts/get_card_info.py \"" + cardName + "\" " + cardSet);
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
    
    // Obtain the set symbol
    expansionSymbol = jsonParsed.setSymbol;
    isWideSymbol = jsonParsed.wideSetSymbol

    // If no artist name was supplied, use the name from Scryfall
    if (cardArtist == "") cardArtist = jsonParsed.artist;

    if (jsonParsed.layout == "normal") {
      proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol, "normal");
    } else if (jsonParsed.layout == "planeswalker" || jsonParsed.type.indexOf("Planeswalker") > 0) {
      proxyPlaneswalker(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol);
    } else if (jsonParsed.layout == "transform") {
      if (jsonParsed.face == "front") {
        proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol, "tf-front");
      } else if (jsonParsed.face == "back") {
        proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol, "tf-back");
      }
    }
  }
}

function proxyBasic(cardName, cardArtist, ye) {
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");

  templateName = "basic";
  var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
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

  docRef = app.activeDocument;

  // Move art into position
  var artLayerFrameName = "Basic Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"));

  docRef.layers.getByName(cardName).visible = true;
  legalLayer = docRef.layers.getByName("Legal");
  legalLayer.layers.getByName("Artist").textItem.contents = cardArtist;

  saveImage(cardName + " (" + cardArtist + ")");
}

function proxyPlaneswalker(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol) {
  // Load in json2.js and some function files
  $.evalFile(filePath + "/scripts/json2.js");
  $.evalFile(filePath + "/scripts/formatText.jsx");
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");
  $.evalFile(filePath + "/scripts/framelogic.jsx");

  var templateName = "pw" + boxtopper;
  var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
  app.open(fileRef);

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);

  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);

  // Retrieve some more info about the card.
  var typeLine = jsonParsed.type;
  var cardLoyalty = jsonParsed.loyalty;
  var cardText = jsonParsed.text;
  var cardRarity = jsonParsed.rarity;
  var cardManaCost = jsonParsed.manaCost;

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;
  var abilities = jsonParsed.text.split("\n");
  var numAbilities = 3; if (abilities.length > 3) numAbilities = 4;
  var templateRef = docRef.layers.getByName("pw-" + String(numAbilities));
  var textAndIcons = templateRef.layers.getByName("Text and Icons");
  templateRef.visible = true;

  customAdjustments(isWideSymbol);

  // Select the correct layers
  selectedLayers = selectFrameLayers(jsonParsed);

  // Move art into position
  docRef.paste();
  var artLayerFrameName = "Planeswalker Art Frame";
  if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(docRef.layers.getByName("Layer 1"),
    artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"));

  // Background
  backgroundLayer = templateRef.layers.getByName("Background");
  backgroundLayer.layers.getByName(selectedLayers[0]).visible = true;

  // Pinlines
  pinlinesLayer = templateRef.layers.getByName("Pinlines");
  pinlinesLayer.layers.getByName(selectedLayers[1]).visible = true;

  // Twins
  nameboxLayer = templateRef.layers.getByName("Name & Title Boxes");
  nameboxLayer.layers.getByName(selectedLayers[2]).visible = true;

  // Rarity gradient
  textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
  gradient(textAndIcons, cardRarity);

  // Insert basic text fields
  replaceText("Artist", cardArtist);
  insertManaCost(textAndIcons, cardManaCost);
  insertName(textAndIcons, cardName, "Card Name", false);
  insertTypeline(textAndIcons, typeLine, "Typeline", false);

  // Insert loyalty stuff
  var loyaltyGroup = templateRef.layers.getByName("Loyalty Graphics");
  startingLoyalty = loyaltyGroup.layers.getByName("Starting Loyalty");
  startingLoyalty.layers.getByName("Text").textItem.contents = cardLoyalty;

  groupNames = ["First Ability", "Second Ability", "Third Ability", "Fourth Ability"];
  for (var i = 0; i < abilities.length; i++) {
    // Select the appropriate ability group
    abilityGroup = loyaltyGroup.layers.getByName(groupNames[i]);
    var colonIndex = abilities[i].indexOf(": ");
    if (colonIndex > 0 && colonIndex < 5) {
      // Loyalty ability, not a static ability
      var loyaltyType = "";
      var loyaltyNumber;
      if (abilities[i].charAt(0) == "+") {
        // Plus abiltiy
        loyaltyNumber = abilities[i].slice(1, colonIndex);
        loyaltyType = "+";
      } else if (abilities[i].charAt(0) == "\u2212" || abilities[i].charAt(0) == "-") {
        // Minus ability
        loyaltyNumber = abilities[i].slice(1, colonIndex);
        loyaltyType = "-";
      } else if (abilities[i].charAt(0) == "0") {
        // Zero ability
        loyaltyNumber = "0";
        loyaltyType = "";
      }
      var abilityText = abilities[i].slice(colonIndex + 2, abilities[i].length);

      // Select the correct layer, paste in the ability
      var abilityTextLayer = abilityGroup.layers.getByName("Ability Text");
      // abilityTextLayer.textItem.contents = abilityText;
      docRef.activeLayer = abilityTextLayer;
      formatText(abilityText, [], -1, false);

      var loyaltyNumberGroup;
      if (loyaltyType == "") loyaltyNumberGroup = abilityGroup.layers.getByName("0");
      else loyaltyNumberGroup = abilityGroup.layers.getByName(loyaltyType);

      loyaltyNumberGroup.visible = true;
      var loyaltyText = loyaltyNumberGroup.layers.getByName("Cost");
      loyaltyText.textItem.contents = loyaltyType + loyaltyNumber;
    } else {
      // Static ability
      var staticTextLayer = abilityGroup.layers.getByName("Static Text");
      staticTextLayer.visible = true;
      staticTextLayer.textItem.contents = abilities[i];

      docRef.activeLayer = staticTextLayer;
      formatText(abilities[i], [], -1, false);

      abilityGroup.layers.getByName("Ability Text").visible = false;
      abilityGroup.layers.getByName("Colon").visible = false;
    }
  }

  // Drop in scan from Scryfall to help line up text
  docRef.activeLayer = templateRef.layers.getByName("Name & Title Boxes");
  var idPlc = charIDToTypeID("Plc ");
  var desc300 = new ActionDescriptor();
  var idIdnt = charIDToTypeID("Idnt");
  desc300.putInteger(idIdnt, 8219);
  idnull = charIDToTypeID("null");
  desc300.putPath(idnull, new File(filePath + "/scripts/card.jpg"));
  var idLnkd = charIDToTypeID("Lnkd");
  desc300.putBoolean(idLnkd, true);
  var idFTcs = charIDToTypeID("FTcs");
  var idQCSt = charIDToTypeID("QCSt");
  var idQcsa = charIDToTypeID("Qcsa");
  desc300.putEnumerated(idFTcs, idQCSt, idQcsa);
  var idOfst = charIDToTypeID("Ofst");
  var desc301 = new ActionDescriptor();
  var idHrzn = charIDToTypeID("Hrzn");
  var idPxl = charIDToTypeID("#Pxl");
  desc301.putUnitDouble(idHrzn, idPxl, 0.000000);
  var idVrtc = charIDToTypeID("Vrtc");
  idPxl = charIDToTypeID("#Pxl");
  desc301.putUnitDouble(idVrtc, idPxl, 0.000000);
  idOfst = charIDToTypeID("Ofst");
  desc300.putObject(idOfst, idOfst, desc301);
  var idWdth = charIDToTypeID("Wdth");
  var idPrc = charIDToTypeID("#Prc");
  desc300.putUnitDouble(idWdth, idPrc, 100.000000);
  var idHght = charIDToTypeID("Hght");
  idPrc = charIDToTypeID("#Prc");
  desc300.putUnitDouble(idHght, idPrc, 100.000000);
  executeAction(idPlc, desc300, DialogModes.NO);

  var scanLayer = templateRef.layers.getByName("card");
  scanLayer.resize(50 * app.activeDocument.width / scanLayer.bounds[0],
                   50 * app.activeDocument.height / scanLayer.bounds[1],
                   AnchorPosition.MIDDLECENTER);
  // scanLayer.resize(app.activeDocument.width, app.activeDocument.height, AnchorPosition.MIDDLECENTER);

  // Make the script error so we can finish it off by hand
  exit();
}

function proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, isWideSymbol, layout) {

  // Load in json2.js and some function files
  $.evalFile(filePath + "/scripts/json2.js");
  $.evalFile(filePath + "/scripts/formatText.jsx");
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");
  $.evalFile(filePath + "/scripts/framelogic.jsx");

  var isIxalan = jsonParsed.type.indexOf("Land") >= 0 && layout == "tf-back";
  if (isIxalan) layout = "ixalan";

  var fileRef;
  if (layout == "normal") fileRef = new File(filePath + "/templates/" + layout + boxtopper + ".psd");
  // if (layout == "normal") fileRef = new File(filePath + "/templates/" + "fullartland" + ".psd");
  else fileRef = new File(filePath + "/templates/" + layout + ".psd");

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

  customAdjustments(isWideSymbol);

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
  var artLayerFrameName = "Art Frame";
  if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(docRef.layers.getByName("Layer 1"),
    artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"));

  // Set up some layer name & other utility variables
  var cardnameLayerName = "Card Name";
  var typelineLayerName = "Typeline";
  var textLayerName = "Rules Text - Noncreature";
  var nameboxName = "Name & Title Boxes";
  var pinlinesName = "Pinlines & Textbox";
  var ptBoxGroup = "PT Box";
  var isCreature = cardPower != null && cardTough != null;
  if (isCreature) textLayerName = "Rules Text - Creature";
  var textColour = new SolidColor();
  textColour.rgb.red = 255.0; textColour.rgb.blue = 255.0; textColour.rgb.green = 255.0;
  var nyxcrown = (typeLine.indexOf("Legendary") >= 0 && typeLine.indexOf("Enchantment") >= 0) && (typeLine.indexOf("Creature") >= 0 || typeLine.indexOf("Artifact") >= 0);
  // Add a colour indicator dot when the card has no mana cost, it isn't a land
  // (or it is a creature: cornercase Dryad Arbor), and it isn't an artifact
  if ((cardManaCost == "" || cardManaCost == "{0}") &&
    (typeLine.indexOf("Land") < 0 || typeLine.indexOf("Creature") >= 0) &&
    selectedLayers[1] != "Artifact" && !selectedLayers[4]) {
    // Card needs a colour indicator
    var colourIndicator = docRef.layers.getByName("Colour Indicator");
    colourIndicator.layers.getByName(selectedLayers[1]).visible = true;

    // Shift the typeline
    textAndIcons.layers.getByName(typelineLayerName).visible = false;
    typelineLayerName = typelineLayerName + " Shift";
    textAndIcons.layers.getByName(typelineLayerName).visible = true;
  }

  // Modify a few things if the card is a transform card
  if (layout.indexOf("tf") >= 0) {
    // Shift the card name layer
    textAndIcons.layers.getByName(cardnameLayerName).visible = false;
    cardnameLayerName = cardnameLayerName + " Shift";
    textAndIcons.layers.getByName(cardnameLayerName).visible = true;

    // Select the correct twins and pinlines
    nameboxName = nameboxName + " " + layout;
    pinlinesName = pinlinesName + " " + layout;

    // If the card is a front face with a creature back, insert the back P/T
    if (layout == "tf-front" && jsonParsed.back_power != null && jsonParsed.back_toughness != null) {
      var flipPT = textAndIcons.layers.getByName("Flipside Power / Toughness");
      flipPT.visible = true;
      flipPT.textItem.contents = jsonParsed.back_power + "/" + jsonParsed.back_toughness;
      // Select the correct text box as well
      textLayerName = textLayerName + " Flip";
    } else if (layout == "tf-back") {
      ptBoxGroup = "PT Box tf-back";
      if (!selectedLayers[4]) {
        // Card is a back face that's not an eldrazi - make the relevant text white
        textAndIcons.layers.getByName(cardnameLayerName).textItem.color = textColour;
        textAndIcons.layers.getByName(typelineLayerName).textItem.color = textColour;
        textAndIcons.layers.getByName("Power / Toughness").textItem.color = textColour;
      }
    }

    // Switch on the transform icon in the top left
    textAndIcons.layers.getByName("Transform Backing").visible = true;
    var transformGroup = textAndIcons.layers.getByName(layout);
    transformGroup.layers.getByName(String(jsonParsed.frame_effect)).visible = true;
  }

  var backgroundLayer = docRef.layers.getByName("Background");
  if (isIxalan) {
    // Switch on the correct background for ixalan style lands
    backgroundLayer.layers.getByName(selectedLayers[1]).visible = true;

  } else {
    // Nyx layer
    if (selectedLayers[3]) {
      var nyxLayer = docRef.layers.getByName("Nyx");
      nyxLayer.layers.getByName(selectedLayers[0]).visible = true;
    } else {
      // Background
      backgroundLayer.layers.getByName(selectedLayers[0]).visible = true;
    }

    // Pinlines
    if (typeLine.indexOf("Land") >= 0 && jsonParsed.layout == "normal") pinlinesName = "Land " + pinlinesName;
    var pinlinesLayer = docRef.layers.getByName(pinlinesName);
    pinlinesLayer.layers.getByName(selectedLayers[1]).visible = true;
    if (nyxcrown) {
      app.activeDocument.activeLayer = docRef.layers.getByName(pinlinesName);
      enableLayerMask();

      app.activeDocument.activeLayer = docRef.layers.getByName("Border");
      enableLayerMask();

      app.activeDocument.activeLayer = docRef.layers.getByName("Shadows");
      enableLayerMask();
    }

    // Twins
    var nameboxLayer = docRef.layers.getByName(nameboxName);
    nameboxLayer.layers.getByName(selectedLayers[2]).visible = true;

    // Legendary crown
    if (typeLine.indexOf("Legendary") >= 0) {
      var legendaryLayer = docRef.layers.getByName("Legendary Crown (Credit to barbecue)");
      legendaryLayer.layers.getByName(selectedLayers[1]).visible = true;
      legendaryLayer.layers.getByName("Effects").visible = true;
      if (nyxcrown) {
        app.activeDocument.activeLayer = legendaryLayer.layers.getByName(selectedLayers[1]);
        // script listener to enable layer mask
        enableLayerMask();
      }
    }

    // PT box
    if (isCreature) {
      var ptBoxLayer = docRef.layers.getByName(ptBoxGroup);
      if (selectedLayers[0] == "Vehicle") {
        ptBoxLayer.layers.getByName("Vehicle").visible = true;
        // Set PT text to white
        textAndIcons.layers.getByName("Power / Toughness").textItem.color = textColour;
      } else {
        ptBoxLayer.layers.getByName(selectedLayers[2]).visible = true;
      }
    }
  }

  // Rarity gradient
  textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
  gradient(textAndIcons, cardRarity);

  // Insert basic text fields
  replaceText("Artist", cardArtist);
  if (!isIxalan) insertManaCost(textAndIcons, cardManaCost);
  insertName(textAndIcons, cardName, cardnameLayerName, isIxalan);
  insertTypeline(textAndIcons, typeLine, typelineLayerName, isIxalan);

  // For normal style box topper cards, make the typeline white
  if (boxtopper != "") textAndIcons.layers.getByName(typelineLayerName).textItem.color = textColour;

  // P/T Text
  if (!isIxalan) {
    var ptLayer = textAndIcons.layers.getByName("Power / Toughness");
    if (isCreature) {
      ptLayer.textItem.contents = cardPower + "/" + cardTough;
    } else ptLayer.visible = false;
  }

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
  var textboxRef = textAndIcons.layers.getByName("Textbox Reference");
  var tolerance = new UnitValue(10, "px"); // 10 px tolerance from textbox reference
  var layerHeight = textboxRef.bounds[3] - textboxRef.bounds[1] - tolerance.as("cm");
  var scaled = scaleTextToFitBox(rulesTextLayer, layerHeight);

  // Align card text in text box
  verticallyAlignText(textLayerName);
  if (isCreature) verticallyFixText(rulesTextLayer);

  // Write image to file and close document
  if (boxtopper == "") saveImage(cardName);
  else saveImage("border/" + cardName + " (Extended)");
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
    docRef.activeLayer.textItem.justification = Justification.RIGHT  // Force justification
  } else {
    manaCostLayer.visible = false;
  }
}

function insertName(textAndIcons, cardName, cardnameLayerName, isIxalan) {
  var docRef = app.activeDocument;
  // var textAndIcons = docRef.layers.getByName("Text and Icons");
  var cardnameLayer = textAndIcons.layers.getByName(cardnameLayerName);
  cardnameLayer.textItem.contents = cardName;

  if (!isIxalan && textAndIcons.layers.getByName("Mana Cost").visible) {
    // Scale down the name to fit in case it's too long
    var symbolLeftBound = textAndIcons.layers.getByName("Mana Cost").bounds[0].as("px");
    var typelineRightBound = cardnameLayer.bounds[2].as("px");
    var nameFontSize = cardnameLayer.textItem.size;
    while (typelineRightBound > symbolLeftBound - 16) { // minimum 16 px gap
      cardnameLayer.textItem.size = new UnitValue(nameFontSize - 1, "px");
      nameFontSize = nameFontSize - 1;
      typelineRightBound = cardnameLayer.bounds[2].as("px");
    }
  }
}

function insertTypeline(textAndIcons, typeLine, typelineLayerName, isIxalan) {
  var docRef = app.activeDocument;
  // textAndIcons = docRef.layers.getByName("Text and Icons");
  var typelineLayer = textAndIcons.layers.getByName(typelineLayerName);
  typelineLayer.textItem.contents = typeLine;

  if (!isIxalan) {
    // Scale down the typeline to fit in case it's too long
    var symbolLeftBound = textAndIcons.layers.getByName("Expansion Symbol").bounds[0].as("px");
    var typelineRightBound = typelineLayer.bounds[2].as("px");
    var typelineFontSize = typelineLayer.textItem.size;
    while (typelineRightBound > symbolLeftBound - 16) { // minimum 16 px gap
      typelineLayer.textItem.size = new UnitValue(typelineFontSize - 1, "px");
      typelineFontSize = typelineFontSize - 1;
      typelineRightBound = typelineLayer.bounds[2].as("px");
    }
  }
}

// Put some custom changes to the template here since manual modifications seem to break the script
function customAdjustments(isWideSymbol) {
  var legalLayer = app.activeDocument.layers.getByName("Legal");

  legalLayer.layers.getByName("Legal").translate(0, -0.01);

  var legalText = legalLayer.layers.getByName("Legal").textItem;
  var textColor = new SolidColor();
  textColor.rgb.hexValue = "555555"; 
  legalText.contents = "PROXY: THE GATHERING";
  legalText.font = "Relay-Medium";
  legalText.size = new UnitValue(2, "px");
  legalText.color = textColor;

  var setText = legalLayer.layers.getByName("Set").textItem;
  setText.contents = "PRX";

  if (isWideSymbol) {
    var textAndIcons = app.activeDocument.layers.getByName("Text and Icons");
    var expansionSymbol = textAndIcons.layers.getByName("Expansion Symbol");
    expansionSymbol.textItem.size = new UnitValue(12, "px");
    expansionSymbol.translate(-0.03, 0.02);
  }
}

function saveImage(cardName) {
  var docRef = app.activeDocument;

  // // ----------Save PSD----------
  // var saveOptions = new PhotoshopSaveOptions();
  // saveOptions.alphaChannels = false;
  // saveOptions.annotations = false;
  // saveOptions.embedColorProfile = true;
  // saveOptions.layers = true;
  // saveOptions.spotColors = false;
  // docRef.saveAs(new File(filePath + '/out/' + cardName + '.psd'), saveOptions, true, Extension.LOWERCASE);

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

function enableLayerMask() {
  // works on the active layer, I think?
  var idsetd = charIDToTypeID("setd");
  var desc3078 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref1567 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref1567.putEnumerated(idLyr, idOrdn, idTrgt);
  desc3078.putReference(idnull, ref1567);
  var idT = charIDToTypeID("T   ");
  var desc3079 = new ActionDescriptor();
  var idUsrM = charIDToTypeID("UsrM");
  desc3079.putBoolean(idUsrM, true);
  var idLyr = charIDToTypeID("Lyr ");
  desc3078.putObject(idT, idLyr, desc3079);
  executeAction(idsetd, desc3078, DialogModes.NO);
}
