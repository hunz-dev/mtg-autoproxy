from typing import List, Optional
import time
import requests
from lib.classes import ScryfallCard
from lib.common import get_rate_limit_wait


BASE_URL = "https://api.scryfall.com"


def get_named_card(query: str) -> Optional[ScryfallCard]:
    """Fetch single card from Scryfall based on a (Scryfall syntax) query, for
    more details see: https://scryfall.com/docs/api/cards/named.

    Args:
        query (str): Scryfall syntax query (see: https://scryfall.com/docs/syntax)
        unique (str, optional): Strategy for omitting similar cards. Defaults to "art".
        order (str, optional): Method used to sort results. Defaults to "released".
        dir (str, optional): Direction of sort. Defaults to "desc".

    Raises:
        ValueError: When either:
            1) Scryfall response is not JSON-serializable
            2) Card object was not able to be instantiated properly

    Returns:
        Optional[ScryfallCard]: ScryfallCard object if card was found, None otherwise
    """
    print(f"Searching Scryfall: \"{query}\"... ", end=" ")  # TODO: Make log single line after search

    params = dict(fuzzy=query)
    response = requests.get(f"{BASE_URL}/cards/named/", params=params)
    time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper
    try:
        response = response.json()
        if response["status"] == 404:
            print(f"Unable to find unique result.")
            return None
        else:
            card = ScryfallCard(response)
    except ValueError as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    print(f"Found: {card}")
    return card


def get_matched_cards(query, unique="art", order="released", dir="desc") -> List[ScryfallCard]:
    """Fetch multiple cards/prints from Scryfall based on a (Scryfall syntax) query, for
    more details see: https://scryfall.com/docs/api/cards/search.

    Args:
        query (str): Scryfall syntax query (see: https://scryfall.com/docs/syntax)
        unique (str, optional): Strategy for omitting similar cards. Defaults to "art".
        order (str, optional): Method used to sort results. Defaults to "released".
        dir (str, optional): Direction of sort. Defaults to "desc".

    Raises:
        ValueError: When either:
            1) Scryfall response is not JSON-serializable
            2) Card object was not able to be instantiated properly

    Returns:
        List[Card]: Array of Scryfall-based Card objects
    """
    params = dict(q=query, unique=unique, order=order, dir=dir)

    print(f"Searching Scryfall for \"{query}\" [with unique {params['unique']}]... ", end=" ")
    response = requests.get(f"{BASE_URL}/cards/search/", params=params)
    time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper
    try:
        response = response.json()
    except ValueError as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    # Extract card details from each object, on failure return empty list
    try:
        cards = [ScryfallCard(c) for c in response["data"]]
    except KeyError as e:
        print(f"Found 0 cards.")
        return []

    print(f"Found {len(cards)} result{'s' if len(cards) > 1 else ''}.")
    return cards
