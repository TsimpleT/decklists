import { Archetype } from "./Archetype";
import { Decklist } from "./Decklist";

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

function GET_DECK_KEY(uuid: string): string { return `deck-${uuid}`; }
function IS_DECK_KEY(key: string): boolean { return key.startsWith("deck-"); }
function DECK_KEY_TO_UUID(key: string): string { return key.substring(5); }

function IS_DECK_NAME_KEY(key: string): boolean { return key.startsWith("dname-"); }
function GET_DECK_NAME_KEY(uuid: string): string { return `dname-${uuid}`; }
function DECK_NAME_KEY_TO_UUID(key: string): string { return key.substring(6); }

export class LocalStorageManager {
    private decklistDict: {[uuid: string]: Decklist};
    private decklistUUIDs: string[];
    private decklistNames: {[uuid: string]: string};
    private archetypeDecklistIds: {[archetype in Archetype]?: string[]};

    constructor() {
        this.decklistDict = {};
        this.decklistUUIDs = [];
        this.decklistNames = {};
        this.archetypeDecklistIds = {};

        for(let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if(key === null) continue;
            if(IS_DECK_KEY(key)) {
                const val = localStorage.getItem(key);
                if(val === null) continue;
                const decklist = Decklist.fromTTSText(val, "You");
                this.writeDecklistHere(DECK_KEY_TO_UUID(key), decklist);
            } else if(IS_DECK_NAME_KEY(key)) {
                const val = localStorage.getItem(key);
                if(val === null) continue;
                this.decklistNames[DECK_NAME_KEY_TO_UUID(key)] = val;
            }
        }
    }

    public getAllDecklists(): Decklist[] {
        return this.decklistUUIDs.map((id) => this.decklistDict[id]);
    }

    public getAllDeckNames(): string[] {
        return this.decklistUUIDs.map((id) => (id in this.decklistNames) ? this.decklistNames[id] : "Unnamed Decklist");
    }

    public getAllDecklistIds(): string[] {
        return [...this.decklistUUIDs];
    }

    public getArchetypeDecklistIds(archetype: Archetype): string[] {
        return [...this.archetypeDecklistIds[archetype] ?? []];
    }

    public getDecklist(uuid: string): Decklist|undefined {
        return (uuid in this.decklistDict) ? this.decklistDict[uuid] : undefined;
    }

    public getDeckName(uuid: string): string {
        return (uuid in this.decklistNames) ? this.decklistNames[uuid] : "Unnamed Decklist";
    }

    public size(): number {
        return this.decklistUUIDs.length;
    }

    public addDecklist(decklist: Decklist): string {
        let uuid;
        do { uuid = crypto.randomUUID(); }
        while(this.decklistUUIDs.includes(uuid));
        this.writeDecklistToStorage(uuid, decklist, decklist.archetype);
        this.writeDecklistHere(uuid, decklist, decklist.archetype);
        return uuid;
    }

    public updateDecklist(uuid: string, decklist: Decklist): void {
        this.writeDecklistToStorage(uuid, decklist);
        this.writeDecklistHere(uuid, decklist);
    }

    public deleteDecklist(uuid: string): void {
        const archetype: Archetype|undefined = this.decklistDict[uuid].archetype;
        localStorage.removeItem(GET_DECK_KEY(uuid));
        localStorage.removeItem(GET_DECK_NAME_KEY(uuid));
        delete this.decklistDict[uuid];
        const decklistIdsIndex = this.decklistUUIDs.indexOf(uuid);
        if(decklistIdsIndex > -1) {
            this.decklistUUIDs.splice(decklistIdsIndex, 1);
        }
        if(archetype !== undefined) {
            const archetypeDecklistIdsIndex = this.archetypeDecklistIds[archetype]?.indexOf(uuid) ?? -1;
            if(archetypeDecklistIdsIndex > -1) {
                this.archetypeDecklistIds[archetype]?.splice(archetypeDecklistIdsIndex, 1);
            }
        }
    }

    private writeDecklistToStorage(uuid: string, decklist: Decklist, name?: string) {
        localStorage.setItem(GET_DECK_KEY(uuid), decklist.exportToTTS());
        if(name) {
            localStorage.setItem(GET_DECK_NAME_KEY(uuid), name);
        }
    }

    private writeDecklistHere(uuid: string, decklist: Decklist, name?: string) {
        const oldArchetype: Archetype|undefined = (uuid in this.decklistDict) ? this.decklistDict[uuid].archetype : undefined;

        this.decklistDict[uuid] = decklist;
        if(!this.decklistUUIDs.includes(uuid)) {
            this.decklistUUIDs.push(uuid);
        }

        if(oldArchetype !== undefined) {
            const archetypeDecklistIdsIndex = this.archetypeDecklistIds[oldArchetype]?.indexOf(uuid) ?? -1;
            if(archetypeDecklistIdsIndex > -1) {
                this.archetypeDecklistIds[oldArchetype]?.splice(archetypeDecklistIdsIndex, 1);
            }
        }

        let thisArchetypeDecklists = this.archetypeDecklistIds[decklist.archetype];
        if(thisArchetypeDecklists === undefined) {
            let newArr: string[] = [];
            this.archetypeDecklistIds[decklist.archetype] = newArr;
            thisArchetypeDecklists = newArr;
        }
        thisArchetypeDecklists.push(uuid);

        if(name) {
            this.decklistNames[uuid] = name;
        }
    }

    public renameDecklist(uuid: string, newName: string): void {
        localStorage.setItem(GET_DECK_NAME_KEY(uuid), newName);
        this.decklistNames[uuid] = newName;
    }

    private static _instance?: LocalStorageManager;
    public static getInstance(): LocalStorageManager {
        if(!LocalStorageManager._instance) {
            LocalStorageManager._instance = new LocalStorageManager();
        }
        return LocalStorageManager._instance;
    }
}
