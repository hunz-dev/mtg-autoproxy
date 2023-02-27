import requests
# from bs4 import BeautifulSoup


QUERIES = [
    # ex. "arbor elf set:wwk",
    # "",
]
MTGPICS_URL = "https://mtgpics.com"
SCRYFALL_URL = "https://api.scryfall.com/cards/search"


class ScryfallCard:
    pass


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
