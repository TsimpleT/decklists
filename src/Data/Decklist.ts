import { Archetype, PREDICT_ARCHETYPE } from "./Archetype";
import { CardDTO, CardType, GET_BASE_ID_FROM_CARD_NAME, GET_CARD, IS_CARD_ID, TO_BASE_ID, TO_TTS_ID, TTS_ID_TO_ID } from "./Cards";

export interface DecklistCardAmount { id: string; count: number; }

export interface IDecklist {
    date?: string;
    username?: string;
    archetype?: Archetype;
    legend?: string;
    chosenChampion?: string;
    mainDeck?: DecklistCardAmount[];
    battlefields?: DecklistCardAmount[];
    runeDeck?: DecklistCardAmount[];
    sideboard?: DecklistCardAmount[];
}

interface IDecklistContainsOptions {
    exactCount?: number;
    minCount?: number;
    maxCount?: number;
    includeSideboard?: boolean;
}

interface IDecklistNumOptions {
    includeSideboard?: boolean;
}

const typeOrder: {[t in CardType]: number} = {"Battlefield": 0, "Gear": 3, "Legend": 0, "Rune": 0, "Spell": 2, "Unit": 1}
function cardSortComparator(aDCA: DecklistCardAmount, bDCA: DecklistCardAmount): number {
    const a = GET_CARD(aDCA.id), b = GET_CARD(bDCA.id);
    const aType = (a.type.length > 0) ? a.type[0] : "Legend", bType = (b.type.length > 0) ? b.type[0] : "Legend";
    const aEnergy = a.energy??0, bEnergy = b.energy??0
    const aPower = a.power??0, bPower = b.power??0;
    return (aType !== bType) ? typeOrder[aType] - typeOrder[bType]
        : (aEnergy !== bEnergy) ? aEnergy - bEnergy
        : (aPower !== bPower) ? aPower - bPower
        : a.name.localeCompare(b.name);
}

export class Decklist {
    readonly date: string;
    readonly username: string;
    readonly archetype: Archetype;
    readonly legend: string;
    readonly chosenChampion: string;
    readonly mainDeck: DecklistCardAmount[];
    readonly battlefields: DecklistCardAmount[];
    readonly runeDeck: DecklistCardAmount[];
    readonly sideboard: DecklistCardAmount[];
    readonly tournamentName: string;
    readonly tournId: string;
    readonly placing: string;

    private static unknownPlayerCount = 1;

    public constructor(idl: IDecklist, tournamentName: string = "", tournId: string = "", placing: string = "") {
        this.date = idl.date??"";
        this.username = (idl.username) ? idl.username : `*Unknown${Decklist.unknownPlayerCount++}*`;
        this.legend = idl.legend ?? "";
        this.chosenChampion = idl.chosenChampion ?? "";
        this.mainDeck = idl.mainDeck ?? [];
        this.battlefields = idl.battlefields ?? [];
        this.runeDeck = idl.runeDeck ?? [];
        this.sideboard = idl.sideboard ?? [];
        this.tournamentName = tournamentName;
        this.tournId = tournId;
        this.placing = placing;
        this.archetype = (idl.archetype !== undefined && idl.archetype !== "Unknown") ? idl.archetype : PREDICT_ARCHETYPE(this);

        this.mainDeck.sort(cardSortComparator);
        this.sideboard.sort(cardSortComparator);
    }

    // exclude sideboard by default
    public contains(baseId: string, options?: IDecklistContainsOptions): boolean {
        for(let listing of this.combinedDCAs(options?.includeSideboard ?? false)) {
            if(TO_BASE_ID(listing.id) === baseId) {
                return (options?.exactCount === undefined || listing.count === options.exactCount)
                    && (options?.minCount === undefined || listing.count >= options.minCount)
                    && (options?.maxCount === undefined || listing.count <= options.maxCount);
            }
        }
        return false;
    }

    public numOfCardType(c: CardType, options?: IDecklistNumOptions): number {
        return this.numMatchingQuery((card: CardDTO) => card.type.includes(c), options);
    }

    public numOfCardTypeSideboard(c: CardType): number {
        let n = 0;
        for(let listing of this.sideboard) {
            if(GET_CARD(listing.id).type.includes(c)) {
                n += listing.count;
            }
        }
        return n;
    }

    public numMatchingQuery(query: (card: CardDTO) => boolean, options?: IDecklistNumOptions): number {
        let n = 0;
        for(let listing of this.combinedDCAs(options?.includeSideboard ?? false)) {
            if(query(GET_CARD(listing.id))) {
                n += listing.count;
            }
        }
        return n;
    }

