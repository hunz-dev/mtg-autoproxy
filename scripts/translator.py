import time
import sys
import json
from urllib import request, parse, error
from translate import Translator

if __name__ == "__main__":
    name = sys.argv[1]
    # Use Scryfall to search for this card
    mtg_set = None

    # If the card specifies which set to retrieve the scan from, do that
    try:
        translator=Translator(to_lang="ja")
        translation=translator.translate(name)
        print("\n" + name + " translated to " + translation +  "! Saving JSON...", end="", flush=True)
    except:
        print("\nCouldn't translate the name of this card, saving original instead...", end="", flush=True)
        translation = name
        time.sleep(1)

    with open(sys.path[0] + "/translation.json", 'w', encoding='utf8') as f:
        result = str('{\"translation\":\"'+str(translation)+'"}')
        json.dump(str(result), f, ensure_ascii=False)

    print(" Done!", flush=True)
    input()
    time.sleep(0.1)