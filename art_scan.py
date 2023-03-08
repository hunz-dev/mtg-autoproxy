# TODO: Docstrings
# TODO: https://pypi.org/project/inflect/
# TODO: https://pypi.org/project/rich/

from collections import namedtuple
from dataclasses import dataclass, fields
import os
import random
import re
from typing import Dict, List, Tuple, Optional

from bs4 import BeautifulSoup
import requests
import tinycss2 as tinycss


DEEPAI_BASE_URL = "https://api.deepai.org/api"
MTGPICS_BASE_URL = "https://mtgpics.com"
SCRYFALL_BASE_URL = "https://api.scryfall.com"

# DeepAI API key to use for upscaling models, should be placed in `/.env` file
DEEPAI_KEY = os.environ['DEEPAI_KEY'].replace("\r", "")

# The range for a random amount of time (seconds) to wait before sending a request
RATE_LIMIT_RANGE_S = (1, 3)

# Specify a list of queries for Scryfall
queries = [
    # ex. "arbor elf set:wwk",
    # "",
]


@dataclass
class MtgPicsId:
    # Stores identifiers used to grab images from MTGPICS
    artist_name: str
    card_name: str
    image_id: str
    set_id: str
    alt_image_num: Optional[str] = None

    def __str__(self):
        base_str = f"{self.card_name} ({self.artist_name}) [{self.set_id.upper()}]"
        return base_str if not self.alt_image_num else f"{base_str} ({self.alt_image_num})"

    @property
    def uri(self) -> str:
        base_uri = f"{self.set_id}/{self.image_id}"
        return base_uri if not self.alt_image_num else f"{base_uri}_{self.alt_image_num}"


@dataclass
class Card:
    # Pull needed attributes from here: https://scryfall.com/docs/api/cards
    artist: str
    card_faces: Optional[List[Dict]]
    collector_number: str
    full_art: bool
    id: str
    image_uris: Dict
    layout: str
    name: str
    oracle_id: str
    rarity: str
    scryfall_uri: str
    set: str
    set_name: str

    def __init__(self, _json=None):
        if _json is None:
            raise ValueError("JSON-like dictionary from Scryfall API is required")

        for field in fields(Card):
            try:
                setattr(self, field.name, _json[field.name])
            except KeyError:
                setattr(self, field.name, None)

    def __str__(self):
        return self.format_name(self.name, self.artist, self.set)

    @property
    def mtgpics_id(self) -> str:
        return f"{self.set}{self.collector_number.rjust(3, '0')}"

    @property
    def art_urls(self) -> List[Tuple[str, str]]:
        if self.card_faces:
            return [
                (self.format_name(f["name"], f["artist"], self.set), f["image_uris"]["art_crop"])
                for f in self.card_faces
            ]
        else:
            return [(str(self), self.image_uris["art_crop"])]

    @property
    def multi_faced(self) -> bool:
        return len(self.art_urls) > 1

    @staticmethod
    def format_name(name, artist, set) -> str:
        return f"{name} ({artist}) [{set.upper()}]"


def get_rate_limit_wait() -> float:
    # Return a random float to use as a rate limit
    return random.uniform(*RATE_LIMIT_RANGE_S)


def get_scryfall_card(card_name, set_code="") -> Card:
    # Fetch a single card from Scryfall based on a name and (optional) set code
    print(f"Searching Scryfall: \"{card_name} [{set_code if len(set_code) else 'N/A'}]\"... ", end="")

    params = dict(fuzzy=card_name, set=set_code)
    r = requests.get(f"{SCRYFALL_BASE_URL}/cards/named", params=params)

    try:
        response = r.json()
    except Exception as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    card = Card(response)  # TODO: Check if anything is here
    print(f"Found: \"{card}\"!")

    return card


def get_scryfall_cards(query, unique="art", order="released", dir="desc") -> List[Card]:
    # Fetch multiple cards/prints from Scryfall based on a (Scryfall syntax) query
    print(f"Searching Scryfall: \"{query}\"... ", end="")

    params = dict(q=query, unique=unique, order=order, dir=dir)
    r = requests.get(f"{SCRYFALL_BASE_URL}/cards/search/", params=params)
    try:
        response = r.json()
    except Exception as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    try:
        cards = [Card(c) for c in response["data"]]
    except Exception as e:
        print(f"Unable to find anything! (Error: {repr(e)})")
        return []

    print(f"Found {len(cards)} cards.")  # TODO: Pluralize
    return cards


