PIP := env/bin/pip
PYTHON := env/bin/python

venv:
	python3 -m venv env
	$(PIP) install --no-cache-dir -r requirements.txt

load-config:
	env $$(cat .env | xargs)

scan-mtgpics:
	$(load_config) $(PYTHON) -u art_scan_mtgpics.py

scan-scryfall:
	$(load_config) $(PYTHON) -u art_scan_scryfall.py
