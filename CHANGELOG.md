# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add logging levels and make use of debug logs
- Add scratchpad block for adding on hand cards to inventory
- Allow token & custom import without Scryfall
- Support for fast-saving (not closing template file in between render_all.jsx)
- https://pypi.org/project/rich/

### Changed

- Update repo structure to separate Photoshop from Python scripts
- Revise README.md
- Update python version

### Fixed

- Have MDFC cards only take a single line in inventory (ie. skip back sides)
- Use color instead of color identity for inventory cards
- Fix google_auth for private sheets

## [1.1.4] - 2024-08-22

### Added

- Docstrings to missing functions/classes
- Error handling for `Proxy` initialization (from CSV)
- Additional method to download MTGPICS images
- Capability to capture an TSV-based inventory for all generated proxies
- Capability to download set icons from Keyrune
- Structure to the `scratchpad.ipynb` notebook for common operations
- `gamerid` fetch for MTGPICS for more consistent results
- Mapping of MTGPICS to Scryfall set code to correct URIs
- Order import (from decklist to inventory)
- Order amendments for inventory

### Changed

- Move objects and common functionality to helper modules/classes for scratchpad (located in `lib/`)
    - Classes: `InventoryCard`, `ScryfallCard`, `MtgPicsCard`
    - Modules: `common`, `mtg_helpers`, `os_helpers`, `scryfall_helpers`
- File output structure to include artist name
- Move `*_helpers` to `lib.helpers`
- Merged `InventoryCard` and `Proxy` classes as they were performing overlapping duties
- Reduced scryfall limiting rate
- Adjusted file name structure to match art to proxy consistently

### Fixed

- MDFC inventory update (see. test.json)
- Changed fixed column number to look at last column instead of a hardcoded value (to be flexible with any number of users)

## [1.1.3] - 2023-07-23

### Added

- `scratchpad.ipynb` Jupyter notebook for common operations and debugging capabilities
- Library for Google authentication capabilities

## [1.1.2] - 2023-03-07

### Added

- Ability to force scryfall search (as opposed to only doing it if MTGPICS fails)
- Support for MDFC in the art scan process
- Layer in Photoshop templates to handle extra components of the set symbol

### Updated

- Revise logs from MTGPICS output
- Simplify `Card` dataclass to use a built-in function for attribute selection

## [1.1.1] - 2023-02-16

### Added

- Set identifier to file name in the art scan process
- Option to force reminder text (useful in extended/full art land proxies)
- Support for dotenv files
- Create Makefile for common run procedures
- `dataclass` to handle Scryfall card-like objects
- Capability to fetch images from MTGPICS


### Changed

- Updated art scan to work with a list and Scryfall-based syntax


## [1.1.0] - 2023-02-16

_Initial release after fork from [Investigamer/MTG-Autoproxy](https://github.com/Investigamer/MTG-Autoproxy)

### Added

- Override for rarity symbol (useful for retro cards)

### Changed

- Support dynamic stroke color on set symbols based on template type
- Adjust legal footer

### Removed

- Unused & unreferenced scripts

## Template

```markdown
## [major.minor.patch] - YYYY-MM-DD

### Added

### Changed

### Removed

### Fixed
```