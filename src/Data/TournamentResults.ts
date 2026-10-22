import { Decklist, IDecklist } from "./Decklist";
import { TOURNAMENT_DATA } from "./TournamentData.generated";
import { ALL_ARCHETYPES, Archetype } from "./Archetype";

type TournamentAbbrName = "REQ" | "RMW" | "TNF" | "SFC" | "RLT" | "MCW" | "RFC" | "LUX" | "AEG" | "RLL" | "GZO" | "BJO" | "CQO" | "HZO" | "RNR" | "TBB" | "CNO" | "RMX" | "SRL" | "BRO" | "CCS" | "SCG" | "PPG" | "XYZ" | "FZO" | "CDO" | "DLO" | "NJO" | "NVA" | "NRG" | "GSC" | "SZO" | "NZO" | "RSS" | "CCC" | "MIC" | "TTN" | "XAO" | "TJO" | "CSO" | "TES" | "EXC" | "NAT" | "RUL" | "GGH" | "CIR" | "RCS" | "GEN" | "RAC" | "WHO" | "SYO" | "NNC";
type TournamentTier = number; // 0 = Championship, 1 = Regional, 2 = Regional-ish, 3 = Local, 4 = "Small Local";

export const ALL_MAIN_SETS = [ "OGN", "OGS", "SFD", "UNL", "VEN", "RAD" ] as const;
export type MainSet = typeof ALL_MAIN_SETS[number];
export function MAIN_SET_FROM_STRING(str: string): MainSet {
    return (ALL_MAIN_SETS.includes(str.toUpperCase() as MainSet)) ? str.toUpperCase() as MainSet : ALL_MAIN_SETS[ALL_MAIN_SETS.length-1];
}
const NO_METAL_MAIN_SETS = [ "OGN", "OGS", "SFD" ];
export function SET_HAS_METAL(ms: MainSet): boolean {
    return !NO_METAL_MAIN_SETS.includes(ms);
}

export const ALL_METAS = [ "OGN", "SFD", "SFD2", "UNL", "VEN", "VEN2", "RAD" ] as const;
export type Meta = typeof ALL_METAS[number];
export function META_FROM_STRING(str: string): Meta {
    return (ALL_METAS.includes(str.toUpperCase() as Meta)) ? str.toUpperCase() as Meta : ALL_METAS[ALL_METAS.length-1];
}
const META_NAMES: {[key in Meta]: string} = {
    "OGN": "Origins", "SFD": "Spiritforged (pre-ban)", "SFD2": "Spiritforged (post-ban)", "UNL": "Unleashed", "VEN": "Vendetta (pre-ban)", "VEN2": "Vendetta (post-ban)",
    "RAD": "Radiance"
};
export function GET_META_NAME(meta: Meta): string {
    return (meta in META_NAMES) ? META_NAMES[meta] : "Unknown";
}

interface BaseTournamentResults<T> {
    tournamentName: string;
    abbrName: TournamentAbbrName;
    date: string;
    meta: Meta;
    tier: TournamentTier;
    host: string;
    size?: number;
    links: string[];
    results: T[];
}
export type ITournamentResults = BaseTournamentResults<ITournamentPlacing>;
export type TournamentResults = BaseTournamentResults<TournamentPlacing>;

interface BaseTournamentPlacing<T> {
    placing: string;
    decklists: T[];
}
type ITournamentPlacing = BaseTournamentPlacing<IDecklist>;
type TournamentPlacing = BaseTournamentPlacing<Decklist>;

export function GET_TOURNAMENT_ID(abbrName: string, date: string): string {
    return `${abbrName}-${date.replaceAll("/","")}`;
}

export const TOURNAMENT_RESULTS: TournamentResults[] = [...TOURNAMENT_DATA]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((itr: ITournamentResults) => {
        return {
            tournamentName: itr.tournamentName, abbrName: itr.abbrName, date: itr.date, meta: itr.meta, tier: itr.tier, host: itr.host, links: itr.links,
            results: itr.results.map((itp: ITournamentPlacing) => {
                return {
                    placing: itp.placing,
                    decklists: itp.decklists.map((idl) => new Decklist(idl, itr.tournamentName, GET_TOURNAMENT_ID(itr.abbrName, itr.date), itp.placing))
                };
            })
        };
    });

export const TOURNAMENT_RESULT_DICT: {[key in Meta]: TournamentResults[]} = {"OGN": [], "SFD": [], "SFD2": [], "UNL": [], "VEN": [], "VEN2": [], "RAD": []};

for(let tr of TOURNAMENT_RESULTS) {
    TOURNAMENT_RESULT_DICT[tr.meta].push(tr);
}

let tournamentDict: {[id: string]: TournamentResults} = {};
let tournamentNames: {[id: string]: string} = {};
let tournamentNameToAbbrDict: {[name: string]: string} = {};

let metaArchetypeDecklists: {[meta in Meta]: {[archetype in Archetype]: Decklist[]}} = Object.fromEntries(
    ALL_METAS.map((meta) => [meta,
        Object.fromEntries(ALL_ARCHETYPES.map((archetype) => [archetype, []]))
    ])
) as any;

for(let tournamentResults of Object.values(TOURNAMENT_RESULT_DICT).flat()) {
    const tournId = GET_TOURNAMENT_ID(tournamentResults.abbrName, tournamentResults.date);
    tournamentDict[tournId] = tournamentResults;
    tournamentNameToAbbrDict[tournamentResults.tournamentName] = tournamentResults.abbrName;
    tournamentNames[tournId] = tournamentResults.tournamentName;
    for(let placing of tournamentResults.results) {
        for(let decklist of placing.decklists) {
            if(decklist.archetype && decklist.mainDeck.length > 0) {
                metaArchetypeDecklists[tournamentResults.meta][decklist.archetype].push(decklist);
            }
        }
    }
}

export function GET_ARCHETYPE_DECKLISTS(archetype: Archetype, meta: Meta): Decklist[] {
    return metaArchetypeDecklists[meta][archetype];
}

export function GET_TOURNAMENT_DECKLIST(tournId: string, username: string): Decklist|undefined {
    if(!(tournId in tournamentDict)) { return undefined; }
    const tournamentResult = tournamentDict[tournId];
    for(let result of tournamentResult.results) {
        for(let decklist of result.decklists) {
            if(decklist.username === username) {
                return decklist;
            }
        }
    }
}
export function GET_PLACING(tournId: string, username: string): string|undefined {
    if(!(tournId in tournamentDict)) { return undefined; }
    const tournamentResult = tournamentDict[tournId];
    for(let result of tournamentResult.results) {
        for(let decklist of result.decklists) {
            if(decklist.username === username) {
                return result.placing;
            }
        }
    }
}

export function GET_TOURNAMENT_NAME(tournId: string): string {
    return (tournId in tournamentNames) ? tournamentNames[tournId] : "Unknown Tournament Name";
}

export function GET_TOURNAMENT_ABBR(tournamentName: string): string {
    return (tournamentName in tournamentNameToAbbrDict) ? tournamentNameToAbbrDict[tournamentName] : "";
}
