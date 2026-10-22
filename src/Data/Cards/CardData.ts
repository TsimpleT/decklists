import BaseCardListOGN from "./BaseCardListOGN260717.json";
import BaseCardListOGS from "./BaseCardListOGS260717.json";
import BaseCardListSFD from "./BaseCardListSFD260717.json";
import BaseCardListUNL from "./BaseCardListUNL260717.json";
import BaseCardListVEN from "./BaseCardListVEN260717.json";
import BaseCardListRAD from "./BaseCardListRAD261013.json";
import CardCategories from "./CardCategories.json";
import IdMappings from "./IdMappings.json";

export type Domain = "Fury"|"Calm"|"Mind"|"Body"|"Chaos"|"Order";
type CardSupertype = "Signature"|"Champion"|"Token";

export const ALL_CARD_TYPES = [ "Battlefield", "Gear", "Legend", "Rune", "Spell", "Unit"] as const;
export type CardType = typeof ALL_CARD_TYPES[number];

type Rarity = "Common"|"Uncommon"|"Rare"|"Epic"|"Showcase"|"Ultimate";

//'Base ID', 'Name', 'Pre-Type', 'Type', 'Domains', 'Rarity', 'Energy Cost', 'Power Cost', 'Might', 'Rules Text', 'Champion Tag', 'Other Tags', 'Other'
export interface CardDTO {
    baseId:	string;
    name: string;
    supertype?: CardSupertype;
    type: CardType[];
    domains: Domain[];
    rarity: Rarity;
    energy?: number;
    power?: number;
    might?: number;
    rulesText: string;
    championTag?: string;
    otherTags: string[];
    other?: object;
}

export enum CCATEGORY { // CARD_CATEGORY
    LEGEND = "LEGEND", BATTLEFIELD = "BATTLEFIELD", RUNE = "RUNES", SIDE = "OTHER/SIDEBOARD",
    EARLY = "TURN 1 PLAYS", EARLY2ND = "TURN 1 PLAYS GOING 2ND", INTERACTION = "SMALL REMOVAL/INTERACTION",
    CORE = "CORE/VALUE", BIG_INTERACTION = "BIG REMOVAL/INTERACTION", LATE = "LATEGAME/CLOSERS"
}

// keep order matching CATEGORY_ORDERING
export const ALL_CCATEGORIES: CCATEGORY[] = [
    CCATEGORY.LEGEND, CCATEGORY.EARLY, CCATEGORY.EARLY2ND, CCATEGORY.INTERACTION, CCATEGORY.CORE,
    CCATEGORY.BIG_INTERACTION, CCATEGORY.LATE, CCATEGORY.SIDE, CCATEGORY.BATTLEFIELD, CCATEGORY.RUNE
];

// keep order matching ALL_CATEGORIES
export const CCATEGORY_ORDERING: {[key in CCATEGORY]: number} = {
    [CCATEGORY.LEGEND]: 0,
    [CCATEGORY.EARLY]: 1,
    [CCATEGORY.EARLY2ND]: 2,
    [CCATEGORY.INTERACTION]: 3,
    [CCATEGORY.CORE]: 4,
    [CCATEGORY.BIG_INTERACTION]: 5,
    [CCATEGORY.LATE]: 6,
    [CCATEGORY.SIDE]: 7,
    [CCATEGORY.BATTLEFIELD]: 9,
    [CCATEGORY.RUNE]: 10,
};

let cardData: {[cardId: string]: CardDTO} = {
    ...BaseCardListOGN.cards, ...BaseCardListOGS.cards, ...BaseCardListSFD.cards, ...BaseCardListUNL.cards, ...BaseCardListVEN.cards, ...BaseCardListRAD.cards
} as any;
let cardNameToBaseId: {[name: string]: string} = {};
for(let card in cardData) {
    if(!(cardData[card].name in cardNameToBaseId)) {
        cardNameToBaseId[cardData[card].name] = cardData[card].baseId;
    }
}
export function GET_BASE_ID_FROM_CARD_NAME(name: string) {
    if(!(name in cardNameToBaseId)) {
        console.warn(`Card "${name}" not found in cardNameToBaseId.`);
        return "";
    }
    return cardNameToBaseId[name];
}

