import { TO_BASE_ID } from "./Cards";
import { Decklist } from "./Decklist";
import { Meta } from "./TournamentResults";

export const ALL_ARCHETYPES = [
    "Ahri", "Darius", "Jinx", "Jinx Miracle", "Kai'Sa", "Kai'Sa Control", "Lee Sin", "Leona", "Miss Fortune Aurora", "Miss Fortune Aggro", "Sett Aurora", "Sett", "Teemo", "Viktor", "Viktor Control", "Volibear", "Yasuo",
    "Annie", "Garen", "Lux Control", "Yi (OGS)", "Yi (OGS) Aurora", "Garen Aurora",
    "Rumble", "Lucian", "Draven", "Draven Miracle", "Rek'Sai", "Ornn", "Jax", "Irelia", "Azir", "Ezreal Control", "Ezreal Rat", "Renata Glasc", "Sivir", "Sivir Miracle", "Sivir Aurora", "Fiora",
    "Jhin", "Rengar", "Pyke", "Vi", "Lillia", "Yi (UNL)", "Vex", "Ivern", "Diana", "LeBlanc", "Kha'Zix", "Poppy Aurora",
    "Akali", "Renekton", "Zed", "Nasus", "Shen", "Jayce", "Mel", "Ambessa", "Kennen Control", "Kennen Hook", "Kennen Miracle",
    "Unknown"
] as const;
export type Archetype = typeof ALL_ARCHETYPES[number];

export function ARCHETYPE_FROM_STRING(str: string): Archetype {
    return (ALL_ARCHETYPES.includes(str as Archetype)) ? str as Archetype : "Unknown";
}

const archetypeLegendDict: {[archetype in Archetype]: string} = {
    "Annie": "OGS-017",
    "Yi (OGS)": "OGS-019",
    "Yi (OGS) Aurora": "OGS-019",
    "Lux Control": "OGS-021",
    "Garen": "OGS-023",
    "Garen Aurora": "OGS-023",
    "Kai'Sa": "OGN-247",
    "Kai'Sa Control": "OGN-247",
    "Volibear": "OGN-249",
    "Jinx": "OGN-251",
    "Jinx Miracle": "OGN-251",
    "Darius": "OGN-253",
    "Ahri": "OGN-255",
    "Lee Sin": "OGN-257",
    "Yasuo": "OGN-259",
    "Leona": "OGN-261",
    "Teemo": "OGN-263",
    "Viktor": "OGN-265",
    "Viktor Control": "OGN-265",
    "Miss Fortune Aggro": "OGN-267",
    "Miss Fortune Aurora": "OGN-267",
    "Sett": "OGN-269",
    "Sett Aurora": "OGN-269",
    "Rumble": "SFD-181",
    "Lucian": "SFD-183",
    "Draven": "SFD-185",
    "Draven Miracle": "SFD-185",
    "Rek'Sai": "SFD-187",
    "Ornn": "SFD-189",
    "Jax": "SFD-193",
    "Irelia": "SFD-195",
    "Azir": "SFD-197",
    "Ezreal Control": "SFD-199",
    "Ezreal Rat": "SFD-199",
    "Renata Glasc": "SFD-201",
    "Sivir": "SFD-203",
    "Sivir Miracle": "SFD-203",
    "Sivir Aurora": "SFD-203",
    "Fiora": "SFD-205",
    "Jhin": "UNL-181",
    "Rengar": "UNL-183",
    "Pyke": "UNL-185",
    "Vi": "UNL-187",
    "Lillia": "UNL-189",
    "Yi (UNL)": "UNL-191",
    "Vex": "UNL-193",
    "Ivern": "UNL-195",
    "Diana": "UNL-197",
    "LeBlanc": "UNL-199",
    "Kha'Zix": "UNL-201",
    "Poppy Aurora": "UNL-203",
    "Akali": "VEN-139",
    "Renekton": "VEN-141",
    "Zed": "VEN-143",
    "Nasus": "VEN-145",
    "Shen": "VEN-147",
    "Jayce": "VEN-149",
    "Mel": "VEN-151",
    "Ambessa": "VEN-153",
    "Kennen Control": "VEN-155",
    "Kennen Hook": "VEN-155",
    "Kennen Miracle": "VEN-155",
    "Unknown": ""
};