    private combinedDCAs(includeSideboard: boolean = true): DecklistCardAmount[] {
        return [{id: this.legend, count: 1}].concat([{id: this.chosenChampion, count: 1}]).concat(this.mainDeck).concat(this.battlefields).concat(this.runeDeck).concat((includeSideboard) ? this.sideboard : []);
    }

    public exportStandard(mode:"TEXT"|"IDS"): string {
        const dcaParser = (
            (mode === "IDS") ?
                (dca: DecklistCardAmount) => `${dca.count} ${dca.id.replaceAll("*","s")}`:
            // (mode === "TEXT") ?
                (dca: DecklistCardAmount) => `${dca.count} ${GET_CARD(dca.id).name}`
        );
        return ([
            [[{id: this.legend, count: 1}], "Legend"],
            [[{id: this.chosenChampion, count: 1}], "Champion"],
            [(this.mainDeck.length === 0)
                ? []
                : ((this.mainDeck[0].count > 1)
                    ? [{id: this.mainDeck[0].id, count: this.mainDeck[0].count-1}]
                    : []
                ).concat(this.mainDeck.slice(1)), "MainDeck"],
            [this.battlefields, "Battlefields"],
            [this.runeDeck, "Runes"],
            [this.sideboard, "Sideboard"]
        ] as [DecklistCardAmount[], string][]).map((dcaArr: [DecklistCardAmount[], string]) => {
            return dcaArr[1] + ":\n" + dcaArr[0].map(dcaParser).join("\n");
        }).join("\n\n");
    }

    public exportToTTS(): string {
        return this.combinedDCAs().map((cardAmount: DecklistCardAmount) => {
            let arr = [];
            for(let i = 0; i < cardAmount.count; i++) {
                arr.push(TO_TTS_ID(cardAmount.id));
            }
            return arr.join(" ");
        }).join(" ");
    }

    public static fromText(text: string, username?: string): Decklist {
        const lineList: string[] = text.split(/\r?\n|\r|\n/g);

        if(lineList.length === 1) {
            return Decklist.fromTTSText(text, username);
        }

        let decklist: IDecklist = { legend: "", chosenChampion: "", mainDeck: [], battlefields: [], runeDeck: [], sideboard: [] };
        if(username) {
            decklist.username = username;
        }

        let mode: "LG"|"CC"|"MD"|"BF"|"RU"|"SB"|"" = "";

        for(let line of lineList) {
            line = line.trim();
            if(line.length === 0) {
                continue;
            }
            const num = parseInt(line, 10);
            if(Number.isNaN(num)) {
                const lineLower = line.toLowerCase();
                if(lineLower.includes("legend")) { mode = "LG"; }
                else if(lineLower.includes("champion")) { mode = "CC"; }
                else if(lineLower.includes("main")) { mode = "MD"; }
                else if(lineLower.includes("battlefield")) { mode = "BF"; }
                else if(lineLower.includes("rune")) { mode = "RU"; }
                else if(lineLower.includes("side")) { mode = "SB"; }
                else if(mode === "LG" || mode === "CC") {
                    if(!IS_CARD_ID(line)) {
                        line = GET_BASE_ID_FROM_CARD_NAME(line);
                    }
                    if(line.length > 0) {
                        if(mode === "LG") {
                            decklist.legend = line;
                        }
                        if(mode === "CC") {
                            decklist.chosenChampion = line;
                        }
                    } else {
                        console.log(`cant process legend without number ${line}`);
                    }  
                }
                else { console.log(`cant process line ${line}`); }
                continue;
            }

            let id: string = line.substring(line.indexOf(" ")+1); // may be name and not be id, checking below
            // const isId: boolean = (id.length === 7 || id.length === 8) && id[3] === "-" && SET_LIST.includes(id.substring(0,3))
            //     && (!Number.isNaN(id.substring(4)) || (["R","T"].includes(id[4]) && !Number.isNaN(id.substring(5))));
            if(!IS_CARD_ID(id)) {
                id = GET_BASE_ID_FROM_CARD_NAME(id);
            }
            if(id !== "") {
                if(mode === "") {
                    console.log(`line "${line}" without mode`);
                } else if(mode === "LG") {
                    decklist.legend = id;
                } else if(mode === "CC") {
                    decklist.chosenChampion = id;
                } else if(mode === "MD") {
                    decklist.mainDeck?.push({id: id, count: num});
                } else if(mode === "BF") {
                    decklist.battlefields?.push({id: id, count: num});
                } else if(mode === "RU") {
                    decklist.runeDeck?.push({id: id, count: num});
                } else if(mode === "SB") {
                    decklist.sideboard?.push({id: id, count: num});
                }
            }
        }

        return new Decklist(decklist);
    }

