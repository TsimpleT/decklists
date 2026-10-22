# FILE NAMING
- PascalCase (besides python)

# IMPORT ORDER:
- react / imported libraries / css
- data / views
between each bullet/section, an extra newline space
within each bullet/section, children folders first, then ../folder_name, then alphabetically

# GENERAL:
- new line at bottom of files
- no space between if/for/etc and the opening parenthesis

# DEFINITIONS
- id: id as printed at the bottom of the card
- baseId: id of first printing of card
- ttsId: id that TTS uses

# COMMITS:
- first line: "[MAJOR.REGULAR.TWEAK/FIX] <summary>"
- TODO.md / RELEASE-NOTES.md / UPDATE-HISTORY.md

# TO DEVELOP
```
$env:CI = 'true'; npm.cmd start
```

# TO BUILD
```
$env:CI = 'true'
npm.cmd test -- --watchAll=false --runInBand
npm.cmd run build
npm.cmd run deploy --ignore-scripts
```
