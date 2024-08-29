from dataclasses import dataclass, fields
from typing import Dict, List, Tuple, Optional
from lib.common import strip_accents


@dataclass
class ScryfallCard:
    """Represents a Scryfall card object, pulling attributes from the following
    API documentation: https://scryfall.com/docs/api/cards.

    Attributes:
        artist (str): Artist name
        card_faces (Optional[List[Dict]]): Array of card face objects (https://scryfall.com/docs/api/cards#card-face-objects)
        collector_number (str): Collector number
        color_identity (str): Color identity
        frame (str): Frame type
        full_art (bool): Full art flag
        id (str): Scryfall card identifier
        image_uris (Dict): URLs of multiple sizes of card image, indexed on sizes (ex. `large`)
        layout (str): Layout of the card, if it's reversible
        name (str): Card name
        oracle_id (str): Oracle ID of the card
        rarity (str): Rarity of the card
        scryfall_uri (str): URL to the card in Scryfall
        set (str): Set code (pulled from: https://en.wikipedia.org/wiki/List_of_Magic:_The_Gathering_sets)
        set_name (str): Name of the set
        type_line (str): Type line of the card

    Raises:
        ValueError: When constructor receives an unsubscriptable object
        KeyError: When constructor attempts to parse a field that doesn't exist in the card payload
    """
    # Pull needed attributes from here: https://scryfall.com/docs/api/cards
    artist: str
    card_faces: Optional[List[Dict]]
    collector_number: str
    color_identity: List[str]
    frame: str
    full_art: bool
    id: str
    image_uris: Dict
    layout: str
    name: str
    oracle_id: str
    rarity: str
    scryfall_uri: str
    set: str
    set_name: str
    type_line: str

    def __init__(self, _json=None):
        if _json is None:
            raise ValueError("JSON-like dictionary from Scryfall API is required")

        for field in fields(ScryfallCard):
            try:
                setattr(self, field.name, _json[field.name])
            except KeyError:
                setattr(self, field.name, None)

        self.name = strip_accents(self.name)

    def __str__(self):
        return self.format_name(self.name, self.artist, self.set)

    @property
    def art_urls(self) -> List[Tuple[str, str]]:
        if self.card_faces:
            return [
                (self.format_name(f["name"], f["artist"], self.set), f["image_uris"]["art_crop"])
                for f in self.card_faces
            ]
        else:
            return [(str(self), self.image_uris["art_crop"])]

    @property
    def color_name(self) -> str:
        color_map = {
            "W": "White",
            "U": "Blue",
            "B": "Black",
            "R": "Red",
            "G": "Green",
        }

        if len(self.color_identity) > 1:
            return "Multi"
        elif len(self.color_identity) < 1:
            return "Colorless"
        else:
            return color_map[self.color_identity[0]]

    @property
    def is_classic(self) -> bool:
        return self.frame in ["1993", "1997"]

    @property
    def is_mdfc(self) -> bool:
        return self.card_faces

    @property
    def mdfc_front_face_name(self) -> str:
        if not self.is_mdfc:
            raise ValueError("Card must be MDFC to use this property")
        return self.card_faces[0]["name"]

    @property
    def mdfc_front_face_type(self) -> str:
        if not self.is_mdfc:
            raise ValueError("Card must be MDFC to use this property")
        return self.card_faces[0]["type_line"]

    @property
    def type_alt(self) -> str:
        simple_types = [
            "Artifact",
            "Creature",
            "Enchantment",
            "Instant",
            "Land",
            "Sorcery",
            "Planeswalker",
        ]

        return [t for t in simple_types if t in self.type_line][0]

    @staticmethod
    def format_name(name, artist, set) -> str:
        return f"{name} ({artist}) [{set.upper()}]"
