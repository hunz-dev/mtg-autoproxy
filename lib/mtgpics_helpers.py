import re
import requests
from typing import List

from bs4 import BeautifulSoup
import tinycss2 as tinycss

from lib.classes import MtgPicsCard, MtgPicsCardVersion, ScryfallCard
from lib.common import flatten_list, get_rate_limit_wait


BASE_URL = "https://mtgpics.com"
THUMBNAIL_STYLE = "display:block;border:4px black solid;cursor:pointer;"  # Style element containing `gamerid``


# TODO: Should accept list of ScryfallCards, check all, and return found ones as single return value (error on different ones)
def get_gamerid(card_name: str, set_name: str, image_id: str) -> str:
    ref = f"{set_name}{image_id.rjust(3, '0')}"
    response = requests.get(f"{BASE_URL}/card", params=dict(ref=ref))
    soup = BeautifulSoup(response.content, "html.parser")

    print(f"Looking for gamerid with `ref`: {ref}...", end=" ")
    try:
        title = soup.find("title")
        if title is None:
            print(f"No title element found.")
            return
        found_card_name = soup.find("title").get_text().split(" - ")[0]
        assert found_card_name == card_name
    except IndexError as e:
        print("Unable to parse card name.")
        return None
    except AssertionError as e:
        print(f"Found card does not match. Found: \"{found_card_name}\"")
        return None

    image = soup.find("img", style=THUMBNAIL_STYLE)
    if image is None:
        print("No thumbnail found.")
        return

    try:
        gamerid = "".join(re.split(r'/|\.', image.get("src"))[-3:-1])
    except IndexError as e:
        print("Unable to find `gamerid`.")
        return None

    print(f"Found `gamerid`: [{gamerid}]")
    return gamerid


def get_all_versions(cards: List[ScryfallCard]) -> List[MtgPicsCardVersion]:
    """Find the MTGPICS.com page with all available art for a given card based
    on set & collector number.

    Args:
        cards (List[Card]): Array of Card objects

    Returns:
        List[MtgPicsCard]: Array of identifiers for MTGPICS.com
    """
    print("Searching on MTGPICS for:")

    mtgpics_cards: List[MtgPicsCard] = []
    for scryfall_card in cards:
        mtgpics_card = MtgPicsCard(scryfall_card)

        import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper
        print(f"\t\"{mtgpics_card.base_version.id}\"... ", end="")

        params = dict(gamerid=mtgpics_card.base_version.id)  # TODO: Investigate
        response = requests.get(f"{BASE_URL}/art", params=params)
        soup = BeautifulSoup(response.content, "html.parser")

        # Look in HTML for image URLs, set id, and artist
        image_url_block = soup.find("div", style="position:relative;")

        if image_url_block is None:
            print("No images found.")
            continue

        # Add all detected versions of the card
        image_elements = list(image_url_block.children)
        print(f"Found {len(image_elements)} images!")
        for element in image_elements:
            # Parse inline div styles in this block to get URLs
            try:
                image_div_style = element["style"]
            except TypeError:
                continue  # If it can't be parsed out, move to next element

            # Obtain set code and image id
            css_tokens = tinycss.parse_component_value_list(image_div_style)
            url = css_tokens[-2].value  # ex. pics/art_th_big/dci/106_1.jpg
            url_tokens = re.split("/|\.", url)
            set_id, image_id = url_tokens[-3], url_tokens[-2]

            # Check if image has alternates
            alt_image_num = None
            try:
                image_id, alt_image_num = image_id.split("_")
            except ValueError:
                pass

            # Extract artist (may differ from base card)
            artist = element.select_one('div[class="S10"] a').get_text()

            # Add version with all needed identifiers
            mtgpics_card.add_version(artist, set_id, image_id, alt_image_num)

        # Only add card to return payload if it detected versions
        if len(mtgpics_card.versions) > 1:
            mtgpics_cards.append(mtgpics_card)

    versions = flatten_list([c.versions for c in mtgpics_cards])

    # TODO: Check if version exists prior to saving
    if len(versions) < 1:
        print(f"Unable to find images using default method, using alternative that may result in incorrect images...")
        versions = [save_image_alt(card) for card in cards]
        versions = [v for v in versions if v is not None]

    print(f"Done! Found {len(versions)} version{'' if len(versions) == 1 else 's'}.")

    return versions


# TODO: Overload function with a "gamerid" parameter
def save_image(image_version: MtgPicsCardVersion) -> bool:
    """Save an image from MTGPICS.com using site identifier.

    Args:
        ids (MtgPicsCard): MTGPICS.com identifier object

    Returns:
        bool: Success flag
    """
    import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

    print(f"Finding \"{image_version.image_subpath}\" on MTGPICS... ", end="")
    url = f"{BASE_URL}/pics/art/{image_version.image_subpath}"
    response = requests.get(url)

    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
        return False
    else:
        file_name = f"art/{str(image_version).replace('/', '')}.jpg"
        print(f"Saving as \"{file_name}\"... ", end="")
        with open(file_name, "wb") as f:
            f.write(response.content)
        print(f"Done!")
        return True


def save_image_alt(scryfall_card: ScryfallCard) -> MtgPicsCardVersion:
    """Save an image from MTGPICS.com using set and collector number.

    Args:
        scryfall_card (ScryfallCard): Scryfall card object

    Returns:
        bool: Success flag
    """
    import time; time.sleep(get_rate_limit_wait())  # TODO: Use a rate limit wrapper

    base_version = MtgPicsCard(scryfall_card).base_version

    print(f"Finding \"{base_version.image_subpath}\" on MTGPICS... ", end="")
    url = f"{BASE_URL}/pics/art/{base_version.image_subpath}"
    response = requests.get(url)

    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
        return None
    else:
        file_name = f"art/{str(base_version).replace('/', '')}.jpg"
        print(f"Saving as \"{file_name}\"... ", end="")
        with open(file_name, "wb") as f:
            f.write(response.content)
        print(f"Done!")
        return base_version
