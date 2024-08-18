from dataclasses import dataclass
from datetime import datetime


@dataclass
class Proxy:
    """Store proxy, file and order information.

    Attributes:
        name (str): Name of the proxy
        type (str): Supertype of card
        last_edited (datetime): Last edited time of the file
        order_count (int): Number of proxies to order
    """
    name: str
    type: str
    last_edited: datetime
    order_count: int

    # Map column numbers from spreadsheet
    COL_MAP = {
        "name": 0,
        "type": 1,
        "last_edited": 2,
        "order_count": -1,
    }
    DATE_FORMAT_STR = "%b %d %H:%M"
    
    @property
    def is_mdfc(self) -> bool:
        return '//' in self.name

    @classmethod
    def from_row(cls, row):
        try:
            last_edited = datetime.strptime(row[cls.COL_MAP['last_edited']], cls.DATE_FORMAT_STR)
        except ValueError:
            last_edited = datetime.min

        try:
            return cls(
                name=row[cls.COL_MAP['name']],
                type=row[cls.COL_MAP['type']],
                last_edited=last_edited,
                order_count=int(row[cls.COL_MAP['order_count']])
            )
        except IndexError as e:
            print(f"Error parsing: {row}")
            raise e
        except ValueError as e:
            print(f"Invalid value: {row}")
            raise e
