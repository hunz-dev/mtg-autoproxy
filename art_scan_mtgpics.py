from dataclasses import dataclass
import requests
# from bs4 import BeautifulSoup


QUERIES = [
    # ex. "arbor elf set:wwk",
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


def get_scryfall_card(card_name, set_code) -> ScryfallCard:
    print(f"Searching Scryfall: \"{card_name} [{set_code}]\"... ", end="", flush=True)
    params = dict(fuzzy=card_name, set=set_code)
    response = requests.get(SCRYFALL_URL, params=params)
    card = ScryfallCard(response.json())
    print(f"Found: \"{card}\"")
    return card


def get_scryfall_card(query):
    print(f"Searching Scryfall: \"{query}\"...", end="", flush=True)
    response = requests.get(SCRYFALL_URL, params={'q': query})
    return response.json()


if __name__ == "__main__":
    # TODO: Add support for entering multiple queries before executing them all
    queries = QUERIES if len(QUERIES) > 0 else [input("Scryfall query: ")]

    for query in queries:
        card = get_scryfall_card(query)
        print(card)
        # page = requests.get(MTGPICS_URL)
        # soup = BeautifulSoup(page.content, "html.parser")
        ## <div><a href=reprints?gid=fut159>See all prints of this cards</a></div>
