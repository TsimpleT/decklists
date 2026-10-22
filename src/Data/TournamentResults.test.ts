import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { GET_CARD } from './Cards';
import { ALL_METAS, GET_ARCHETYPE_DECKLISTS, GET_PLACING, GET_TOURNAMENT_ABBR, GET_TOURNAMENT_DECKLIST, GET_TOURNAMENT_ID, GET_TOURNAMENT_NAME, TOURNAMENT_RESULTS } from './TournamentResults';
import { ALL_ARCHETYPES } from './Archetype';

test("Every tournament JSON file is included in TOURNAMENT_RESULTS", () => {
    const registeredTournamentIds = new Set(TOURNAMENT_RESULTS.map((tournament) =>
        `${tournament.abbrName}-${tournament.date.replaceAll("/", "")}`
    ));
    const tournamentFiles = readdirSync(join(__dirname, "decklists")).filter((fileName) => fileName.endsWith(".json"));
    const missingTournamentIds = tournamentFiles.flatMap((fileName) => {
        const tournament = JSON.parse(readFileSync(join(__dirname, "decklists", fileName), "utf8")) as unknown;
        if(!hasTournamentIdentifier(tournament)) {
            return [fileName];
        }
        const tournamentId = `${tournament.abbrName}-${tournament.date.replaceAll("/", "")}`;
        return registeredTournamentIds.has(tournamentId) ? [] : [tournamentId];
    });

    expect(missingTournamentIds).toEqual([]);
    expect(tournamentFiles).toHaveLength(TOURNAMENT_RESULTS.length);
});

test("Each tournament has a unique ID", () => {
    const seenTournamentIds = new Set<string>();
    const duplicateTournamentIds: string[] = [];

    for(const tournament of TOURNAMENT_RESULTS) {
        const tournamentId = GET_TOURNAMENT_ID(tournament.abbrName, tournament.date);
        if(seenTournamentIds.has(tournamentId)) {
            duplicateTournamentIds.push(tournamentId);
        }
        seenTournamentIds.add(tournamentId);
    }

    expect(duplicateTournamentIds).toEqual([]);
});

test("Tournament results are ordered newest first", () => {
    for(let index = 1; index < TOURNAMENT_RESULTS.length; index++) {
        expect(TOURNAMENT_RESULTS[index - 1].date >= TOURNAMENT_RESULTS[index].date).toBe(true);
    }
});

test("Each tournament has valid meta, tier, and date metadata", () => {
    const invalidMetadata: string[] = [];

    for(const tournament of TOURNAMENT_RESULTS) {
        const dateParts = tournament.date.split("/").map(Number);
        const [year, month, day] = dateParts;
        const dateIsValid = /^\d{4}\/\d{2}\/\d{2}$/.test(tournament.date) &&
            dateParts.length === 3 &&
            new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) ===
                `${tournament.date.replaceAll("/", "-")}`;
        const metaIsValid: boolean = (ALL_METAS as readonly string[]).includes(tournament.meta);
        const tierIsValid = Number.isInteger(tournament.tier) && tournament.tier >= 0 && tournament.tier <= 4;

        if(!metaIsValid || !tierIsValid || !dateIsValid) {
            invalidMetadata.push(
                `${GET_TOURNAMENT_ID(tournament.abbrName, tournament.date)}: ` +
                `meta=${tournament.meta}, tier=${tournament.tier}, date=${tournament.date}`
            );
        }
    }

    expect(invalidMetadata).toEqual([]);
});

test("Each deck's legend matches chosen champion", () => {
    for(let tr of TOURNAMENT_RESULTS) {
        for(let placing of tr.results) {
            for(let dl of placing.decklists) {
                if(dl.chosenChampion !== "" && dl.legend !== "") {
                    const lg = GET_CARD(dl.legend), cc = GET_CARD(dl.chosenChampion);
                    // console.dir(`${dl.tournId} | ${dl.username} | ${dl.placing} | ${lg.name} | ${cc.name}`);
                    expect(lg.championTag).toEqual(cc.championTag);
                }
            }
        }
    }
});

