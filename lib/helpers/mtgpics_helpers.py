import re
import time
from typing import List, Optional, Tuple

from bs4 import BeautifulSoup
from requests_cache import CachedSession
import tinycss2 as tinycss

from lib import MTGPICS_SET_CODE_MAP
from lib.classes import MtgPicsCard, MtgPicsCardVersion, ScryfallCard
from lib.common import get_requests_session
from lib.helpers import scryfall_helpers


BASE_URL = "https://mtgpics.com"
THUMBNAIL_STYLE = "display:block;border:4px black solid;cursor:pointer;"  # Style element containing `gamerid``

session = get_requests_session()


def convert_set_code(set_code: str) -> str:
    """Translate MTGPICS set codes (unconventional) to Scryall/Oracle set codes.

    Args:
        set_code (str): MTGPICS set code

    Returns:
        str: Scryfall set code
    """
    return MTGPICS_SET_CODE_MAP[set_code] if set_code in MTGPICS_SET_CODE_MAP else set_code


def get_gamerid(cards: Optional[List[ScryfallCard]] = None, query: Optional[str] = None) -> Optional[Tuple[str, str]]:
    """Obtain the unique identifier, `gamerid`, that MTGPICS uses as an individual card.

    Args:
        cards (Optional[ScryfallCard], optional): List of Scryfall cards. Defaults to None.
        query (Optional[str], optional): Scryfall-based query to look up card. Defaults to None.

    Raises:
        ValueError: If both `cards` and `query` were set
        ValueError: If query method was used and returned multiple cards

    Returns:
        Optional[Tuple[str, str]]: Tuple containing card name and associated `gamerid`
    """
    if (cards and len(cards)) and (query and len(query)):
        raise ValueError("Only one parameter should be set.")

    # Obtain list of ScryfallCard objects to use (if not provided as a parameter)
    if query:
        print(f"Finding `gamerid` for query: {query}...")
        cards = scryfall_helpers.get_matched_cards(query, unique="prints", dir="asc")  # Get all prints
        if len(cards) == 0:
            print("No cards were found")
            return None

        unique = cards[0].name
        if not (all([c.name == unique for c in cards])):
            raise ValueError("Multiple cards returned, Scryfall query should return a single card.")

    # Keep track of all versions of `gamerid` in the event some misfires occur
    gamerids = []
    for card in cards:
        ref = f"{convert_set_code(card.set)}{card.collector_number.rjust(3, '0')}"
        response = session.get(f"{BASE_URL}/card", params=dict(ref=ref))
        soup = BeautifulSoup(response.content, "html.parser")

        # Look at title element of the webpage to check card name first
        print(f"\tLooking for gamerid with `ref`: {ref}...", end=" ")
        try:
            title = soup.find("title")
            if title is None:
                print(f"No title element found.")
                continue
            found_card_name = soup.find("title").get_text().split(" - ")[0]
            assert found_card_name == card.name
        except IndexError as e:
            print("Unable to parse card name.")
            continue
        except AssertionError as e:
            print(f"Found card does not match. Found: \"{found_card_name}\"")
            continue

        # Find a specific thumbnail image that has desired style tag (should only have one)
        image = soup.find("img", style=THUMBNAIL_STYLE)
        if image is None:
            print("No thumbnail found.")
            continue

        # Inspect element to grab the `gamerid` from the image URL
        try:
            gamerid = "".join(re.split(r'/|\.', image.get("src"))[-3:-1])
        except IndexError as e:
            print("Unable to find `gamerid`.")
            continue

        print(f"Found `gamerid`: [{gamerid}]")
        gamerids.append((card.name, gamerid))

    if len(gamerids) == 0:
        print("No `gamerid` detected.")
        return None
    elif len(gamerids) > 1:
        print(f"Multiple versions of `gamerid` found: {gamerids}")
        found_gamer_id = find_valid_gamerid(card.name, gamerids)
        return found_gamer_id
    else:
        found_gamer_id = gamerids[0]
        print(f"Found unique `gamerid`: {found_gamer_id}.")
        return found_gamer_id


def find_all_art_versions(card_name: str, gamerid: str) -> List[MtgPicsCardVersion]:
    """Find all unique art versions on MTGPICS.

    TODO: Check if `card_name` could be eliminated as a param.

    Args:
        card_name (str): Card name associated with gamerid
        gamerid (str): Unique identifier for MTGPICS

    Returns:
        List[MtgPicsCardVersion]: List of unique MTGPICS image versions
    """
    params = dict(gamerid=gamerid)
    response = session.get(f"{BASE_URL}/art", params=params)
    soup = BeautifulSoup(response.content, "html.parser")

    # Look in HTML for image URLs, set id, and artist
    image_url_block = soup.find("div", style="position:relative;")

    if image_url_block is None:
        print("No images found.")
        return []

    # Add all detected versions of the card
    image_elements = list(image_url_block.children)
    print(f"Verifying {len(image_elements)} potential images...", end=" ")

    payload = []
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
        payload.append(MtgPicsCardVersion(card_name, artist, set_id, image_id, alt_image_num))

    print(f"{len(payload)} unique version{'s' if len(payload) != 1 else ''} found: {payload}")
    return payload


def find_valid_gamerid(card_name: str, gamerids: List[str]) -> Optional[str]:
    """Tests multiple gamerids to check if any return images.

    Args:
        card_name (str): Name of the card
        gamerids (List[str]): List of `gamerid`s to verify

    Returns:
        Optional[str]: `gamerid` if valid, None otherwise
    """
    results = {}
    for gamerid in gamerids:
        results[gamerid] = find_all_art_versions(card_name, gamerid)
    try:
        return [k for k, v in results.items() if len(v) > 0][-1]
    except IndexError:
        print(f"No valid gamerids detected from: {gamerids}")
        return None


def save_image(image_version: MtgPicsCardVersion, output_path: str) -> bool:
    """Save an image from MTGPICS.com using site identifier.

    Args:
        ids (MtgPicsCard): MTGPICS.com identifier object
        output_path (str): Output file path to save image to

    Returns:
        bool: Success flag
    """
    print(f"Finding \"{image_version.image_subpath}\" on MTGPICS... ", end="")
    url = f"{BASE_URL}/pics/art/{image_version.image_subpath}"
    response = session.get(url)

    if len(response.content) <= 0 or "There's nothing here" in response.text:
        print(f"Not found.")
        return False
    else:
        file_name = f"{output_path}/{str(image_version).replace('/', '')}.jpg"
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
    base_version = MtgPicsCard(scryfall_card).base_version

    print(f"Finding \"{base_version.image_subpath}\" on MTGPICS... ", end="")
    url = f"{BASE_URL}/pics/art/{base_version.image_subpath}"
    response = session.get(url)

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
