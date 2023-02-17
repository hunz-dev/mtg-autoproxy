import time
import json
from urllib import request, parse, error
from scripts import config
import requests
from os import path


# Specify a list of cards to fetch instead of using stdin
CARD_NAMES = [
    # "Green Slime",
    # "Black Market Connections",
    # "Shadow in the Warp",
]


def process_scan(card_name, artist, set_name, image_url):
    # todo: rewrite to only rely on urllib
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={'image': image_url},
        headers={'api-key': config.TOKEN}
    )
    try:
        output_url = r.json()['output_url']
        output_file = f"{card_name} ({artist}) [{set_name.upper()}].jpg"
        request.urlretrieve(
            output_url, path.join(path.dirname(path.realpath(__file__)), "art", output_file)
        )
    except KeyError:
        raise Exception("whoops")


def get_card_art_url(card_name, card_json) -> str:
    if "card_faces" in card_json.keys():
        for i in range(0, 2):
            if card_json["card_faces"]["name"] == card_name:
                return card_json["card_faces"][i]["image_uris"]["art_crop"]
    else:
        return card_json["image_uris"]["art_crop"]


if __name__ == "__main__":
    # Initialize list of cards to iterate through
    cards = None
    if len(CARD_NAMES) > 0:
        cards = CARD_NAMES
    else:
        cards = [input("Card name (exact): ")]

    # Use Scryfall to search for this card
    for card_name in cards:
        # If the card specifies which set to retrieve the scan from, do that
        try:
            pipe_idx = card_name.index("$")
            card_set = card_name[pipe_idx + 1:]
            card_name = card_name[0:pipe_idx]
            print(f"Searching Scryfall for: {card_name}, set: {card_set}...", end="", flush=True)
            card = request.urlopen(
                f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}&set={parse.quote(card_set)}"
            ).read()

        except ValueError:
            print(f"Searching Scryfall for: {card_name}...", end="", flush=True)
            card = request.urlopen(
                f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}"
            ).read()
        except error.HTTPError:
            input("\nError occurred while attempting to query Scryfall. Press enter to exit.")

        print(" and done! Waifu2x'ing...", end="", flush=True)

        card_json = json.loads(card)
        image_url = get_card_art_url(card_name, card_json)
        process_scan(card_json["name"], card_json["artist"], card_json["set"], image_url)
        print(" and done!", flush=True)
        time.sleep(0.1)
