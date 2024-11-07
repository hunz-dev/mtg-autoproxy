from mtg_autoproxy.helpers import deepai_helpers, mtgpics_helpers, scryfall_helpers
from mtg_autoproxy.common import read_stdin


def process_query(
    query: str, output_path: str, skip_mtgpics: bool = False, skip_scryfall: bool = False,
    upscale: bool = False
) -> None:
    """Main entry function to process a query and save card images based on arguments.

    By default, the function will:
        1) Fetch card objects provided by Scryfall API
        2) Find assets on MTGPICS.com based on card information
        3) If nothing was found on MTGPICS.com, upscale original card image provided by Scryfall

    Args:
        query (str): Scryfall search query
        skip_mtgpics (bool, optional): Flag to skip MTGPICS.com fetch. Defaults to False.
        skip_scryfall (bool, optional): Flag to skip Scryfall image fetch. Defaults to False.
        upscale (bool, optional): Flag to enable AI upscaling on images. Defaults to False.
    """
    # Fetch HTML from MTGPICS with card info and save images
    results = list()
    if not skip_mtgpics:
        result = mtgpics_helpers.get_gamerid(query=query)
        if not result:
            print("No gamerid found for query...")
        else:
            for version in mtgpics_helpers.find_all_art_versions(*result):
                results.append(mtgpics_helpers.save_image(version, output_path))

    # If nothing is found, use Scryfall art w/ optional AI upscale
    if not skip_scryfall and (not any(results)):
        for card in scryfall_helpers.get_matched_cards(query):
            deepai_helpers.save_image(card, output_path, upscale=upscale)


if __name__ == "__main__":
    # Parse out asterisk to force scryfall image search
    [process_query(q.replace("*", ""), skip_mtgpics=("*" in q)) for q in read_stdin()]