    // in order: 1x legend, 1x chosen champion, 39x remaining main deck, 3x battlefield, 12x rune, rest sideboard
    public static fromTTSText(text: string, username?: string): Decklist {
        const cardIdList: string[] = text.split(" ").map(ttsId => TTS_ID_TO_ID(ttsId));

        let decklist: IDecklist = {
            legend: (cardIdList.length > 0) ? cardIdList[0] : "",
            chosenChampion: (cardIdList.length > 1) ? cardIdList[1] : "",
            mainDeck: [], battlefields: [], runeDeck: [], sideboard: []
        };
        decklist.mainDeck = [];
        if(username) {
            decklist.username = username;
        }

        let mainDeckDone = false;
        for(let startI = 2; startI < cardIdList.length; startI++) { // skip first and second cards: legend and cc are already handled
            if(!IS_CARD_ID(cardIdList[startI])) { continue; }
            let count = 1;
            while(startI+count < cardIdList.length && cardIdList[startI+count] === cardIdList[startI]) {
                count++;
            }
            const dca: DecklistCardAmount = {id: cardIdList[startI], count: count};
            const cardTypeList = GET_CARD(cardIdList[startI]).type;
            const numCardTypes = cardTypeList.length;
            const cardType: CardType = (numCardTypes > 0) ? cardTypeList[0] : "Legend";
            if(!mainDeckDone && (cardType === "Battlefield" || cardType === "Rune")) {
                mainDeckDone = true;
            }
            if(cardType === "Battlefield") {
                decklist.battlefields?.push(dca);
            } else if(cardType === "Rune") {
                decklist.runeDeck?.push(dca);
            } else {
                (mainDeckDone ? decklist.sideboard : decklist.mainDeck)?.push(dca);
            }
            startI += count-1;
        }

        // fix PA TTS export bug where 2nd card isnt chosen champ, but rather some other champion (likely with most copies)
        const legendId: string = (cardIdList.length < 1) ? "" : cardIdList[0];
        const chosenChampId: string = (cardIdList.length < 2) ? "" : cardIdList[1];
        if(legendId && chosenChampId && legendId !== chosenChampId) {
            const legendChampTag: string|undefined = GET_CARD(legendId).championTag;
            console.log(legendChampTag);
            const chosenChampTag: string|undefined = GET_CARD(chosenChampId).championTag;
            if(legendChampTag !== undefined && chosenChampTag !== undefined && legendChampTag !== chosenChampTag) {
                let movedIncorrectCCToMain = false;
                let foundCorrectCC = false;
                let ccIdxToSplice = -1;
                for(let i = 0; i < decklist.mainDeck?.length; i++) {
                    const dca = decklist.mainDeck[i];
                    console.log(`${i} ${dca.id} ${GET_CARD(dca.id).name} ${GET_CARD(dca.id).championTag}`);
                    if(dca.id === chosenChampId && !movedIncorrectCCToMain) {
                        dca.count = dca.count+1;
                        console.log(`added incorrect cc`);
                        movedIncorrectCCToMain = true;
                    } else if(GET_CARD(dca.id).championTag === legendChampTag && !foundCorrectCC) {
                        decklist.chosenChampion = dca.id;
                        console.log(`found ${dca.id} at ${i}`);
                        if(dca.count > 1) {
                            dca.count = dca.count-1;
                        } else {
                            ccIdxToSplice = i;
                        }
                        foundCorrectCC = true;
                    }
                }
                if(ccIdxToSplice !== -1) {
                    decklist.mainDeck.splice(ccIdxToSplice, 1);
                }
                if(!movedIncorrectCCToMain) {
                    decklist.mainDeck.push({id: chosenChampId, count: 1});
                }
            }
        }

        return new Decklist(decklist);
    }

    public toInterface(forceUsername: boolean = false): IDecklist {
        let obj: IDecklist = {};
        if(this.date) { obj.date = this.date; }
        if(forceUsername || (this.username && !this.username.startsWith("*Unknown"))) { obj.username = this.username; }
        if(this.archetype) { obj.archetype = this.archetype; }
        if(this.legend) { obj.legend = this.legend; }
        if(this.chosenChampion) { obj.chosenChampion = this.chosenChampion; }
        if(this.mainDeck) { obj.mainDeck = this.mainDeck; }
        if(this.battlefields) { obj.battlefields = this.battlefields; }
        if(this.runeDeck) { obj.runeDeck = this.runeDeck; }
        if(this.sideboard) { obj.sideboard = this.sideboard; }

        return obj;
    }

    public isIncomplete(): boolean {
        return this.legend === "" || this.mainDeck.length === 0 || this.battlefields.length === 0 || this.runeDeck.length === 0 || this.sideboard.length === 0;
    }
}
