import os
from typing import List, Tuple

from lib.classes import InventoryCard
from lib.helpers import os_helpers, scryfall_helpers


def create_inventory_card(file_name: str) -> InventoryCard:
    """Generates an `InventoryCard` off a file name in a specific format.
    (ex. "Crucible of Worlds (Ron Spencer, 5DN) [Extended].png)

    Args:
        file_name (str): File name to parse and generate `InventoryCard` for

    Returns:
        InventoryCard: Generated `InventoryCard`
    """
    name = file_name[:file_name.index("(")-1]
    artist_set = file_name[file_name.index("(")+1:file_name.index(")")]
    artist, set_code = artist_set.split(", ")

    try:
        frame = file_name[file_name.index("[")+1:file_name.index("]")]
    except ValueError:
        frame = "Normal"

    scryfall_card = scryfall_helpers.get_named_card(name, set_code)

    inventory_card = InventoryCard(
        name=name,
        set_code=set_code,
        artist=artist,
        frame=frame,
        type_=scryfall_card.type_alt,
        color=scryfall_card.color_name,
        modified=os_helpers.get_modified_date_utc(f"{PROXY_FOLDER}/{file_name}"),
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
