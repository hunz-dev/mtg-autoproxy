from dataclasses import dataclass
from typing import List
import requests


MTGPICS_URL = "https://mtgpics.com/pics/art/{set}/{collector_number}.jpg"
SCRYFALL_BASE_URL = "https://api.scryfall.com"

# Specify a list of queries for Scryfall
queries = [
    # "",
    # ex. "arbor elf set:wwk",
]

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


def get_scryfall_cards(query, unique="art") -> List[Card]:
    # Fetch multiple cards/prints from Scryfall based on a (Scryfall syntax) query
    print(f"Searching Scryfall: \"{query}\"... ", end="")

    params = dict(q=query, unique=unique)
    r = requests.get(f"{SCRYFALL_BASE_URL}/cards/search/", params=params)
    try:
        response = r.json()
    except Exception as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    assert response["object"] == "list", "Unexpected data type returned"

    cards = [Card(c) for c in response["data"]]  # TODO: Check if anything is here
    print(f"Found {len(cards)} cards.")
    return cards


def save_mtgpics_image(card: ScryfallCard) -> None:
    # Save the image from MTGPICS using set and collector number
    print(f"Looking up {card} on MTGPICS...")

    url = MTGPICS_URL.format(set=card.set, collector_number=card.collector_number.rjust(3, '0'))
    response = requests.get(url, allow_redirects=True)
    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
    else:
        with open(f"art/{card}.jpg", "wb") as f:
            f.write(response.content)
        print(f"Found!")


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
    # Parse query for card name and set code (if provided)
    try:
        set_locator = query.index("[")
        card_name = query[:set_locator-1]
        set_code = query[set_locator+1:-1]
    except ValueError:
        card_name = query
        set_code = ""

    # Fetch specific card information from Scryfall
    # card = get_scryfall_card(card_name, set_code)

    # Fetch all cards for a given query
    cards = get_scryfall_cards(card_name)
    print(f"Found {len(cards)} cards. Fetching art...")

    # Fetch HTML from MTGPICS with card info
    print(f"Finding images on MTGPICS... ", end="")
    [save_mtgpics_image(card) for card in cards]


if __name__ == "__main__":
    queries = queries if len(queries) > 0 else read_stdin()
    [process_query(query) for query in queries]