let cardCategories: {[cardId: string]: CCATEGORY} = CardCategories.cardCategories as any;

const fullIdMappings: {[id: string]: {baseId: string, ttsId: string, rarity: Rarity}} = IdMappings.mappings as any; // TODO add all attributes
let ttsIdMappings: {[id: string]: string} = {};
let fromTtsIdMappings: {[ttsId: string]: string} = {};
for(let id in fullIdMappings) {
    const mapping = fullIdMappings[id];
    cardData[id] = {...cardData[mapping.baseId]};
    cardData[id].rarity = mapping.rarity;
    if(!(id in ttsIdMappings)) {
        ttsIdMappings[id] = mapping.ttsId;
    }
    if(!(mapping.ttsId in fromTtsIdMappings) && id[4] !== "R") {
        fromTtsIdMappings[mapping.ttsId] = id;
    }
}

var sortableArray = Object.entries(cardData);
var sortedArray = sortableArray.sort(([a,], [b,]) => a.localeCompare(b));
cardData = Object.fromEntries(sortedArray);

let setSet: Set<string> = new Set();
for(let card in cardData) {
    setSet.add(card.substring(0,3));
}

export const SET_LIST = Array.from(setSet.values());
const SET_NAMES: {[key: string]: string} = { "OGN": "Origins", "SFD": "Spiritforged", "OGS": "Proving Grounds", "ARC": "Arcane Box Set" };
export function GET_SET_NAME(set: string): string {
    return (set in SET_NAMES) ? SET_NAMES[set] : "Unknown";
}

export function IS_CARD_ID(id: string): boolean {
    return id in cardData;
}

export function GET_CARD(id: string): CardDTO {
    if(!(id in cardData)) {
        console.warn(`Card "${id}" not found in cardData.`);
        return { baseId: id, name: id, type: ["Legend"], domains: [], rarity: "Common", rulesText: "", otherTags: [] };
        // cardData[id] = { baseId: id, name: id, type: TYPE.LEGEND, domains: [], rarity: "Common", rulesText: "", otherTags: [] };
    }
    return cardData[id];
}

export const ALL_CARD_IDS: string[] = Object.keys(cardData);

export function GET_CCATEGORY(id: string): CCATEGORY {
    return (TO_BASE_ID(id) in cardCategories) ? cardCategories[TO_BASE_ID(id)] : CCATEGORY.LEGEND;
}

export function TO_BASE_ID(id: string): string {
    return GET_CARD(id).baseId;
}

export function TO_TTS_ID(id: string): string {
    if(!(id in ttsIdMappings)) {
        ttsIdMappings[id] = (id.length === 7) ? `${id}-1` : id;
    }
    return ttsIdMappings[id];
}

export function TTS_ID_TO_ID(ttsId: string): string {
    if(!(ttsId in fromTtsIdMappings)) {
        fromTtsIdMappings[ttsId] = (ttsId.length >= 7 && ttsId[3] === '-') ? ttsId.substring(0,7) : ttsId;
    }
    return fromTtsIdMappings[ttsId];
}

const MISSING_CARD_ART: {[id: string]: string} = {
    "OGN-076b": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSsaju0uxjlaIZMMAGmT9-dj_PLzyz9DKksDoF6TQnjh7h0xANvIMzAAZY&s=10",
    "OGN-303a": "https://pbs.twimg.com/media/HROWKfZa0AACC9d?format=webp", // TODO: fix to signature-less image
    "OGN-303a*": "https://pbs.twimg.com/media/HROWKfZa0AACC9d?format=webp",
    "VEN-139a": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5FsyLmw_QyAO6HnbUnmhnzCIZqQxHGTj0QBzrmkzyWVah72PbrYtO7tmr",
    "VEN-155a": "https://preview.redd.it/the-china-exclusive-kennen-promo-for-their-riftbound-1st-v0-sc8tqgt901ph1.jpeg?auto=webp&s=52c98e0bd727d11fb8cd94c044b8c68f398c65ac",
    "RAD-021b": "https://preview.redd.it/nation-clash-exclusive-ekko-champion-promo-v0-lhfqa6ht5jwh1.png?auto=webp&s=aa11c9438d55043f56e1059c9865fef7ee2c710b",
    "RAD-086b": "https://64.media.tumblr.com/bd7d559f55e2b90652c7eb0fe294edaa/9982843c022b2cf7-e0/s640x960/dc8dc43a2848f94c70a1ef39ecbaaeebc5dd7b49.pnj",
    "RAD-174a": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9NIzHcMxKsjN7i9A-z_VcNU-HQbX4ruomeRKjyC7MAg&s", // TODO: fix to signature-less image
    "RAD-174a*": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9NIzHcMxKsjN7i9A-z_VcNU-HQbX4ruomeRKjyC7MAg&s",
};