def get_mtgpics_art_ids(cards: List[Card]) -> List[MtgPicsId]:
    # Find the page with all available art for a given card based on set & collector number
    ids = list()
    print("Searching on MTGPICS for: ", end="")
    for card in cards:
        import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper
        print(f"\"{card.mtgpics_id}\"... ", end="")

        params = dict(gamerid=card.mtgpics_id)
        response = requests.get(f"{MTGPICS_BASE_URL}/art", params=params)
        soup = BeautifulSoup(response.content, "html.parser")

        # Look in HTML for image URLs, set id, and artist
        image_url_block = soup.find("div", style="position:relative;")
        for element in image_url_block.children:
            # Parse inline div styles in this block to get URLs
            try:
                image_div_style = element["style"]
            except TypeError:
                continue  # If it can't be parsed out, move to next element

            # Obtain set code and image id
            css_tokens = tinycss.parse_component_value_list(image_div_style)
            url = css_tokens[-2].value  # ex. pics/art_th_big/dci/106_1.jpg
            url_tokens = re.split("/|\.", url)
            set_id, image_id = url_tokens[-3], url_tokens[-2]

            # Check if image has alternates
            alt_num = None
            try:
                image_id, alt_num = image_id.split("_")
            except ValueError:
                pass

            # Obtain artist name
            artist_name = element.select_one('div[class="S10"] a').get_text()

            # Add tuple with all needed identifiers
            ids.append(MtgPicsId(artist_name, card.name, image_id, set_id, alt_num))

    print(f"Done! Found {len(ids)} IDs.")
    return ids


def save_mtgpics_image(ids: MtgPicsId) -> bool:
    # Save the image from MTGPICS using set and collector number
    import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

    print(f"Finding \"{ids.uri}.jpg\" on MTGPICS... ", end="")
    url = f"{MTGPICS_BASE_URL}/pics/art/{ids.uri}.jpg"
    response = requests.get(url)

    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
        return False
    else:
        file_name = f"art/{str(ids).replace('/', '')}.jpg"
        print(f"Saving as \"{file_name}\"... ", end="")
        with open(file_name, "wb") as f:
            f.write(response.content)
        print(f"Done!")
        return True


def save_deepai_image(card: Card, model_name="waifu2x") -> None:
    for card_name, art_url in card.art_urls:
        import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

        print(f"Using [{model_name}] to upscale art for: {card_name}... ", end="")
        url = f"{DEEPAI_BASE_URL}/{model_name}"
        data = { "image": art_url }
        headers = { 'api-key': DEEPAI_KEY }
        response = requests.post(url, data=data, headers=headers).json()

        print("Saving... ", end="")
        import urllib  # TODO: Don't use urllib
        output_file = f"{card_name} - {model_name}.jpg".replace("/", "")
        output_path =  os.path.join(os.path.dirname(os.path.realpath(__file__)), "art", output_file)
        urllib.request.urlretrieve(response["output_url"], output_path)
        print("Done!")


def read_stdin(prompt="> ") -> List[str]:
    # Read text input and append to list until nothing is entered
    queries = list()
    while True:
        input_query = input(prompt)
        if len(input_query) > 0:
            queries.append(input_query)
        else:
            break
    return queries


def process_query(query: str, force_scryfall=False, skip_mtgpics=False) -> None:
    # Fetch all cards for a given query
    cards = get_scryfall_cards(query)

    # Fetch HTML from MTGPICS with card info and save images
    results = list()
    if not skip_mtgpics:
        for ids in get_mtgpics_art_ids(cards):
            results.append(save_mtgpics_image(ids))

    # If nothing is found, use Scryfall art w/ AI upscale
    if not any(results) or force_scryfall:
        for card in cards:
            save_deepai_image(card, model_name="waifu2x")
            save_deepai_image(card, model_name="torch-srgan")


if __name__ == "__main__":
    queries = queries if len(queries) > 0 else read_stdin()
    # Parse out asterisk to force scryfall image search
    [process_query(q.replace("*", ""), force_scryfall=("*" in q)) for q in queries]
