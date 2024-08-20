import csv
import requests
import random
from typing import List


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
