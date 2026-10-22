import csv
import sys
from pathlib import Path


OUTPUT_FILE = "riftbound_rc_quals_results.csv"


def event_name(filename):
    return filename.stem.removeprefix("riftbound_").removesuffix("_top64").replace("_", " ").title()


def read_event(filename):
    with filename.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        required_fields = {"placing", "username", "legend"}
        if not reader.fieldnames or not required_fields.issubset(reader.fieldnames):
            raise ValueError(f"{filename.name} must contain placing, username, and legend columns")

        results = {}
        for line_number, row in enumerate(reader, start=2):
            placing = (row.get("placing") or "").strip()
            username = (row.get("username") or "").strip()
            legend = (row.get("legend") or "").strip()

            # Singapore's source rows have a missing quote between username and legend.
            if legend.endswith('"') and "," in username:
                username, legend_start = username.split(",", 1)
                legend = f"{legend_start}, {legend[:-1].strip()}".strip()

            try:
                placing = str(int(placing))
            except ValueError as error:
                raise ValueError(f"{filename.name}:{line_number} has an invalid placing") from error
            if not username:
                raise ValueError(f"{filename.name}:{line_number} is missing a username")
            if username in results:
                raise ValueError(f"{filename.name}:{line_number} repeats player {username!r}")

            results[username] = {"Place": placing, "Legend": legend}

    return results


def main():
    directory = Path(__file__).resolve().parent
    event_files = sorted(directory.glob("riftbound_*_top64.csv"))
    if not event_files:
        raise FileNotFoundError(f"No event CSV files found in {directory}")

    events = {}
    for filename in event_files:
        event = event_name(filename)
        if event in events:
            raise ValueError(f"Multiple CSV files map to event {event!r}")
        events[event] = read_event(filename)

    players = sorted(
        {username for results in events.values() for username in results},
        key=str.casefold,
    )
    fieldnames = ["Player"] + [
        f"{event} {result}"
        for event in events
        for result in ("Place", "Legend")
    ]

    output_path = directory / OUTPUT_FILE
    with output_path.open("w", encoding="utf-8", newline="") as destination:
        writer = csv.DictWriter(destination, fieldnames=fieldnames)
        writer.writeheader()
        for username in players:
            row = {"Player": username}
            for event, results in events.items():
                if username in results:
                    row[f"{event} Place"] = results[username]["Place"]
                    row[f"{event} Legend"] = results[username]["Legend"]
            writer.writerow(row)

    print(f"Wrote {len(players)} players across {len(events)} events to {output_path.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
