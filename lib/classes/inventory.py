from typing import List, Optional, Union


class InventoryCard:
    """Represent attributes of a card for an inventory.

    Attributes:
        name (str): Name of the card
        modified (str): Timestamp string of the last modified date
        type_ (str): Type of the card (ie. color identity or land)
        order_count (int): Number of proxies to order
    """
    # TODO: Consider tying in `Card` object to class to keep `folder_name` out of that class.
    #       (Optional `type_` and `card` arguments here to infer type through either?)
    counts: List[int]
    name: str
    modified: str
    on_hand: int
    order_count: int
    type_: str

    def __init__(self,
            name: str, type_: str, modified: str, counts: List[Union[str, int]],
            on_hand: Union[str, int], order_count: Union[str, int]):
        if type_ not in Inventory.VALID_TYPES:
            raise ValueError(f"Type must be one of: {Inventory.VALID_TYPES}")

        self.name = name
        self.modified = modified  # TODO: Convert to datetime?
        self.type_ = type_
        self.counts = [int(count) if count else 0 for count in counts]
        self.on_hand = int(on_hand) if on_hand else 0
        self.order_count = int(order_count) if order_count else 0

    @classmethod
    def from_row(cls, row: str):
        try:
            return cls(
                name=row[Inventory.COLUMN_MAP['name']],
                type_=row[Inventory.COLUMN_MAP['type_']],
                modified=row[Inventory.COLUMN_MAP['modified']],
                counts=row[Inventory.COLUMN_MAP['counts'][0]:Inventory.COLUMN_MAP['counts'][1]],
                on_hand=row[Inventory.COLUMN_MAP['order_count']],
                order_count=row[Inventory.COLUMN_MAP['order_count']])
        except IndexError as e:
            print(f"Error parsing: {row}")
            raise e
        except ValueError as e:
            print(f"Invalid value: {row}")
            raise e

    def as_separated_value(self, separator=" "):
        output = {k: getattr(self, k) for k in Inventory.COLUMN_MAP.keys()}
        output["counts"] = separator.join([str(c) for c in output["counts"]])
        return separator.join([str(v) for v in output.values()])
    
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


class Inventory:
    cards: List[InventoryCard]
    sheet_id: Optional[str]
    users: List[str]

    # Map column numbers from spreadsheet
    COLUMN_MAP = {
        "name": 0,
        "type_": 1,
        "modified": 2,
        "counts": (3, -3),
        "on_hand": -2,
        "order_count": -1,
    }
    HEADER_ROW = 4  # Ignore calculated fields in rows 1-3
    VALID_TYPES = [
        "White",
        "Blue",
        "Black",
        "Red",
        "Green",
        "Land",
        "Multi",
        "Colorless",
        "Token",
    ]

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
        return f"Inventory: {len(self.cards)} cards for {len(self.users)} users ({', '.join(self.users)})"
