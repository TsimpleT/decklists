import { Decklist, IDecklist } from "./Decklist";
import { AEG_20250817 } from "./Decklists/Aegis";
import { HZO_20250914, BJO_20250831, CQO_20250907, GZO_20250824, SFC_20250803, CNO_20251101, CDO_20260124, FZO_20260117, DLO_20260131, NJO_20260207, CNO_20260321, SZO_20260516, XAO_20260523, TJO_20260606, CSO_20260614, CNO_20260719, CNO_20260830, SYO_20260913 } from "./Decklists/China";
import { RFC_20250809 } from "./Decklists/France";
import { MCW_20250807 } from "./Decklists/Italy";
import { LUX_20250816, LUX_20251108 } from "./Decklists/LuxuryGaming";
import { RMW_20250809, RMW_20250802, RMW_20250726, RMW_20251214 } from "./Decklists/RiftboundMetaWeekly";
import { RLL_20250919, RLL_20250905, RLL_20250822, RLL_20250823, RLT_20250808, RLT_20251002 } from "./Decklists/Riftlab";
import { TNF_20250918, TNF_20250911, TNF_20250904, TNF_20250828, TNF_20250807, TNF_20250731, TNF_20250814, TNF_20250821, TNF_20250925, TNF_20251002, TNF_20251009, TNF_20251016, TNF_20251023, TNF_20251030, TNF_20251106, TNF_20251120, TNF_20251113, TNF_20251204, TNF_20251211, TNF_20251218 } from "./Decklists/ThursdayNightFights";
import { ALL_ARCHETYPES, Archetype } from "./Archetype";
import { RNR_20250927, RNR_20251011, RNR_20251018, RNR_20251025, RNR_20251108, RNR_20251115, RNR_20251130, RNR_20251220, RNR_20251227, RNR_20260104, RNR_20260114, RNR_20260120, RNR_20260214, RNR_20260306, RNR_20260318, RNR_20260328, RNR_20260403, RNR_20260404, RNR_20260410, RNR_20260411, RNR_20260429, RNR_20260509, RNR_20260520, RNR_20260603, RNR_20260627, RNR_20260711, RNR_20260725, RNR_20260801, RNR_20260808, RNR_20260815 } from "./Decklists/RunesAndRift";
import { TBB_20250927, TBB_20251004, TBB_20251011, TBB_20251018, TBB_20251026, TBB_20251109, TBB_20251116 } from "./Decklists/BandleBlitz";
import { RMX_20251004, RMX_20251011, RMX_20251018, RMX_20251025, RMX_20251117, RMX_20251124, RMX_20251208, RMX_20251215, RMX_20251222 } from "./Decklists/Riftmaxxing";
import { SRL_20251005 } from "./Decklists/SundayRiftboundLeague";
import { BRO_20251025, BRO_20251210, BRO_20251221 } from "./Decklists/Brocains";
import { CCS_20251122, CCS_20260314, CCS_20260524 } from "./Decklists/CharliesCollectables";
import { SCG_20251123, SCG_20260912 } from "./Decklists/StarCityGames";
import { REQ_20251206, REQ_20260221, REQ_20260228, REQ_20260418, REQ_20260425, REQ_20260516, REQ_20260530, REQ_20260613, REQ_20260620, REQ_20260822, REQ_20260905, RSS_20260418 } from "./Decklists/Officials";
import { PPG_20250315, RSS_20250704, PPG_20250705, PPG_20251212, PPG_20251213, PPG_20251214 } from "./Decklists/ProPlayGames";
import { NVA_20260207, NVA_20260503, NVA_20260726, NVA_20260912 } from "./Decklists/NovaRiftbound";
import { NRG_20260315, NRG_20260510, NRG_20260823 } from "./Decklists/NRG";
import { GSC_20260321 } from "./Decklists/Gamescon";
import { NZO_20260403 } from "./Decklists/Australia";
import { CCC_20260418, CCC_20260425, CCC_20260501, CCC_20260601, CCC_20260808 } from "./Decklists/ChinaCityChallengeWinners";
import { MIC_20260510, MIC_20260809 } from "./Decklists/Micelion";
import { TTN_20260509 } from "./Decklists/TitanGames";
import { TES_20260711, TES_20260725 } from "./Decklists/TurnEmSideways";
import { EXC_20260815, RSS_20260711 } from "./Decklists/Excalibur";
import { RSS_20260718, RSS_20260808, RSS_20260814, RSS_20260815 } from "./Decklists/OfficialOtherShowdowns";
import { NAT_20260729 } from "./Decklists/NationClash";
import { RUL_20260801 } from "./Decklists/RunesLeague";
import { GGH_20260803 } from "./Decklists/GGHaven";
import { CIR_20260803 } from "./Decklists/CircleTCG";
import { RCS_20260808 } from "./Decklists/RCSHobbyCon";
import { GEN_20260815 } from "./Decklists/GEN";

