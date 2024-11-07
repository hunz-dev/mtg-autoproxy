import os
import requests
import urllib  # TODO: Don't use urllib
from mtg_autoproxy.classes import ScryfallCard
from mtg_autoproxy.common import get_rate_limit_wait


DEEPAI_BASE_URL = "https://api.deepai.org/api"
DEEPAI_KEY = os.environ['DEEPAI_KEY'].replace("\r", "")
DEEPAI_MODEL_NAME = "torch-srgan"


def save_image(
    card: ScryfallCard, output_path: str, model_name: str = DEEPAI_MODEL_NAME, upscale: bool = False
) -> None:
    """Save a DeepAI generated image upscaled from Scryfall image.

    Args:
        card (Card): Scryfall Card object
        output_path (str): Output file path to save image to
        model_name (str, optional): DeepAI model name to use. Defaults to "torch-srgan".
        upscale (bool, optional): Flag to upscale image with DeepAI. Defaults to False.
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

        output_path =  os.path.join(output_path, output_file_name)
        print(f"Saving {output_path}... ", end="")

        urllib.request.urlretrieve(art_url, output_path)
        print("Done!")
