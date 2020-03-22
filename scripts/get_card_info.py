import html
import logging
import time
import sys
import scrython
import json
import requests


log = logging.getLogger('mtg-autoproxy')
log.setLevel(logging.DEBUG)

file_handler = logging.FileHandler(f'{sys.path[0]}/get_card_info.log')
file_handler.setLevel(logging.DEBUG)
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)
log.addHandler(file_handler)
log.addHandler(stream_handler)


def get_dict(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    log.info("Found information for: " + card.name())
    # Handle missing power/toughness
    try:
        power = card.power()
        toughness = card.toughness()
    except KeyError:
        power = None
        toughness = None

    # Handle missing flavour text
    try:
        flavourText = card.flavor_text()
    except KeyError:
        flavourText = ""

    # Account for Scryfall sometimes not inserting a new line for flavour text that quotes someone
    flavourText = flavourText.replace("\" —", "\"\n—")
    flavourText = flavourText.replace("\"—", "\"\n—")
    # TODO: Make this more robust. This still sometimes misses and hecks up the formatting on cards.

    card_json = {
        "name": card.name(),
        "rarity": card.rarity(),
        "manaCost": card.mana_cost(),
        "type": card.type_line(),
        "text": card.oracle_text(),
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": card.layout(),
        "colourIdentity": card.color_identity(),
        "artist": card.artist(),
        "setSymbol": get_set_symbol(card.set_code())
    }
    return card_json


def get_dict_tf(card, cardfull):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    log.info("Found information for: " + card["name"])
    # Handle missing power/toughness
    try:
        power = card["power"]
        toughness = card["toughness"]
    except KeyError:
        power = None
        toughness = None

    # Handle missing flavour text
    try:
        flavourText = card["flavor_text"]
    except KeyError:
        flavourText = ""

    # Account for Scryfall sometimes not inserting a new line for flavour text that quotes someone
    flavourText = flavourText.replace("\" —", "\"\n—")

    card_json = {
        "name": card["name"],
        "rarity": cardfull.rarity(),
        "manaCost": card["mana_cost"],
        "type": card["type_line"],
        "text": card["oracle_text"],
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": "transform",
        "colourIdentity": card["colors"],
        "frame_effect": cardfull.scryfallJson['frame_effects'][0],
        "artist": cardfull.artist(),
        "setSymbol": get_set_symbol(cardfull.set_code()),
    }
    log.info(card_json)
    return card_json


def get_dict_pw(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    log.info("Found information for: " + card.name())

    # Split the card text into abilities
    abilities = card.oracle_text().splitlines()

    card_json = {
        "name": card.name(),
        "rarity": card.rarity(),
        "manaCost": card.mana_cost(),
        "type": card.type_line(),
        "text": card.oracle_text(),
        "loyalty": card.loyalty(),
        "layout": "planeswalker",
        "colourIdentity": card.color_identity(),
        "artist": card.artist(),
        "setSymbol": get_set_symbol(card.set_code()),
    }

    img_data = requests.get(card.image_uris()['large']).content
    with open(sys.path[0] + '/card.jpg', 'wb') as handler:
        handler.write(img_data)
    return card_json


def get_set_symbol(set_code):
    DEFAULT = "&#xe90c;" # Cube
    set_code = set_code.upper()

    with open(sys.path[0] + "/set_symbols.json", 'r') as f:
        symbols = json.load(f)
    
    try:
        html_entity = symbols[set_code]
    except KeyError:
        log.warning(f"Unable to find set symbol for [{set_code}]")
        html_entity = DEFAULT
    
    return html.unescape(html_entity)


def save_json(card_json):
    json_dump = json.dumps(card_json)
    log.info(card_json)
    with open(sys.path[0] + "/card.json", 'w') as f:
        json.dump(json_dump, f)

def main():
    _, cardname, set_code = sys.argv
    
    log.info(f"Asking Scryfall for information for: {cardname} [{set_code}]")
    # Use Scryfall to search for this card
    time.sleep(0.05)

    # Try to find card from specifed set code, fallback if nothing is found
    try:
        card = scrython.cards.Named(fuzzy=cardname, set=set_code)
    except scrython.foundation.ScryfallError:
        log.warning(f"Unable to find: {cardname} [{set_code}]. Ignoring expansion code...")
        card = scrython.cards.Named(fuzzy=cardname)

    if card.layout() == "transform":
        if card.card_faces()[0]["name"] == cardname:
            # front face
            card_json = get_dict_tf(card.card_faces()[0], card)
            try:
                power = card.card_faces()[1]["power"]
                toughness = card.card_faces()[1]["toughness"]
                card_json["back_power"] = power
                card_json["back_toughness"] = toughness
            except KeyError:
                pass
            card_json["face"] = "front"
            save_json(card_json)
        elif card.card_faces()[1]["name"] == cardname:
            # back face
            card_json = get_dict_tf(card.card_faces()[1], card)
            card_json["face"] = "back"
            try:
                card_json["color_indicator"] = card.card_faces()[1]["color_indicator"]
            except KeyError:
                card_json["color_indicator"] = None

            save_json(card_json)

    elif "Planeswalker" in card.type_line():
        # planeswalker
        save_json(get_dict_pw(card))

    elif card.layout() == "normal":
        # normal card
        card_json = get_dict(card)
        save_json(card_json)

    elif card.layout() == "meld":
        card_json = get_dict(card)
        card_json["frame_effect"] = "mooneldrazidfc"
        card_json["layout"] = "transform"
        if "meld them" in card_json["text"] or "Melds with" in card_json["text"]:
            card_json["face"] = "front"
            # get the power and toughness of the backside
            meldbackidx = [card.all_parts()[x]["component"] for x in range(0, len(card.all_parts()))].index("meld_result")
            meldbackname = card.all_parts()[meldbackidx]["name"]
            meldback = scrython.cards.Named(fuzzy=meldbackname)

            # assume meld cards flip into creatures
            power = meldback.power()
            toughness = meldback.toughness()
            card_json["back_power"] = power
            card_json["back_toughness"] = toughness
        else:
            card_json["face"] = "back"
            card_json["colourIdentity"] = card.colors()
        save_json(card_json)

    else:
        log.info("Unsupported")

    # TODO: Add more card types. Meld? Sagas?

if __name__ == "__main__":
    try:
        main()
    except Exception:
        log.exception("Unhandled exception occured")