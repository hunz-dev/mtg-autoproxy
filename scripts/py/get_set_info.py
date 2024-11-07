import sys
import simplejson as json
from lib.helpers import scryfall_helpers


# TODO: Clean up
SET_OUTPUT_PATH = "scripts/jsx/set.json"


def main(set_code: str):
    print(f"Searching Scryfall for set: {set_code}...", end="", flush=True)
    set_ = scryfall_helpers.get_set_info(set_code)

    print("Saving JSON...", end="", flush=True)
    with open(SET_OUTPUT_PATH, 'w') as f:
        f.write(json.dumps(set_, indent=4, sort_keys=True))

    print("Done!")


if __name__ == "__main__":
    main(sys.argv[1])