export function ARCHETYPE_TO_LEGEND_BASE_ID(archetype: Archetype): string {
    return (archetype in archetypeLegendDict) ? archetypeLegendDict[archetype] : "";
}
let legendArchetypesDict: {[baseId: string]: Archetype[]} = {};
for(let archetypeStr in archetypeLegendDict) {
    const archetype = archetypeStr as Archetype;
    const id = archetypeLegendDict[archetype];
    if(!(id in legendArchetypesDict)) {
        legendArchetypesDict[id] = [];
    }
    legendArchetypesDict[id].push(archetype);
}
// dupes
// legendArchetypesDict["UNL-191"] = ["Yi (OGS)", "Yi (OGS) Aurora"];

function LEGEND_BASE_ID_TO_ARCHETYPE(baseId: string): Archetype {
    return !(baseId in legendArchetypesDict) ? "Unknown" : (legendArchetypesDict[baseId].length === 1) ? legendArchetypesDict[baseId][0] : "Unknown";
}

export function PREDICT_ARCHETYPE(decklist: Decklist): Archetype {
    if(decklist.legend === "") {
        return "Unknown";
    }
    const baseLegendId = TO_BASE_ID(decklist.legend);
    const potentialArchetype = LEGEND_BASE_ID_TO_ARCHETYPE(baseLegendId);
    if(potentialArchetype !== "Unknown") {
        return potentialArchetype;
    } else if(baseLegendId === "OGS-019") {
        return decklist.contains("OGN-160", {exactCount: 3}) ? "Yi (OGS) Aurora" : "Yi (OGS)";
    } else if(baseLegendId === "OGN-247") {
        return decklist.contains("OGN-098") && decklist.contains("OGN-099") ? "Kai'Sa Control" : "Kai'Sa"; // energy conduit + garbage grabber
    } else if(baseLegendId === "OGN-267") {
        return decklist.contains("OGN-160", {exactCount: 3}) ? "Miss Fortune Aurora" : "Miss Fortune Aggro";
    } else if(baseLegendId === "OGN-269") {
        return decklist.contains("OGN-160", {exactCount: 3}) ? "Sett Aurora" : "Sett";
    } else if(baseLegendId === "OGS-023") {
        return decklist.contains("OGN-160", {exactCount: 3}) ? "Garen Aurora" : "Garen";
    } else if(baseLegendId === "SFD-185") {
        return decklist.contains("SFD-012", {exactCount: 3}) ? "Draven Miracle" : "Draven";
    } else if(baseLegendId === "OGN-265") {
        return (decklist.numOfCardType("Spell") >= 27) ? "Viktor Control" : "Viktor"; 
    } else if(baseLegendId === "SFD-203") {
        return decklist.contains("OGN-160", {exactCount: 3}) ? "Sivir Aurora" : decklist.contains("SFD-122", {exactCount: 3}) ? "Sivir Miracle" : "Sivir";
    } else if(baseLegendId === "OGN-251") {
        return decklist.contains("SFD-012", {exactCount: 3}) ? "Jinx Miracle" : "Jinx";
    } else if(baseLegendId === "SFD-199") {
        return decklist.contains("OGN-091") && decklist.contains("SFD-134") ? "Ezreal Rat" : "Ezreal Control";
    } else if(baseLegendId === "VEN-155") {
        return decklist.contains("OGN-242", {exactCount: 3}) ? "Kennen Hook" : decklist.contains("OGN-195", {exactCount: 3}) ? "Kennen Miracle" : "Kennen Control";
    }
    return "Unknown";
}

