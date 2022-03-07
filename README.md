# Autoproxy - MTG Photoshop Automation
Photoshop scripting to generate high-quality Magic card renders, originally developed by Chilli-Axe, reloaded and updated by MrTeferi for use with developing new proxies by mpcfill.com contributors. If you need personal help with this app, join our discord: https://discord.gg/qdR2S4nQ6U

<p align="center">
  <a href="https://discord.gg/3kXw2qQwRH">
    <img alt="Discord" src="https://img.shields.io/discord/889831317066358815?label=Discord&style=plastic">
  </a>
  <img alt="GitHub" src="https://img.shields.io/github/license/MrTeferi/MTG-Autoproxy?color=1082C2&style=plastic">
  <img alt="Python" src="https://img.shields.io/badge/python-3.6%2B-yellow?style=plastic">
  <img alt="Photoshop" src="https://img.shields.io/badge/photoshop-CS5--2022-informational?style=plastic">
</p>

![img1](https://i.imgur.com/4TTvpND.png)

# Requirements
  * A copy of Photoshop. I tested the system using CS5 and CC 2015-2020, but other versions may work as well.
  * The Photoshop templates:
    * [Automated templates](https://drive.google.com/drive/folders/1UHZ_0dVQm_UTvTj5Z41YksnqemSoZajv?usp=sharing) (compatible with this project)
    * [Manual templates](https://drive.google.com/drive/folders/1wAH-JKPHa5cPcMcEiyE9q46WH6PEaXnj?usp=sharing) which may also be of interest
  * The following fonts, included in fonts folder:
    * [Beleren Smallcaps, MPlantin and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts) and [Beleren2016](https://magic.wizards.com/sites/all/themes/wiz_mtg/fonts/Beleren/Beleren2016-Bold.ttf),
    * Chilli's custom Magic symbols font, NDPMTG,ttf
    * [Keyrune](https://keyrune.andrewgioia.com/) and [Mana](https://mana.andrewgioia.com/), for the expansion symbol and transform symbols,
    * [Relay Medium](https://www.fontsmarket.com/font-download/relay-medium) and Calibri (comes with Windows)
  * [json2.js](https://github.com/douglascrockford/JSON-js), included but you may need to download a more recent version.
  * A standard installation of [Python 3](https://www.python.org/downloads/) (Make sure when you install python to check "Add python to PATH", if you have Windows 10 or later I HIGHLY recommend you get Python 3 from the windows store).

# Install and Usage Guide
* Clone to a folder of your choice, referred to as the *working directory*.
* Install the included fonts, only the ones listed above are required, the others may be useful to have.
* Download the Photoshop templates, create a folder called `templates` in the working directory, and extract them into the folder.
* Create a folder called `art` in the working directory, and another called `out`.
* Move all of your card artwork to the `art` folder. File names should be structured like `<CARDNAME> (<ARTIST NAME>).jpg`. Artist name is optional - if omitted, it will be retrieved from Scryfall. You can optionally specify the card's set by structuring the file name like `<CARDNAME>$<SET> (<ARTIST NAME>).jpg`. You can also specify the card's set with `<CARDNAME> [<SET>] (<ARTIST NAME>).jpg`, this will force the template to display the set code and choose the automatic set symbol using the code but NOT use the set code for the scryfall search. You can also include your proxy creator name like so: `<CARDNAME> {<CREATOR NAME>} (<ARTIST NAME>).jpg`. For this to work you need to go into the pohotoshop template and add a text layer called "ProxyCreator" in the Legal group.
* Run the script `render_all` to render each card in the `art` folder, and store the results in the `out` folder. `render_target` does the same but for a single image.
* Modify `settings.jsx` to change how the scripts behave - change the default expansion symbol; force the system to use a particular template; choose whether to use automatic set symbols; choose whether to use a .psd or .psb file; change set symbol size and line shift; or force the system to stop before saving your cards and exiting so you can adjust them manually.
* **Optional**: Copy the files from `/scripts/utils` to the `Scripts` folder in your Photoshop installation. For me, this was `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts`. Modify the paths in those files to point to the corresponding files in `/scripts`. This enables the use of a few utility scripts which are handy when making renders manually.

# FAQ
* *I want to change the set symbol to something else.* Head over to https://andrewgioia.github.io/Keyrune/cheatsheet.html - you can use any of these symbols for the set symbol for your cards. Copy the text of the symbol you want on the cheatsheet, then replace the expansion symbor character in quotations at the top of the file with the character you copied.
* *I'm getting an error message saying that the Python call failed and `card.json` was not created.* This is a result of the Python command not executing properly on your computer. The error message contains a copy of the command the system attempted - copy this command and try running it from the command line. You may need to adjust the command in `call_python()` in `render.jsx` depending on how your Python installation is configured. The line that says `/usr/local/bin/python3` will either need to be changed to `python` or `py` OR when you setup Python you didn't set up the path variable. Try installing python from the microsoft store which will automatically setup a path variable, or reinstall python and make sure that option is checked during setup.

# Scope
* Modern style cards, normal and extended; transform and mdfc, front and back; basic lands, normal, Theros, and Unstable styles; planeswalkers, normal and extended; mutate, adventure, miracle, and snow cards; and various flavours of fancy frames - stargazing, universes beyond, masterpiece, ZNE expedition, and womensday.
* Leveler and saga cards require manual intervention to position text layers, but are automated up until that point.
* Planeswalkers also require manual intervention to position text layers and the ragged textbox divider, but are automated up until that point.
* Flavour text divider is not supported, as rules text & flavour text are formatted in the same text layer, and it would be impractical to position the flavour text divider programmatically with Adobe's JavaScript library.

# Customisation
The repo includes a set of helper functions and boilerplate classes which make automating any given template straight-forward. You'll need reference layers (check out my templates on google drive for examples) for artwork to be positioned against, and for any text layers that need to be positioned vertically within a textbox. Check out the comments at the top of `templates.jsx` for more info, and you can review how I've automated my templates there for reference as well. You'll also need to adjust the function `select_template()` in `render.jsx` to point to your template class(es).
