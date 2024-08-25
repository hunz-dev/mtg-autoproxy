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
    name: str
    modified: str
    type_: str
    order_count: int

    # Map column numbers from spreadsheet
    COLUMN_MAP = {
        "name": 0,
        "type_": 1,
        "modified": 2,
        "order_count": -1,
    }

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

    def __init__(self, name: str, modified: str, type_: str, order_count: int):
        if type_ not in InventoryCard.VALID_TYPES:
            raise ValueError(f"Type must be one of: {InventoryCard.VALID_TYPES}")

        self.name = name
        self.modified = modified  # TODO: Convert to datetime?
        self.type_ = type_
        self.order_count = int(order_count) if order_count else 0

    @classmethod
    def from_row(cls, row: str):
        try:
            return cls(
                name=row[InventoryCard.COLUMN_MAP['name']],
                type_=row[InventoryCard.COLUMN_MAP['type_']],
                modified=row[InventoryCard.COLUMN_MAP['modified']],
                order_count=row[InventoryCard.COLUMN_MAP['order_count']])
        except IndexError as e:
            print(f"Error parsing: {row}")
            raise e
        except ValueError as e:
            print(f"Invalid value: {row}")
            raise e

    def as_separated_value(self, separator=" "):
        order = ["name", "type_", "modified", "order_count"]
        return separator.join([getattr(self, v) for v in order])
    
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