export const ARCHETYPE_TIER_NAMES = ["Favorites", "Contenders", "Real Challengers", "Potential Challengers", "Struggling", "Memes"];
const META_ARCHETYPE_TIERS: {[meta in Meta]: Archetype[][]} = {
    "VEN2": [
        ["LeBlanc", "Jayce", "Yi (OGS)", "Azir", "Irelia"],
        ["Rengar", "Rek'Sai", "Akali", "Diana", "Ornn", "Fiora", "Lillia"],
        ["Lucian", "Kai'Sa", "Kennen Miracle", "Viktor", "Vex", "Kha'Zix", "Nasus", "Ezreal Control", "Ambessa", "Kennen Hook"],
        ["Yi (UNL)", "Sivir Aurora", "Poppy Aurora", "Draven", "Jax", "Kennen Control", "Sivir", "Jhin"],
        ["Ivern", "Rumble", "Vi", "Renekton", "Mel"],
        ["Pyke", "Zed", "Renata Glasc", "Shen"],
    ],
    "VEN": [
        ["Kennen Miracle", "Yi (OGS)", "Azir", "Irelia"],
        ["Rengar", "Jayce", "Ezreal Control", "Lux Control", "Akali", "Rek'Sai", "Diana", "LeBlanc", "Kha'Zix"],
        ["Ornn", "Draven", "Annie", "Lucian", "Fiora", "Kennen Hook", "Sivir Aurora", "Viktor", "Viktor Control", "Mel", "Nasus", "Vex", "Lillia"],
        ["Kai'Sa", "Kennen Control", "Miss Fortune Aurora", "Ambessa", "Pyke", "Zed", "Sivir", "Darius", "Poppy Aurora", "Jhin", "Yi (UNL)"],
        ["Teemo", "Volibear", "Jinx", "Lee Sin", "Jax", "Vi", "Renekton", "Ahri", "Rumble", "Ivern"],
        ["Yasuo", "Leona", "Renata Glasc", "Shen"],
    ],
    "UNL": [
        ["Yi (OGS)", "Diana", "Sivir Aurora"],
        ["Irelia", "Ezreal Control", "LeBlanc", "Annie", "Azir", "Rek'Sai"],
        ["Draven", "Viktor", "Vex", "Sett", "Darius", "Viktor Control", "Kai'Sa", "Fiora", "Miss Fortune Aurora", "Kha'Zix", "Rengar", "Lillia", "Yi (OGS) Aurora", "Lux Control"],
        ["Poppy Aurora", "Teemo", "Pyke", "Lucian", "Yi (UNL)", "Ornn", "Volibear", "Jinx", "Lee Sin", "Jax", "Vi"],
        ["Ahri", "Rumble", "Ivern", "Garen Aurora", "Jhin"],
        ["Yasuo", "Leona", "Renata Glasc"],
    ],
    "SFD2": [
        ["Draven", "Irelia"],
        ["Annie", "Yi (OGS)", "Azir"],
        ["Viktor", "Kai'Sa", "Ezreal Control", "Lucian", "Darius"],
        ["Sett", "Fiora", "Rek'Sai", "Ahri", "Yasuo", "Volibear", "Leona", "Lux Control", "Sivir", "Miss Fortune Aurora", "Sivir Aurora", "Lee Sin", "Rumble"],
        ["Jax", "Teemo", "Ornn", "Jinx", "Renata Glasc", "Garen Aurora"],
    ],
    "SFD": [
        ["Draven Miracle", "Draven"],
        ["Ezreal Control", "Irelia", "Kai'Sa", "Miss Fortune Aurora", "Sivir Aurora", "Sivir Miracle"],
        ["Fiora", "Viktor", "Annie", "Lucian", "Yi (OGS)", "Ezreal Rat", "Viktor Control", "Azir", "Sett", "Lux Control", "Jinx Miracle", "Jax", "Rek'Sai"],
        ["Yi (OGS) Aurora", "Ahri", "Rumble", "Volibear", "Teemo", "Yasuo", "Darius", "Renata Glasc"],
        ["Leona", "Sett Aurora", "Lee Sin", "Ornn", "Garen Aurora"],
        ["Garen"],
    ],
    "OGN": [
        ["Kai'Sa", "Annie"],
        ["Miss Fortune Aurora", "Yi (OGS) Aurora", "Yi (OGS)"],
        ["Sett", "Viktor", "Ahri", "Darius", "Teemo"],
        ["Kai'Sa Control", "Yasuo"],
        ["Lee Sin", "Sett Aurora", "Volibear", "Lux Control", "Jinx", "Leona", "Miss Fortune Aggro", "Garen Aurora"],
        ["Garen"],
    ]
};
export function GET_ARCHETYPE_TIERS(meta: Meta): Archetype[][] {
    return META_ARCHETYPE_TIERS[meta];
}

