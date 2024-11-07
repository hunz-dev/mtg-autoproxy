from typing import List
import requests


COLOR_MAP = {
    "W": "White",
    "U": "Blue",
    "B": "Black",
    "R": "Red",
    "G": "Green",
}
DECKS_URL = "https://api2.moxfield.com/v3/decks/all/{deck_id}"
DEFAULT_HEADERS = {
    'User-Agent': 'insomnia',
}


def get_tokens_by_deck_id(deck_id: str) -> List[str]:
    """Use main Moxfield deck API route to find all needed information about tokens.

    Args:
        deck_id (str): Moxfield deck ID, found in path parameters

    Returns:
        List[str]: List of tokens formatted as: "{name} ({artist}) [{color}, {power}/{toughness}]"
    """
    response = requests.get(DECKS_URL.format(deck_id=deck_id), headers=DEFAULT_HEADERS).json()

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