const CARD_ART_ID_OVERRIDES: {[id: string]: string} = {
    "OGN-263a": "OGN-263-a",
    "SFD-025a": "SFD-025-P",
    "SFD-118a": "SFD-118a-P",
    "SFD-178a": "SFD-178a-P",
    "SFD-195a": "SFD-195a-P",
    "UNL-082b": "UNL-082b-P",
    "UNL-178b": "UNL-178b-P",
    "SGN-001": "SGN-001/003-P",
    "SGN-002": "SGN-002/003-P",
    "SGN-003": "SGN-003/003-P",
    "VEN-041a": "VEN-041a-P",
    "VEN-069b": "VEN-069B-P",
    "VEN-R01b": "VEN-R01B-P",
    "VEN-R04b": "VEN-R04B-P",
    "VEN-T06": "VEN-T01t.2",
    "RAD-110a": "RAD-110A-P",
};

function fixCardArtId(id: string): string {
    if(Object.prototype.hasOwnProperty.call(CARD_ART_ID_OVERRIDES, id)) {
        return CARD_ART_ID_OVERRIDES[id];
    }
    if(id.startsWith("OGN")) {
        return id.endsWith("*") ? `${id.substring(0, id.length-1)}s` : id;
    }
    if(id.startsWith("SFD")) {
        if(id.endsWith("a") && !id.includes("R")) {
            return `${id.substring(0, id.length-1)}A`;
        }
        return id.endsWith("*") ? `${id.substring(0, id.length-1)}-STAR` : id;
    }
    if(id.startsWith("UNL")) {
        if(id.endsWith("a") && !id.includes("R")) {
            return `${id.substring(0, id.length-1)}A`;
        }
        return id.endsWith("*") ? `${id.substring(0, id.length-1)}-STAR` : id;
    }
    if(id.startsWith("T1")) {
        const cardId = id.endsWith("*") ? id.substring(0, id.length-1) : id;
        return `${cardId}-P`;
    }
    if(id.startsWith("VEN")) {
        if(id.endsWith("a") && !id.includes("R")) {
            return `${id.substring(0, id.length-1)}A`;
        }
        if(id.endsWith("*")) {
            return `${id.substring(0, id.length-1)}-STAR`;
        }
        return (id.endsWith("b") && id.includes("R")) ? `${id.substring(0, id.length-1)}b-P` : id;
    }
    if(id.startsWith("RAD")) {
        if(id.endsWith("a")) {
            return `${id.substring(0, id.length-1)}A`;
        }
        if(id.endsWith("*")) {
            return `${id.substring(0, id.length-1)}-STAR`;
        }
        return (id.endsWith("b") && id.includes("R")) ? `${id.substring(0, id.length-1)}b-P` : id;
    }
    return id;
}

export function GET_CARD_ART(id: string): string {
    if(id in MISSING_CARD_ART) {
        return MISSING_CARD_ART[id];
    }

    const fixedId = fixCardArtId(id);
    return `https://static.dotgg.gg/riftbound/cards/${fixedId}.webp`;

    // const cleanId = (id.startsWith("OGN") || id.startsWith("SFD")) ? id.replaceAll("*","s") : id;
    // return `https://cdn.piltoverarchive.com/cards/${cleanId}.webp`;

    // return `https://cdn.rgpub.io/public/live/map/riftbound/latest/OGN/cards/OGN-001/full-desktop-2x.jpg` // high quality
}