type TournamentAbbrName = "REQ" | "RMW" | "TNF" | "SFC" | "RLT" | "MCW" | "RFC" | "LUX" | "AEG" | "RLL" | "GZO" | "BJO" | "CQO" | "HZO" | "RNR" | "TBB" | "CNO" | "RMX" | "SRL" | "BRO" | "CCS" | "SCG" | "PPG" | "XYZ" | "FZO" | "CDO" | "DLO" | "NJO" | "NVA" | "NRG" | "GSC" | "SZO" | "NZO" | "RSS" | "CCC" | "MIC" | "TTN" | "XAO" | "TJO" | "CSO" | "TES" | "EXC" | "NAT" | "RUL" | "GGH" | "CIR" | "RCS" | "GEN" | "RAC" | "WHO" | "SYO";
type TournamentTier = number; // 0 = Championship, 1 = Regional, 2 = Regional-ish, 3 = Local, 4 = "Small Local";

export const ALL_METAS = [ "OGN", "SFD", "SFD2", "UNL", "VEN", "VEN2" ] as const;
export type Meta = typeof ALL_METAS[number];
export function META_FROM_STRING(str: string): Meta {
    return (ALL_METAS.includes(str.toUpperCase() as Meta)) ? str.toUpperCase() as Meta : ALL_METAS[ALL_METAS.length-1];
}
const META_NAMES: {[key in Meta]: string} = {
    "OGN": "Origins", "SFD": "Spiritforged (pre-ban)", "SFD2": "Spiritforged (post-ban)", "UNL": "Unleashed", "VEN": "Vendetta (pre-ban)", "VEN2": "Vendetta (post-ban)"
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

export const TOURNAMENT_RESULTS: TournamentResults[] = [
    SYO_20260913, SCG_20260912, NVA_20260912, REQ_20260905, CNO_20260830, NRG_20260823, REQ_20260822, RSS_20260815, GEN_20260815, EXC_20260815, RNR_20260815, RSS_20260814, MIC_20260809, RSS_20260808, RNR_20260808, RCS_20260808, CCC_20260808, CIR_20260803, GGH_20260803, RUL_20260801, RNR_20260801, NAT_20260729, NVA_20260726, RNR_20260725, TES_20260725, CNO_20260719, RSS_20260718, RSS_20260711, TES_20260711, RNR_20260711, PPG_20250705, RSS_20250704, RNR_20260627, REQ_20260620, CSO_20260614, REQ_20260613, TJO_20260606, RNR_20260603, CCC_20260601, REQ_20260530, CCS_20260524, XAO_20260523, RNR_20260520, REQ_20260516, SZO_20260516, NRG_20260510, MIC_20260510, RNR_20260509, TTN_20260509, NVA_20260503, CCC_20260501, RNR_20260429, CCC_20260425, REQ_20260425, REQ_20260418, CCC_20260418, RSS_20260418, RNR_20260411, RNR_20260410, NZO_20260403, RNR_20260404, RNR_20260403, RNR_20260328, CNO_20260321, RNR_20260318, RNR_20260306, GSC_20260321, NRG_20260315, PPG_20250315, CCS_20260314, REQ_20260228, REQ_20260221, RNR_20260214, NVA_20260207, NJO_20260207, DLO_20260131, CDO_20260124, RNR_20260120, FZO_20260117, RNR_20260114, RNR_20260104, RNR_20251227, RNR_20251220, RMX_20251222, BRO_20251221, TNF_20251218, RMX_20251215, RMW_20251214, PPG_20251214, PPG_20251213, PPG_20251212, TNF_20251211, BRO_20251210, RMX_20251208, REQ_20251206, TNF_20251204, RNR_20251130, RMX_20251124, SCG_20251123, CCS_20251122, TNF_20251120, RMX_20251117, TBB_20251116, RNR_20251115, TNF_20251113, TBB_20251109, LUX_20251108, RNR_20251108, TNF_20251106, CNO_20251101, TNF_20251030, TBB_20251026, RNR_20251025, BRO_20251025, RMX_20251025, TNF_20251023, TBB_20251018, RNR_20251018, RMX_20251018, TNF_20251016, TBB_20251011, RNR_20251011, RMX_20251011, TNF_20251009, SRL_20251005, TBB_20251004, RMX_20251004, RLT_20251002, TNF_20251002, TBB_20250927, RNR_20250927, TNF_20250925, RLL_20250919, TNF_20250918, HZO_20250914, TNF_20250911, CQO_20250907, RLL_20250905, TNF_20250904, BJO_20250831, TNF_20250828, GZO_20250824, RLL_20250823, RLL_20250822, TNF_20250821, AEG_20250817, LUX_20250816, TNF_20250814, RMW_20250809, RFC_20250809, RLT_20250808, MCW_20250807, TNF_20250807, SFC_20250803, RMW_20250802, TNF_20250731, RMW_20250726
].map((itr) => {
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

export const TOURNAMENT_RESULT_DICT: {[key in Meta]: TournamentResults[]} = {"OGN": [], "SFD": [], "SFD2": [], "UNL": [], "VEN": [], "VEN2": []};

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
