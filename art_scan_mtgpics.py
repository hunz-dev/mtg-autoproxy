from dataclasses import dataclass
from typing import List
import requests
from bs4 import BeautifulSoup


QUERIES = [
    # ex. "arbor elf [wwk]",
    # "",
]
MTGPICS_URL = "https://mtgpics.com"
SCRYFALL_URL = "https://api.scryfall.com/cards/named"


@dataclass
class ScryfallCard:
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
        [setattr(self, attribute, _json[attribute]) for attribute in ScryfallCard.ATTRIBUTES]


    def __str__(self):
        return f"{self.name} ({self.artist}) [{self.set.upper()}]"


def get_scryfall_card(card_name, set_code="") -> ScryfallCard:
    # Fetch a card from Scryfall based on a name and (optional)
    params = dict(fuzzy=card_name, set=set_code)
    response = requests.get(SCRYFALL_URL, params=params)
    card = ScryfallCard(response.json())  # TODO: Check if anything is here
    return card


def get_mtgpics_landing_page(card: ScryfallCard) -> str:
    # Fetch the landing page of a card from MTGPICS
    params = dict(ref=f"{card.set}{card.collector_number}")
    response = requests.get(MTGPICS_URL, params=params)
    return response.text


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

    # Fetch card information from Scryfall
    print(f"Searching Scryfall: \"{card_name} [{set_code if len(set_code) else 'N/A'}]\"... ", end="")
    card = get_scryfall_card(card_name, set_code)
    print(f"Found: \"{card}\"")

    # Fetch HTML from MTGPICS with card info
    print(f"Finding card on MTGPICS... ", end="")
    landing_soup = BeautifulSoup(get_mtgpics_landing_page(card), "html.parser")
    print(landing_soup)
    ## <div><a href=reprints?gid=fut159>See all prints of this cards</a></div>


if __name__ == "__main__":
    queries = QUERIES if len(QUERIES) > 0 else read_stdin()
    [process_query(query) for query in queries]
