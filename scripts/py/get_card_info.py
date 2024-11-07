import time
import sys
import simplejson as json
from urllib import request
from lib.helpers import scryfall_helpers


# TODO: Clean up
CARD_OUTPUT_PATH = "scripts/jsx/card.json"


def add_meld_info(card_json):
    """
    If the current card is a meld card, it's important to retrieve information about its faces here, since it'll be
    difficult to make another query while building the card's layout obj. For each part in all_parts, query Scryfall
    for the full card info from that part's uri.
    """

    if card_json["layout"] == "meld":
        for i in range(0, 3):
            time.sleep(0.1)
            uri = card_json["all_parts"][i]["uri"]
            part = json.loads(request.urlopen(uri).read())
            card_json["all_parts"][i]["info"] = part

    return card_json


def main(card_name: str):
    print(f"Searching Scryfall for: {card_name}...", end=" ")
    card = scryfall_helpers.get_matched_cards(card_name, unique="cards")[0]

    print("Saving JSON...", end=" ")
    with open(CARD_OUTPUT_PATH, 'w') as f:
        f.write(json.dumps(card.json, indent=4, sort_keys=True))

    print("Done!")


if __name__ == "__main__":
    main(sys.argv[1])
