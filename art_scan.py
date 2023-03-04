from collections import namedtuple
from dataclasses import dataclass
import random
import re

from bs4 import BeautifulSoup
import requests
import tinycss2 as tinycss


MTGPICS_BASE_URL = "https://mtgpics.com"
SCRYFALL_BASE_URL = "https://api.scryfall.com"
RATE_LIMIT_RANGE_S = (1, 3)

# Specify a list of queries for Scryfall
queries = [
    # "",
    # ex. "arbor elf set:wwk",
]

# Stores identifiers used to grab images from MTGPICS
MtgPicsId = namedtuple("MtgPicsId", ["set_id", "image_id"])

@dataclass
class Card:
    # Pull needed attributes from here: https://scryfall.com/docs/api/cards
    artist: str
    collector_number: str
    full_art: bool
    id: str
    layout: str
    name: str
    oracle_id: str
    rarity: str
    scryfall_uri: str
    set: str
    set_name: str

    ATTRIBUTES = [
        "artist",
        "collector_number",
        "full_art",
        "id",
        "layout",
        "name",
        "oracle_id",
        "rarity",
        "scryfall_uri",
        "set",
        "set_name",
    ]

    def __init__(self, _json=None):
        if _json is None:
            raise ValueError("JSON-like dictionary from Scryfall API is required")
        [setattr(self, attribute, _json[attribute]) for attribute in Card.ATTRIBUTES]


    def __str__(self):
        return f"{self.name} ({self.artist}) [{self.set.upper()}]"

    @property
    def mtgpics_id(self) -> str:
        return f"{self.set}{self.collector_number.rjust(3, '0')}"


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

    assert response["object"] == "list", "Unexpected data type returned"

    cards = [Card(c) for c in response["data"]]  # TODO: Check if anything is here
    print(f"Found {len(cards)} cards.")  # TODO: Pluralize
    return cards


def get_mtgpics_art_uris(cards: List[Card]) -> List[MtgPicsId]:
    # Find the page with all available art for a given card based on set & collector number
    uris = list()
    for card in cards:
        import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper
        print(f"Searching \"{card.mtgpics_id}\" on MTGPICS...", end="")

        params = dict(gamerid=card.mtgpics_id)
        response = requests.get(f"{MTGPICS_BASE_URL}/art", params=params)
        soup = BeautifulSoup(response.content, "html.parser")
        image_results = soup.find_all("div", class_="Card12")  # Good for finding results, doesn't contain URLs

        # If no images were found, move on to next card
        if len(image_results) < 0:
            print("Nothing found.")
            continue

        print(f"Found! Extracting URLs...", end="")  # TODO: Pluralize

        # Look back in HTML where image URLs can be obtained
        image_url_block = soup.find("div", style="position:relative;")
        for element in image_url_block.children:
            # Parse inline div styles in this block to get URLs
            try:
                image_div_style = element["style"]
            except TypeError:
                continue  # If it can't be parsed out, move to next element

            css_tokens = tinycss.parse_component_value_list(image_div_style)
            url = css_tokens[-2].value  # ex. pics/art_th_big/dci/106_1.jpg
            url_tokens = re.split("/|\.", url)
            uris.append(MtgPicsId(url_tokens[-3], url_tokens[-2]))

    print(f"Done! Found the following URIs: {uris}")
    return uris

def save_mtgpics_image(card: Card, set_id: str, image_id: str) -> None:
    # Save the image from MTGPICS using set and collector number
    import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

    print(f"Saving \"{set_id}/{image_id}.jpg\" on MTGPICS...", end="")
    response = requests.get(f"{MTGPICS_BASE_URL}/pics/art/{set_id}/{image_id}.jpg")
    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
    else:
        with open(f"art/{card}.jpg", "wb") as f:
            f.write(response.content)
        print(f"Done!")


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


def process_query(query: str) -> None:
    # Fetch all cards for a given query
    cards = get_scryfall_cards(query)

    # Fetch HTML from MTGPICS with card info and save images
    for uri in get_mtgpics_art_uris(cards):
        save_mtgpics_image(cards[0], uri.set_id, uri.image_id)


if __name__ == "__main__":
    queries = queries if len(queries) > 0 else read_stdin()
    [process_query(query) for query in queries]
