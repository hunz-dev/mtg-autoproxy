from dataclasses import dataclass


@dataclass
class InventoryCard:
    """Represent attributes of a card for an inventory.

    Attributes:
        name (str): Name of the card
        modified (str): Timestamp string of the last modified date
        type_ (str): Type of the card (ie. color identity or land)
    """
    # TODO: Consider tying in `Card` object to class to keep `folder_name` out of that class.
    #       (Optional `type_` and `card` arguments here to infer type through either?)
    name: str
    modified: str
    type_: str
    
    def as_seperated_value(self, separator=","):
        return separator.join([self.name, self.type_, self.modified])
    
    @property
    def csv(self):
        return self.as_seperated_value(separator="\t")

    @property
    def tsv(self):
        return self.as_seperated_value(separator="\t")

    def __getitem__(self, x):
        return getattr(self, x)

    def __str__(self):
        return self.csv