test("Each deck has 39 cards in the main deck", () => {
    const invalidDecks: string[] = [];
    for(let tr of TOURNAMENT_RESULTS) {
        for(let placing of tr.results) {
            for(let dl of placing.decklists) {
                if(dl.chosenChampion !== "" && dl.legend !== "") {
                    const mainDeckCount = dl.mainDeck.reduce((total, card) => total + card.count, 0);
                    if(mainDeckCount !== 39) {
                        invalidDecks.push(`${tr.tournamentName} | ${dl.username}: ${mainDeckCount}`);
                    }
                }
            }
        }
    }
    // console.dir(invalidDecks);
    expect(invalidDecks).toEqual([]);
});

test("Tournament lookup helpers return known results and handle unknown values", () => {
    const tournament = TOURNAMENT_RESULTS.find((result) => result.results.some((placing) => placing.decklists.length > 0));
    expect(tournament).toBeDefined();
    if(!tournament) { return; }

    const placing = tournament.results.find((result) => result.decklists.length > 0);
    expect(placing).toBeDefined();
    if(!placing) { return; }

    const decklist = placing.decklists[0];
    const tournamentId = GET_TOURNAMENT_ID(tournament.abbrName, tournament.date);
    expect(GET_TOURNAMENT_DECKLIST(tournamentId, decklist.username)).toBe(decklist);
    expect(GET_PLACING(tournamentId, decklist.username)).toBe(placing.placing);
    expect(GET_TOURNAMENT_NAME(tournamentId)).toBe(tournament.tournamentName);
    expect(GET_TOURNAMENT_ABBR(tournament.tournamentName)).toBe(tournament.abbrName);

    expect(GET_TOURNAMENT_DECKLIST("unknown-tournament", decklist.username)).toBeUndefined();
    expect(GET_TOURNAMENT_DECKLIST(tournamentId, "unknown-player")).toBeUndefined();
    expect(GET_PLACING("unknown-tournament", decklist.username)).toBeUndefined();
    expect(GET_PLACING(tournamentId, "unknown-player")).toBeUndefined();
    expect(GET_TOURNAMENT_NAME("unknown-tournament")).toBe("Unknown Tournament Name");
    expect(GET_TOURNAMENT_ABBR("unknown-tournament-name")).toBe("");
});

test("Archetype decklist indexes contain only eligible decks from the requested meta", () => {
    for(const meta of ALL_METAS) {
        for(const archetype of ALL_ARCHETYPES) {
            const expectedDecklists = TOURNAMENT_RESULTS
                .filter((tournament) => tournament.meta === meta)
                .flatMap((tournament) => tournament.results.flatMap((placing) =>
                    placing.decklists.filter((decklist) =>
                        decklist.archetype === archetype && decklist.mainDeck.length > 0
                    )
                ));

            expect(GET_ARCHETYPE_DECKLISTS(archetype, meta)).toEqual(expectedDecklists);
        }
    }
});

test("Each tournament decklist matches its tournament and placing", () => {
    const invalidDecklists: string[] = [];
    const duplicatePlayers: string[] = [];

    for(const tournament of TOURNAMENT_RESULTS) {
        const tournamentId = GET_TOURNAMENT_ID(tournament.abbrName, tournament.date);

        for(const placing of tournament.results) {
            const seenPlayers = new Set<string>();
            for(const decklist of placing.decklists) {
                if(decklist.tournId !== tournamentId || decklist.placing !== placing.placing) {
                    invalidDecklists.push(`${tournamentId} | ${decklist.username}`);
                }
                if(seenPlayers.has(decklist.username)) {
                    duplicatePlayers.push(`${tournamentId} | ${decklist.username}`);
                }
                seenPlayers.add(decklist.username);
            }
        }
    }

    expect(invalidDecklists).toEqual([]);
    expect(duplicatePlayers).toEqual([]);
});

function hasTournamentIdentifier(value: unknown): value is { abbrName: string; date: string } {
    return typeof value === "object" && value !== null &&
        "abbrName" in value && typeof value.abbrName === "string" &&
        "date" in value && typeof value.date === "string";
}
