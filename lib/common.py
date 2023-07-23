import csv
import requests
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
