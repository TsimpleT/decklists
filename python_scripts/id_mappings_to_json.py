import sys
import csv
import json

from script_helpers import *

csv_handler = [
    ("id", process_str),
    ("baseId", process_str),
    ("ttsId", process_str),
    ("rarity", process_str),
    ("baseCardName", process_str),
    ("version", process_str),
    ("notes", process_str),
    ("alterFlavor", process_boolean),
    ("alteredFlavorText", process_multi_line_str),
]

def main():
    file_date = input(f'Enter file date (default "{DEFAULT_DATE}"): ')
    if not file_date: file_date = DEFAULT_DATE
    last_id = ""
    with open(f"id_mappings_{file_date}.csv", 'r') as rf_raw:
        for row in reversed(rf_raw.readlines()):
            if row[3] == "-":
                last_id = row[:row.index(",")]
                break
    with open(f"id_mappings_{file_date}.csv", 'r') as rf_raw:
        # ID,Base ID,TTS ID
        next(rf_raw)
        rf = csv.reader(rf_raw)
        with open(f"IdMappings{file_date}.json", "w") as wf:
            wf.write(f'{{\n\t"lastUpdated": "{file_date}",\n\t"mappings": {{\n')
            for row in rf:
                i = 1
                wf.write(f'\t\t"{row[0]}": {{')
                for key,handler in csv_handler[1:]:
                    if row[i]:
                        if i > 1: wf.write(", ")
                        wf.write(f'"{key}":{handler(row[i])}')
                    i += 1
                wf.write("}\n" if row[0] == last_id else "},\n")
            wf.write('\t}\n}\n')
    
    print(f"IdMappings{file_date}.json written successfully")
    return 0

if __name__ == "__main__":
    sys.exit(main())
