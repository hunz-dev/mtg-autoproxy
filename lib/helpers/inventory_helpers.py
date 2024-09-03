import os
from typing import List, Tuple

from lib.classes import InventoryCard
from lib.helpers import os_helpers, scryfall_helpers


SET_CODE_CUSTOM = "PRX"
SET_CODE_TOKEN = "TOK"


def create_custom_inventory_card(file_name: str, folder: str, set_code: str = SET_CODE_CUSTOM) -> InventoryCard:
    """Generates an `InventoryCard` off a file name in a specific format for
    generated cards. (ex. "Anara, Wolvid Familiar (Fenrir, the Mighty) [Custom, Fullart].png)

    Args:
        file_name (str): File name to parse and generate `InventoryCard` for
        folder (str): Directory that the file belongs to
        set_code (str): Custom set code to assign to card. Defaults to "PRX".

    Returns:
        InventoryCard: Generated `InventoryCard`
    """
    full_name = file_name[:file_name.index("[")-1]
    artist_frame = file_name[file_name.index("[")+1:file_name.index("]")]

    try:
        artist, frame = artist_frame.split(", ")
    except ValueError as e:
        frame = artist_frame
        artist = "Custom"

    try:
        real_name = full_name[:full_name.index("(")-1]
    except ValueError:
        real_name = full_name

    scryfall_card = scryfall_helpers.get_named_card(real_name)

    inventory_card = InventoryCard(
        name=full_name,
        set_code=set_code,
        artist=artist,
        frame=frame,
        type_=scryfall_card.type_alt,
        color=scryfall_card.color_name,
        modified=os_helpers.get_modified_date_utc(f"{folder}/{file_name}"),
        file_path=f"{folder}/{file_name}",
    )

    return inventory_card


def create_normal_inventory_card(file_name: str, folder: str, ignore_set: bool = False) -> InventoryCard:
    """Generates an `InventoryCard` off a file name in a specific format for
    generated cards. (ex. "Crucible of Worlds (Ron Spencer, 5DN) [Extended].png)

    Args:
        file_name (str): File name to parse and generate `InventoryCard` for
        folder (str): Directory that the file belongs to

    Returns:
        InventoryCard: Generated `InventoryCard`
    """
    try:
        name = file_name[:file_name.index("(")-1]
        artist_set = file_name[file_name.index("(")+1:file_name.index(")")]
        artist, set_code = artist_set.split(", ")
    except ValueError as e:
        example = "Crucible of Worlds (Ron Spencer, 5DN) [Extended].png"
        print(f"Unexpected file name format: {file_name}\nShould match: {example}")
        raise e

    try:
        frame = file_name[file_name.index("[")+1:file_name.index("]")]
    except ValueError:
        frame = "Normal"

    scryfall_args = (name, set_code) if not ignore_set else (name, )
    scryfall_card = scryfall_helpers.get_named_card(*scryfall_args)

    inventory_card = InventoryCard(
        name=name,
        set_code=set_code,
        artist=artist,
        frame=frame,
        type_=scryfall_card.type_alt,
        color=scryfall_card.color_name,
        modified=os_helpers.get_modified_date_utc(f"{folder}/{file_name}"),
        file_path=f"{folder}/{file_name}",
    )

    return inventory_card


def create_token_inventory_card(file_name: str, folder: str) -> InventoryCard:
    """Generates an `InventoryCard` off a file name in a specific format for token
    cards. (ex. "Forest Dryad (Donato Giancola) [Green, 1-1].png)

    Args:
        file_name (str): File name to parse and generate `InventoryCard` for
        folder (str): Directory that the file belongs to

    Returns:
        InventoryCard: Generated `InventoryCard`
    """
    name = file_name[:file_name.index("(")-1]
    artist = file_name[file_name.index("(")+1:file_name.index(")")]
    stats = file_name[file_name.index("[")+1:file_name.index("]")]

    try:
        color, power_toughness = stats.split(", ")
        power_toughness = power_toughness.replace("-", "/")
    except Exception as e:
        print(e)
        color = "Colorless"
        power_toughness = None

    inventory_name = f"{color} {name}" + f" ({power_toughness})" if power_toughness else ""
    inventory_card = InventoryCard(
        name=inventory_name,
        set_code=SET_CODE_TOKEN,
        artist=artist,
        frame="Token",
        type_="Token",
        color=color,
        modified=os_helpers.get_modified_date_utc(f"{folder}/{file_name}"),
        file_path=f"{folder}/{file_name}",
    )

    return inventory_card


def create_unique_proxies(
    proxies: List[InventoryCard],
    proxy_folder: str,
    destination_folder: str,
    duplicate: bool = True,
) -> Tuple[List[InventoryCard], List[InventoryCard]]:
    """Traverse folder of proxies and create unique proxy images.

    Args:
        proxies (List[InventoryCard]): List of proxies to create files for
        proxy_folder (str): Folder of source proxies
        destination_folder (str): Folder to write unique files for
        duplicate (bool): Flag to duplicate file based on proxy count. Defaults to True.

    Returns:
        Tuple[List[InventoryCard], List[InventoryCard]]: List of missing files and duplicate files respectively
    """
    errors = { "missing": [], "duplicates": [] }
    for proxy in proxies:
        # for name in proxy.name.split(' // '):  # TODO: Add MDFC support, dupe backside to separate folder
        search_path = f"{proxy_folder}/{proxy.type}"
        file_names = [f for f in os.listdir(search_path) if f.startswith(f"{proxy.name}.")]

        if len(file_names) < 1:
            errors["missing"].append(proxy)
            continue
        elif len(file_names) > 1:
            errors["duplicates"].append(proxy)
            continue

        proxy_path = f"{proxy_folder}/{proxy.type}/{file_names[0]}"
        order_count = proxy.order_count if duplicate else 1
        os_helpers.duplicate_file(proxy_path, destination_folder, order_count)

    return errors["missing"], errors["duplicates"]