export function GET_MAX_ARCHETYPE_TIER_SIZE(meta: Meta) {
    return Math.max(...META_ARCHETYPE_TIERS[meta].map((tier) => tier.length))
};

const ARCHETYPE_ANNOTATIONS: {[meta in Meta]: {[key in Archetype]?: string[]}} = {
    "VEN2": {
        "LeBlanc": ["Up On the rise"],
        "Ambessa": ["Up On the rise"],
        "Jax": ["Up On the rise"],
        "Jayce": ["Up On the rise"],
        "Poppy Aurora": ["Up On the rise"],
        "Lucian": ["Up On the rise", "Question Speculative"],
        "Viktor": ["Up On the rise", "Question Speculative"],
        "Kai'Sa": ["Up On the rise", "Question Speculative"],
        "Yi (UNL)": ["Up On the rise"],
        "Ornn": ["Up On the rise"],
        "Lillia": ["Up On the rise"],
        "Fiora": ["Up On the rise"],
        "Kha'Zix": ["Down On the decline"],
        "Zed": ["Down On the decline"],
        "Pyke": ["Down On the decline"],
        "Draven": ["Down On the decline"],
        "Mel": ["Down On the decline"],
        "Sivir Aurora": ["Down On the decline"],
        "Akali": ["Down On the decline"],
        "Kennen Miracle": ["Down On the decline"],
        "Ezreal Control": ["Down On the decline"],

    },
    "VEN": {
        "Kennen Miracle": ["Trophy Won Auckland SD + Many Top 8s"],
        "Akali": ["Up On the rise", "Trophy Won Singapore RQ + Shenyang Open"],
        "Ornn": ["Down On the decline", "Trophy Won Barcelona RQ"],
        "Irelia": ["Up On the rise", "Trophy Won Wuhan Open"],
        "Lux Control": ["Up On the rise", "Trophy Won Baltimore SD"],
        "Rengar": ["Trophy Won Los Angeles SD + Ottawa SD"],
        "Azir": ["Trophy Won Speyer SD"],
        "Jayce": ["Up On the rise"],
        "Ezreal Control": ["Up On the rise"],
        "Lucian": ["Up On the rise"],
        "Fiora": ["Up On the rise"],
        "Kha'Zix": ["Up On the rise"],
        "Diana": ["Down On the decline"],
        "Poppy Aurora": ["Down On the decline"],
        "Shen": ["Down On the decline"],
        "Kennen Hook": ["Question Everyone plays miracle"],
        "Kennen Control": ["Question Everyone plays miracle"],
        "Kai'Sa": ["Question No best of available"],
        "Viktor": ["Question No best of available"],
        "Viktor Control": ["Question No best of available"],
        "Miss Fortune Aurora": ["Question No best of available"],
        "Sivir": ["Question No one plays non-aurora"],
        "Darius": ["Question No best of available"],
        "Teemo": ["Question No best of available"],
        "Volibear": ["Question No best of available"],
        "Jinx": ["Question No best of available"],
        "Lee Sin": ["Question No best of available"],
        "Ahri": ["Question No best of available"],
        "Yasuo": ["Question No best of available"],
        "Leona": ["Question No best of available"],
    },
    "UNL": {},
    "SFD2": {},
    "SFD": {},
    "OGN": {}
};
export function GET_ARCHETYPE_ANNOTATIONS(meta: Meta, archetype: Archetype): string[] {
    return ARCHETYPE_ANNOTATIONS[meta][archetype] ?? [];
}
