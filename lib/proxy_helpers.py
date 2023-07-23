import os
from typing import Dict, List, Tuple

from .classes import Proxy
from .os_helpers import duplicate_file


def create_unique_proxies(
    proxies: List[Proxy],
    proxy_folder: str,
    destination_folder: str,
) -> Tuple[List[Proxy], List[Proxy]]:
    """Traverse folder of proxies and create unique proxy images.

    Args:
        proxies (List[Proxy]): List of proxies to create files for
        proxy_folder (str): Folder of source proxies
        destination_folder (str): Folder to write unique files for

    Returns:
        Tuple[List[Proxy], List[Proxy]]: List of missing files and duplicate files respectively
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
        duplicate_file(proxy_path, destination_folder, proxy.order_count)

    return errors["missing"], errors["duplicates"]
