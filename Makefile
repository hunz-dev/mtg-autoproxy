PIP := env/bin/pip
PYTHON := env/bin/python

virtual-env:
	python3 -m venv env
	$(PIP) install -r requirements.txt

run-scryfall-scan:
	env $$(cat .env | xargs) $(PYTHON) art_scan_scryfall.py
