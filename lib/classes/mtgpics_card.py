from dataclasses import dataclass
from typing import Optional
from .scryfall_card import ScryfallCard

@dataclass
class MtgPicsCard:
    """Represents the attributes of the main identifier used on MTGPICS.com.

    Attributes:
        card (ScryfallCard): ScryfallCard instance used as identifiers
        artist (str): Identifier number of image
        image_id (str): Identifier number of image
        set_id (str): Set identifier (could be different from Scryfall)
        alt_image_num (Optional[str]): Alternate image number
    """
    # Stores identifiers used to grab images from MTGPICS
    card: ScryfallCard
    artist: str
    image_id: str
    set_id: str
    alt_image_num: Optional[str] = None

    def __str__(self):
        base_str = f"{self.card.name} ({self.artist}) [{self.set_id.upper()}]"
        return base_str if not self.alt_image_num else f"{base_str} ({self.alt_image_num})"

    @property
    def uri(self) -> str:
        base_uri = f"{self.set_id}/{self.image_id}"
        return base_uri if not self.alt_image_num else f"{base_uri}_{self.alt_image_num}"
