from typing import List
import requests


COLOR_MAP = {
    "W": "White",
    "U": "Blue",
    "B": "Black",
    "R": "Red",
    "G": "Green",
}
BASE_URL = "https://api2.moxfield.com/v3"
GET_DECKS_URL = BASE_URL + "/decks"
GET_DECK_BY_ID_URL = BASE_URL + "/decks/all/{id}"
DEFAULT_HEADERS = {
    'User-Agent': 'insomnia',
}


def get_deck_ids(bearer_token: str) -> List[str]:
    """Fetch personal decks belonging to the authorized user (via Bearer token).

    Args:
        bearer_token (str): Token to use in Authorization header

    Returns:
        List[str]: List of public deck IDs
    """
    headers = dict(**DEFAULT_HEADERS, authorization=bearer_token)
    response = requests.get(GET_DECKS_URL, headers=headers).json()
    assert "decks" in response, "Unexpected response structure"
    return [deck["publicId"] for deck in response["decks"] if deck["visibility"] == "public"]  # TODO: Fix private decks



def get_tokens_by_deck_id(deck_id: str) -> List[str]:
    """Use main Moxfield deck API route to find all needed information about tokens.

    Args:
        deck_id (str): Moxfield deck ID, found in path parameters

    Returns:
        List[str]: List of tokens formatted as: "{name} ({artist}) [{color}, {power}/{toughness}]"
    """
    response = requests.get(GET_DECK_BY_ID_URL.format(id=deck_id), headers=DEFAULT_HEADERS).json()
    assert "tokens" in response, "Unexpected response structure"

    token_list = []
    for token in response["tokens"]:
        power = token["power"] if "power" in token else None
        toughness = token["toughness"] if "toughness" in token else None
        is_creature = power or toughness

        fstr = "{name} ({artist}) [{color}" + (", {power}/{toughness}" if is_creature else "") + "]"

        if len(token["colors"]) == 0:
            color = "Colorless"
        elif len(token["colors"]) == 1:
            color = COLOR_MAP[token["colors"][0]]
        else:
            color = "Multi"

        fstr_args = dict(
            name=token["name"],
            artist=token["artist"],
            color=color,
            power=power,
            toughness=toughness,
        )
        token_list.append(fstr.format(**fstr_args))

    return token_list
