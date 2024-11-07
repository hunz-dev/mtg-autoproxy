from typing import List, Optional
from mtg_autoproxy.classes import ScryfallCard
from mtg_autoproxy.common import get_requests_session


BASE_URL = "https://api.scryfall.com"
MIN_MAX_WAIT_RATE = (.05, .1)

session = get_requests_session()


def get_set_info(set_code: str):
    """Get set details from Scryfall based on the set code.

    Args:
        set_code (str): Set code to look for

    Raises:
        ValueError: If the returned JSON isn't serializable

    Returns:
        dict: Set payload from Scryfall
    """
    response = session.get(f"{BASE_URL}/sets/{set_code}")
    try:
        return response.json()
    except ValueError as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e


def get_named_card(name: str, set_code: Optional[str] = None) -> Optional[ScryfallCard]:
    """Fetch single card from Scryfall based on a (Scryfall syntax) query, for
    more details see: https://scryfall.com/docs/api/cards/named.

    Args:
        name (str): Name of the card to search for
        set_code (Optional[str]): Set to limit card search to. Defaults to None.
    Raises:
        ValueError: When either:
            1) Scryfall response is not JSON-serializable
            2) Card object was not able to be instantiated properly

    Returns:
        Optional[ScryfallCard]: ScryfallCard object if card was found, None otherwise
    """
    # print(f"Searching Scryfall: \"{name}{f' [{set_code}]' if set_code else ''}\"...", end=" ")

    params = dict(exact=name, set=set_code)
    response = session.get(f"{BASE_URL}/cards/named/", params=params)
    try:
        response = response.json()
        if response.get("status") == 404:
            print(f"Unable to find unique result for \"{name} [{set_code}]\".")
            return None
        else:
            card = ScryfallCard(response)
    except ValueError as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    # print(f"Found: {card}")
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

    # print(f"Searching Scryfall for \"{query}\" [with unique {params['unique']}]... ", end=" ")
    response = session.get(f"{BASE_URL}/cards/search/", params=params)
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

    # print(f"Found {len(cards)} result{'s' if len(cards) > 1 else ''}.")
    return cards


def generate_dummy_card(name: str, set_code: str) -> ScryfallCard:
    """Generate an object that has necessary attributes of a `ScryfallCard` but most
    values are stubbed in.

    Args:
        name (str): Name of card
        set_code (str): Set code of card

    Returns:
        ScryfallCard: ScryfallCard instance
    """
    return ScryfallCard({
        "artist": "Dummy",
        "card_faces": None,
        "collector_number": 0,
        "color_identity": [],
        "frame": 2015,
        "full_art": False,
        "id": "00000000-0000-0000-0000-000000000000",
        "image_uris": {
            "small": "",
            "normal": "",
            "large": "",
            "png": "",
            "art_crop": "",
            "border_crop": ""
	    },
        "layout": "normal",
        "name": name,
        "oracle_id": "00000000-0000-0000-0000-000000000000",
        "rarity": "common",
        "scryfall_uri": "",
        "set": set_code,
        "set_name": "Dummy",
        "type_line": "Token",
    })
