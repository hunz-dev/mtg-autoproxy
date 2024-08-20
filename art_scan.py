# TODO: Move into structured scripts directory for Python-based scripts and use helper libs

import os
from typing import List

import requests

from lib import mtgpics_helpers, scryfall_helpers
from lib.classes import ScryfallCard
from lib.common import get_rate_limit_wait


DEEPAI_BASE_URL = "https://api.deepai.org/api"

# DeepAI API key to use for upscaling models, should be placed in `/.env` file
DEEPAI_KEY = os.environ['DEEPAI_KEY'].replace("\r", "")


# Specify a list of queries for Scryfall
queries = [
    # ex. "arbor elf set:wwk",
    # "",
]

def save_deepai_image(card: ScryfallCard, model_name="waifu2x") -> None:
    """Save a DeepAI generated image upscaled from Scryfall image.

    Args:
        card (Card): Scryfall Card object
        model_name (str, optional): DeepAI model name to use. Defaults to "waifu2x".
    """
    for card_name, art_url in card.art_urls:
        import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

        print(f"Using [{model_name}] to upscale art for: {card_name}... ", end="")
        url = f"{DEEPAI_BASE_URL}/{model_name}"
        data = { "image": art_url }
        headers = { 'api-key': DEEPAI_KEY }
        response = requests.post(url, data=data, headers=headers).json()

        if "output_url" not in response:
            print("No output URL specified in DeepAI response.")
            print(response)
            continue

        print("Saving... ", end="")
        import urllib  # TODO: Don't use urllib
        output_file = f"{card_name} - {model_name}.jpg".replace("/", "")
        output_path =  os.path.join(os.path.dirname(os.path.realpath(__file__)), "art", output_file)

        urllib.request.urlretrieve(response["output_url"], output_path)
        print("Done!")


def read_stdin(prompt="> ") -> List[str]:
    """Read text input and append to list until nothing is entered

    Args:
        prompt (str, optional): System prompt to use. Defaults to "> ".

    Returns:
        List[str]: Array of all entered queries
    """
    queries = list()
    while True:
        input_query = input(prompt)
        if len(input_query) > 0:
            queries.append(input_query)
        else:
            break
    return queries


def process_query(query: str, force_scryfall=False, skip_mtgpics=False, skip_scryfall=False) -> None:
    """Main entry function to process a query and save card images based on arguments.

    By default, the function will:
        1) Fetch card objects provided by Scryfall API
        2) Find assets on MTGPICS.com based on card information
        3) If nothing was found on MTGPICS.com, upscale original card image provided by Scryfall

    Args:
        query (str): Scryfall search query
        force_scryfall (bool, optional): Flag to force scryfall image generation. Defaults to False.
        skip_mtgpics (bool, optional): Flag to skip MTGPICS.com fetch. Defaults to False.
        skip_scryfall (bool, optional): Flag to skip Scryfall image fetch. Defaults to False.
    """
    # Fetch all cards for a given query
    cards = scryfall_helpers.get_matched_cards(query)

    # Fetch HTML from MTGPICS with card info and save images
    results = list()
    if not skip_mtgpics:
        for version in mtgpics_helpers.get_all_versions(cards, dir="asc"):
            results.append(mtgpics_helpers.save_image(version))

        # If nothing was found using main approach, use alternate
        if not any(results):
            for card in cards:
                results.append(mtgpics_helpers.save_image_alt(card))

    # If nothing is found, use Scryfall art w/ AI upscale
    if not skip_scryfall and (not any(results) or force_scryfall):
        for card in cards:
            save_deepai_image(card, model_name="torch-srgan")


if __name__ == "__main__":
    queries = queries if len(queries) > 0 else read_stdin()
    # Parse out asterisk to force scryfall image search
    [process_query(q.replace("*", ""), force_scryfall=("*" in q)) for q in queries]
