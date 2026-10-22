import { ALL_CARD_IDS, GET_CARD_ART, SET_LIST, TO_TTS_ID } from './CardData';

test('ALL_CARD_IDS in order', () => {
    const setNumMap: {[key: string]: number} = {};
    for(let i = 0; i < SET_LIST.length; i++) {
        setNumMap[SET_LIST[i]] = i;
    }
    expect(ALL_CARD_IDS).toEqual([...ALL_CARD_IDS].sort((a, b) => {
        const aSetNum = setNumMap[a.substring(0,3)], bSetNum = setNumMap[b.substring(0,3)];
        return (aSetNum === bSetNum) ? a.localeCompare(b) : aSetNum-bSetNum;
    }));
});

test('every card has a unique TTS ID', () => {
    const cardIdsByTtsId = new Map<string, string[]>();
    for(const cardId of ALL_CARD_IDS) {
        const ttsId = TO_TTS_ID(cardId);
        const cardIds = cardIdsByTtsId.get(ttsId) ?? [];
        cardIds.push(cardId);
        cardIdsByTtsId.set(ttsId, cardIds);
    }

    const duplicates = Array.from(cardIdsByTtsId).filter(([, cardIds]) => cardIds.length > 1 && !cardIds.some((id) => id.includes("R")));
    expect(duplicates).toEqual([]);
});

test.each([
    ["OGN-001*", "OGN-001s"],
    ["OGN-263a", "OGN-263-a"],
    ["SFD-001a", "SFD-001A"],
    ["SFD-R01a", "SFD-R01a"],
    ["SFD-001*", "SFD-001-STAR"],
    ["SFD-025a", "SFD-025-P"],
    ["UNL-001a", "UNL-001A"],
    ["UNL-001*", "UNL-001-STAR"],
    ["UNL-082b", "UNL-082b-P"],
    ["SGN-001", "SGN-001/003-P"],
    ["T1-001", "T1-001-P"],
    ["T1-001*", "T1-001-P"],
    ["VEN-001a", "VEN-001A"],
    ["VEN-001*", "VEN-001-STAR"],
    ["VEN-R01b", "VEN-R01B-P"],
    ["VEN-R99b", "VEN-R99b-P"],
    ["VEN-T06", "VEN-T01t.2"],
    ["RAD-001a", "RAD-001A"],
    ["RAD-001*", "RAD-001-STAR"],
    ["RAD-R99b", "RAD-R99b-P"],
    ["OTHER-001", "OTHER-001"],
])('GET_CARD_ART converts %s to the matching image ID', (id, expectedImageId) => {
    expect(GET_CARD_ART(id)).toBe(`https://static.dotgg.gg/riftbound/cards/${expectedImageId}.webp`);
});
