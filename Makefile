PIP := env/bin/pip
PYTHON := env/bin/python

venv:
	python3 -m venv env
	$(PIP) install --no-cache-dir -r requirements.txt

scan-mtgpics:
	env $$(cat .env | xargs) $(PYTHON) art_scan_mtgpics.py

scan-scryfall:
	env $$(cat .env | xargs) $(PYTHON) art_scan_scryfall.py
