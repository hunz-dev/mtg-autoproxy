
from dataclasses import dataclass
from typing import List, Optional, Tuple, Union

from lib.common import strip_accents
from lib.classes import ScryfallCard
from lib.helpers import scryfall_helpers


CUSTOM_SET_CODE = "PRX"


class InventoryCard:
    """Represent attributes of a card for an inventory.

    Attributes:
        artist (str): Name of the artist
        counts (List[int]): List of card counts requested by users. Defaults to [].
        frame (str): Type of frame used on the card
        modified (str): Timestamp string of the last modified date
        name (str): Name of the card
        on_hand (int): Number of cards on hand. Defaults to 0.
        order_count (int): Total number of proxies to order. Defaults to 0.
        set_code (str): Set that the card belongs to
        type_ (str): Type of the card (ie. color identity or land).
    """
    artist: str
    color: str
    counts: List[int]
    file_path: str
    frame: str
    modified: str
    name: str
    on_hand: int
    order_count: int
    set_code: str
    type_: str

    def __init__(self,
            name: str, set_code: str, artist: str, frame: str, type_: str, color: str,
            modified: str, counts: List[Union[str, int]] = [], on_hand: Union[str, int] = 0,
            order_count: Union[str, int] = 0, file_path: str = None):
        self.name = name
        self.set_code = set_code
        self.artist = artist
        self.frame = frame
        self.modified = modified  # TODO: Convert to datetime?
        self.file_path = file_path
        self.type_ = type_
        self.color = color
        self.counts = [int(count) if count else 0 for count in counts]
        self.on_hand = int(on_hand) if on_hand else 0
        self.order_count = int(order_count) if order_count else 0

    @classmethod
    def from_row(cls, row: str):
        try:
            return cls(
                name=row[Inventory.COLUMN_MAP['name']],
                set_code=row[Inventory.COLUMN_MAP['set_code']],
                artist=row[Inventory.COLUMN_MAP['artist']],
                frame=row[Inventory.COLUMN_MAP['frame']],
                type_=row[Inventory.COLUMN_MAP['type_']],
                color=row[Inventory.COLUMN_MAP['color']],
                modified=row[Inventory.COLUMN_MAP['modified']],
                file_path=row[Inventory.COLUMN_MAP['file_path']],
                counts=row[Inventory.COLUMN_MAP['counts'][0]:Inventory.COLUMN_MAP['counts'][1]],
                on_hand=row[Inventory.COLUMN_MAP['on_hand']],
                order_count=row[Inventory.COLUMN_MAP['order_count']])
        except IndexError as e:
            print(f"Error parsing: {row}")
            raise e
        except ValueError as e:
            print(f"Invalid value: {row}")
            raise e
    
    @property
    def csv(self):
        return self.as_separated_value(separator=",")

    @property
    def tsv(self):
        return self.as_separated_value(separator="\t")

    def __getitem__(self, x):
        return getattr(self, x)

    def __str__(self):
        return self.csv

    def as_separated_value(self, separator=" "):
        output = {k: getattr(self, k) for k in Inventory.COLUMN_MAP.keys() if k not in Inventory.HIDDEN_FIELDS}
        output["counts"] = separator.join([str(c) for c in output["counts"]])
        return separator.join([strip_accents(str(v)) for v in output.values()])

    def add_to_order(self, column: int, to_add: int) -> None:
        self.counts[column] = self.counts[column] + to_add


class OrderCard:
    """Represent a card to find and order from Inventory.

    Attributes:
        card (str): ScryfallCard instance of the card to order
        user (str): Name of the user for the order
        count (int): Number of cards to order
    """
    card: ScryfallCard
    user: str
    count: int

    def __init__(self, card: ScryfallCard, user: str, count: int):
        if any([p is None for p in [card, user, count]]):
            raise ValueError("All `OrderCard` fields are required.")

        self.card = card
        self.user = user
        self.count = count

    @property
    def name(self):
        return self.card.name if not self.card.is_mdfc else self.card.mdfc_front_face_name

    @property
    def set_code(self):
        return self.card.set

    @classmethod
    def import_list(cls, order: List[Union[Tuple[str], Tuple[str,str], Tuple[str,str,str]]], user: str):
        """Imports a 2D list of strings as a list of `OrderCard`s.

        Args:
            order (List[Union[Tuple[str], Tuple[str,str], Tuple[str,str,str]): 2D list of strings of either
                length 1 (card name [assume count is 1]), 2 (card name, count), or 3 (card name, set code, count).
            user (str): Name of the user to associate order with.

        Raises:
            ValueError: If any of the list items are a tuple not between lengths 1 and 3 inclusive.

        Returns:
            List[OrderCard]: List of OrderCard objects
        """
        order_list = []
        for order_line in order:
            if len(order_line) == 1:
                card_name = order_line
                count = 1
                set_code = None
            elif len(order_line) == 2:
                card_name, count = order_line
                set_code = None
            elif len(order_line) == 3:
                card_name, set_code, count = order_line
            else:
                raise ValueError("Each element must be between lengths 1 and 3 inclusive.")

            # Ignore set code in search if desired card is custom (to avoid not being found)
            if set_code == CUSTOM_SET_CODE:
                scryfall_card = scryfall_helpers.get_named_card(card_name)
            else:
                scryfall_card = scryfall_helpers.get_named_card(card_name, set_code)

            if scryfall_card is None:
                raise ValueError(f"No card found for {card_name}.")

            order_list.append(OrderCard(scryfall_card, user, count))

        return order_list

class Inventory:
    cards: List[InventoryCard]
    sheet_id: Optional[str]
    users: List[str]

    # Map column numbers from spreadsheet
    COLUMN_MAP = {
        "name": 0,
        "set_code": 1,
        "artist": 2,
        "frame": 3,
        "type_": 4,
        "color": 5,
        "modified": 6,
        "file_path": 7,
        "counts": (8, -3),
        "on_hand": -2,
        "order_count": -1,
    }
    HEADER_ROW = 4  # Ignore calculated fields in rows 1-3
    HIDDEN_FIELDS = ["on_hand", "order_count"]

    def __init__(self, cards: List[InventoryCard], users: List[str], sheet_id: str = None):
        self.cards = cards
        self.sheet_id = sheet_id
        self.users = users

    @classmethod
    def from_csv(cls, input: List[List[str]]):
        header = input[Inventory.HEADER_ROW - 1]
        users = header[Inventory.COLUMN_MAP["counts"][0]:Inventory.COLUMN_MAP["counts"][1]]
        cards = [InventoryCard.from_row(r) for r in input[Inventory.HEADER_ROW:]]
        return Inventory(cards, users)

    def __str__(self):
        return f"Inventory: {len(self.cards)} cards for {len(self.users)} people ({', '.join(self.users)})"

    def add_to_order(self, order_card: OrderCard):
        """Adds a card to the inventory.

        Args:
            order_card (OrderCard): Order card to add

        Raises:
            ValueError: If the card does not exist in the inventory yet.
        """
        matched_cards = [c for c in self.cards if order_card.name in c.name]
        if len(matched_cards) < 1:
            raise ValueError(f"No cards found named {order_card.name}.")

        to_order = matched_cards[-1]  # Pick the last card if multiple match
        to_order.add_to_order(self.users.index(order_card.user), order_card.count)
