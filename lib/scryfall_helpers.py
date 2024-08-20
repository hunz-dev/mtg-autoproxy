import requests
from lib.classes import Card


RATE_LIMIT_RANGE_S = (0.05, 0.1)
SCRYFALL_BASE_URL = "https://api.scryfall.com"


def get_named_card(query: str) -> Card:
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
        List[Card]: Array of Scryfall-based Card objects
    """
    import time, random; time.sleep(random.uniform(*RATE_LIMIT_RANGE_S))  # TODO: Use a rate limit wrapper

    print(f"Searching Scryfall: \"{query}\"... ")

    params = dict(fuzzy=query)
    r = requests.get(f"{SCRYFALL_BASE_URL}/cards/named/", params=params)
    try:
        response = r.json()
    except ValueError as e:
        print(f"Unable to parse response from Scryfall: {e}")
        raise e

    return Card(response)
