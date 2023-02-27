import time
import json
import urllib
import requests
import os


# Specify a list of queries for Scryfall
QUERIES = [
    # "",
    # ex. "arbor elf set:wwk",
]

# DeepAI API key to use for upscaling models, should be placed in `/.env` file
DEEPAI_KEY = os.environ['DEEPAI_KEY'].replace("\r", "")


def process_scan(card_name, artist, set_name, image_url):
    # TODO: Rewrite to use urllib for uniformity
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={'image': image_url},
        headers={'api-key': DEEPAI_KEY}
    )
    try:
        output_url = r.json()['output_url']
        output_path = os.path.dirname(os.path.realpath(__file__))
        output_file = f"{card_name} ({artist}) [{set_name.upper()}].jpg"
        urllib.request.urlretrieve(output_url, os.path.join(output_path, "art", output_file))
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
    # TODO: Add support for entering multiple queries before executing them all
    queries = QUERIES if len(QUERIES) > 0 else [input("Scryfall query: ")]

    for query in queries:
        query_string = f"q={urllib.parse.quote_plus(query)}"
        url = f"https://api.scryfall.com/cards/search?{query_string}"
        print(f"Searching Scryfall: \"{query_string}\"...", end="", flush=True)
        try:
            response = urllib.request.urlopen(url).read()
        except urllib.error.HTTPError as e:
            print(f"\nError occurred while querying Scryfall:\n\t{e}")
            continue

        card_json = json.loads(response)['data'][0]  # TODO: Handle more cases
        image_url = get_card_art_url(card_json["name"], card_json)

        print(f" and done! Found [{card_json['name']}]. Putting image through Waifu2x...", end="", flush=True)
        process_scan(card_json["name"], card_json["artist"], card_json["set"], image_url)

        print(" and done!", flush=True)
        time.sleep(0.1)
