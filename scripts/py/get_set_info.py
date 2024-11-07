import sys
import simplejson as json
from mtg_autoproxy.helpers import scryfall_helpers


def main(set_code: str, output_path: str):
    print(f"Searching Scryfall for set: {set_code}...", end="", flush=True)
    set_ = scryfall_helpers.get_set_info(set_code)

    print("Saving JSON...", end="", flush=True)
    with open(output_path, 'w') as f:
        f.write(json.dumps(set_, indent=4, sort_keys=True))

    print("Done!")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
