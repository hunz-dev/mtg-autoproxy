from collections import namedtuple
from dataclasses import dataclass
from typing import List
from .scryfall_card import ScryfallCard


@dataclass
class MtgPicsCardVersion:
    """Represents a particular version of a card asset on MTGPICS.com.

    Attributes:
        name (str): Name of the card
        artist (str): Artist of the card
        set (str): Set code of the card
        image_id (str): Image identifier of the card asset
        alt_image_num (str, Optional): Alternate image number (if multiple exist)
    """
    name: str
    artist: str
    set: str
    image_id: str
    alt_image_num: str

    @property
    def direct_image_path(self):
        return f"/pics/art/{self.image_subpath}.jpg"

    @property
    def id(self):
        return self.get_identifier(separator="")

    @property
    def image_subpath(self) -> str:
        base_id = self.get_identifier(separator="/")
        return f"{base_id}.jpg" if not self.alt_image_num else f"{base_id}_{self.alt_image_num}.jpg"

    def get_identifier(self, separator="/"):
        return f"{self.set}{separator}{self.image_id}"

    def __str__(self):
        base_str = f"{self.name} ({self.artist}) [{self.set.upper()}]"
        return base_str if not self.alt_image_num else f"{base_str} ({self.alt_image_num})"


class MtgPicsCard:
    """Represents a collection of unique card assets fetched from MTGPICS.com.

    Attributes:
        base_card (ScryfallCard): ScryfallCard instance used as the initial search
        versions (List[MtgPicsCardVersion]): List of all versions of the card that exist on the website
    """
    def __init__(self, base_card: ScryfallCard):
        self.base_card = base_card
        self.versions = []

    def add_version(self, artist: str, set: str, image_id: str, alt_image_num: str = None) -> None:
        version = MtgPicsCardVersion(
            name=self.base_card.name,
            artist=artist,
            set=set,
            image_id=image_id,
            alt_image_num=alt_image_num,
        )
        self.versions.append(version)

    @property
    def base_version(self):
        return MtgPicsCardVersion(
            name=self.base_card.name,
            artist=self.base_card.artist,
            set=self.base_card.set,
            image_id=self.base_card.collector_number.rjust(3, '0'),
            alt_image_num=None)

    @property
    def direct_image_paths(self):
        return [v.direct_image_path for v in self.versions]
