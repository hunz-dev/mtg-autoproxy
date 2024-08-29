import csv
import random
import time
from typing import List
import unicodedata

import requests

from requests_cache import CachedSession


session = None  # TODO: Could be cleaner


def load_csv(url: str, encoding="utf-8", delimiter=",") -> List[List[str]]:
    """Load a CSV-formatted result from an HTTP endpoint.

    Args:
        url (str): URL to the content
        encoding (str, optional): Encoding of the content. Defaults to "utf-8".
        delimiter (str, optional): Delimiter of the data. Defaults to ",".

    Returns:
        List[List[str]]: Two-dimensional list of CSV-structured content
    """
    result = None
    with requests.Session() as session:
        response = session.get(url)
        decoded_content = response.content.decode(encoding)
        result = list(csv.reader(decoded_content.splitlines(), delimiter=delimiter))

    return result


def flatten_list(_list: List[List]) -> List:
    """Flatten 2D list.

    Args:
        _list (List[List]): 2D list to flatten

    Returns:
        List: Flattened list
    """
    return [v for sublist in _list for v in sublist]


def get_rate_limit_wait(min=1.0, max=3.0) -> float:
    """Return a random float to use as a rate limit.

    Returns:
        float: Random float between the range defined in `RATE_LIMIT_RANGE_S`
    """
    return random.uniform(min, max)

def strip_accents(text: str) -> str:
    """Convert accented characters to basic.

    Args:
        text (str): Text to convert

    Returns:
        str: Non-accented text
    """
    text = unicodedata.normalize('NFD', text)
    text = text.encode('ascii', 'ignore')
    text = text.decode("utf-8")
    return str(text)


def generate_throttle_hook(timeout=0.1):
    """Return a function hook for a requests.Response to sleep on a non-cached result.

    Args:
        timeout (float, optional): Length of timeout after request. Defaults to 1.0.
    """
    def hook(response, *args, **kwargs):
        if not(getattr(response, 'from_cache', False)):
            time.sleep(timeout)
        return response
    return hook


def get_requests_session() -> CachedSession:
    """Create and/or return the CachedSession object with response hook applied.

    Returns:
        CachedSession: Session object to use for API requests
    """
    global session
    if session is None:
        session = CachedSession()
        session.hooks['response'].append(generate_throttle_hook())

    return session
