create-venv:
	python3 -m venv env
	env/bin/pip install -r requirements.txt

run-scryfall-scan:
	env $$(cat .env | xargs) python art_scan_scryfall.py
