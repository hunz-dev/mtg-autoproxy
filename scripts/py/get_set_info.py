import time
import sys
import json
from urllib import request, parse, error


# TODO: Clean up
CARD_OUTPUT_PATH = "C:\\Users\\evanh\\Code\\mtg-autoproxy\\scripts\\jsx\\set.json"


if __name__ == "__main__":
    set_code = sys.argv[1]
    # Use Scryfall to search for this card
    mtg_set = None

    # If the card specifies which set to retrieve the scan from, do that
    try:
        print(f"Searching Scryfall for: Set: {set_code}...", end="", flush=True)
        mtg_set = request.urlopen(
            f"https://api.scryfall.com/sets/{parse.quote(set_code)}"
        ).read()
    except error.HTTPError:
        print("\nCouldn't retrieve set information. Probably no big deal!")
        time.sleep(1)

    print(" and done! Saving JSON...", end="", flush=True)

    json_dump = json.dumps(json.loads(mtg_set))
    with open(CARD_OUTPUT_PATH, 'w') as f:
        json.dump(json_dump, f)

    print(" and done!", flush=True)
    time.sleep(0.1)
