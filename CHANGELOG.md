# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Add

* Version number and zip templates named alongside
* Support for fast-saving (not closing template file in between render_all.jsx)
* Nested log statements when running art scan
* Use rate limiter decorator
* https://pypi.org/project/inflect/
* https://pypi.org/project/rich/

### Update

* Use `lib/scryfall_helpers.py` in art_scan.py
* Update repo structure to separate Photoshop from Python scripts
* Revise README.md
* Convert set symbols from encoding instead of pasting symbol (easier to compare)
* Scratchpad function to take decklist as inventory addition