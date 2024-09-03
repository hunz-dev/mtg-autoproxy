# TODO: Move into structured scripts directory for Python-based scripts and use helper libs

import os
from typing import List

import requests
import urllib  # TODO: Don't use urllib

from lib.classes import ScryfallCard
from lib.common import get_rate_limit_wait
from lib.helpers import mtgpics_helpers, scryfall_helpers


DEEPAI_BASE_URL = "https://api.deepai.org/api"
DEEPAI_KEY = os.environ['DEEPAI_KEY'].replace("\r", "")
DEEPAI_MODEL_NAME = "torch-srgan"


def save_deepai_image(card: ScryfallCard, model_name=DEEPAI_MODEL_NAME, upscale: bool = False) -> None:
    """Save a DeepAI generated image upscaled from Scryfall image.

    Args:
        card (Card): Scryfall Card object
        model_name (str, optional): DeepAI model name to use. Defaults to "waifu2x".
    """
    for card_name, art_url in card.art_urls:
        output_file_name = f"{card_name}.jpg".replace("/", "")

        if upscale:
            import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

            print(f"Using [{model_name}] to upscale art for: {card_name}... ", end="")
            url = f"{DEEPAI_BASE_URL}/{model_name}"
            data = { "image": art_url }
            headers = { 'api-key': DEEPAI_KEY }
            response = requests.post(url, data=data, headers=headers).json()

            if "output_url" not in response:
                print("No output URL specified in DeepAI response.")
                print(response)
            else:
                art_url = response["output_url"]
                output_file_name = f"{card_name} - {model_name}.jpg".replace("/", "")

        output_path =  os.path.join(os.path.dirname(os.path.realpath(__file__)), "art", output_file_name)
        print(f"Saving {output_path}... ", end="")

        urllib.request.urlretrieve(art_url, output_path)
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


def process_query(
    query: str, skip_mtgpics: bool = False, skip_scryfall: bool = False, upscale: bool = False
) -> None:
    """Main entry function to process a query and save card images based on arguments.

    By default, the function will:
        1) Fetch card objects provided by Scryfall API
        2) Find assets on MTGPICS.com based on card information
        3) If nothing was found on MTGPICS.com, upscale original card image provided by Scryfall

    Args:
        query (str): Scryfall search query
        skip_mtgpics (bool, optional): Flag to skip MTGPICS.com fetch. Defaults to False.
        skip_scryfall (bool, optional): Flag to skip Scryfall image fetch. Defaults to False.
        upscale (bool, optional): Flag to enable AI upscaling on images. Defaults to False.
    """
    # Fetch HTML from MTGPICS with card info and save images
    results = list()
    if not skip_mtgpics:
        result = mtgpics_helpers.get_gamerid(query=query)
        if not result:
            print("No gamerid found for query...")
        else:
            for version in mtgpics_helpers.find_all_art_versions(*result):
                results.append(mtgpics_helpers.save_image(version))

    # If nothing is found, use Scryfall art w/ optional AI upscale
    if not skip_scryfall and (not any(results)):
        for card in scryfall_helpers.get_matched_cards(query):
            save_deepai_image(card, upscale=upscale)


if __name__ == "__main__":
    # Parse out asterisk to force scryfall image search
    [process_query(q.replace("*", ""), skip_mtgpics=("*" in q)) for q in read_stdin()]
