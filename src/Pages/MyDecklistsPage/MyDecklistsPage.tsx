import React from 'react';
import copy from 'copy-to-clipboard';
import styles from './MyDecklistsPage.module.css';

import { DEV_STRING_PRE, Decklist, LocalStorageManager } from '../../Data';
import { VDecklist } from '../../Views';

const LSM = LocalStorageManager.getInstance();

interface IState {
    decklists: Decklist[];
    ids: string[];
    deckNames: string[];
    showEditOptions: {[key: string]: boolean};
}

export class MyDecklistsPage extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = { decklists: LSM.getAllDecklists(), ids: LSM.getAllDecklistIds(), deckNames: LSM.getAllDeckNames(), showEditOptions: {} };
    }

    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}My Decklists`;
    }

    public add: React.MouseEventHandler<HTMLDivElement> = async (): Promise<void> => {
        const text = await navigator.clipboard.readText();
        const decklist = Decklist.fromText(text, "You");
        if(decklist.legend === "") { window.alert("no legend found"); return; }
        if(decklist.chosenChampion === "") { window.alert("no chosen champion found"); return; }
        if(decklist.mainDeck.reduce((sum, current) => sum + current.count, 0) !== 39) {
            window.alert(`${decklist.mainDeck.reduce((sum, current) => sum + current.count, 0)} cards in main deck (need 39)`);
            return;
        }
        if(decklist.battlefields.reduce((sum, current) => sum + current.count, 0) !== 3) {
            window.alert(`${decklist.battlefields.reduce((sum, current) => sum + current.count, 0)} battlefields (need 3)`);
            return;
        }
        if(decklist.runeDeck.reduce((sum, current) => sum + current.count, 0) !== 12) {
            window.alert(`${decklist.runeDeck.reduce((sum, current) => sum + current.count, 0)} cards in rune deck (need 12)`);
            return;
        }
        const id = LSM.addDecklist(decklist);
        let ids = this.state.ids;
        ids.push(id);
        let decklists = this.state.decklists;
        decklists.push(decklist);
        let deckNames = this.state.deckNames;
        deckNames.push(decklist.archetype);
        this.setState({ ids: ids, decklists: decklists, deckNames: deckNames });
    }

    public devCopy: React.MouseEventHandler<HTMLDivElement> = async (): Promise<void> => {
        const text = await navigator.clipboard.readText();
        const decklist = Decklist.fromText(text);
        if(decklist.legend === "") { window.alert("no legend found"); return; }
        if(decklist.chosenChampion === "") { window.alert("no chosen champion found"); return; }
        if(decklist.mainDeck.reduce((sum, current) => sum + current.count, 0) !== 39) {
            window.alert(`${decklist.mainDeck.reduce((sum, current) => sum + current.count, 0)} cards in main deck (need 39)`);
            return;
        }
        if(decklist.runeDeck.reduce((sum, current) => sum + current.count, 0) !== 12) {
            window.alert(`${decklist.runeDeck.reduce((sum, current) => sum + current.count, 0)} cards in rune deck (need 12)`);
            return;
        }
        copy(JSON.stringify(decklist.toInterface(true))+",");
        window.alert("Decklist copied to clipboard.");
    }

    public replace = async (id: string): Promise<void> => {
        const text = await navigator.clipboard.readText();
        const decklist = Decklist.fromText(text, "You");
        if(decklist.legend === "") { window.alert("no legend found"); return; }
        if(decklist.chosenChampion === "") { window.alert("no chosen champion found"); return; }
        if(decklist.mainDeck.reduce((sum, current) => sum + current.count, 0) !== 39) {
            window.alert(`${decklist.mainDeck.reduce((sum, current) => sum + current.count, 0)} cards in main deck (need 39)`);
            return;
        }
        if(decklist.battlefields.reduce((sum, current) => sum + current.count, 0) !== 3) {
            window.alert(`${decklist.battlefields.reduce((sum, current) => sum + current.count, 0)} battlefields (need 3)`);
            return;
        }
        if(decklist.runeDeck.reduce((sum, current) => sum + current.count, 0) !== 12) {
            window.alert(`${decklist.runeDeck.reduce((sum, current) => sum + current.count, 0)} cards in rune deck (need 12)`);
            return;
        }
        LSM.updateDecklist(id, decklist);
        const decklists = [...this.state.decklists];
        decklists[this.state.ids.indexOf(id)] = decklist;
        this.setState({ decklists: decklists });
    }

    public delete = (id: string): void => {
        LSM.deleteDecklist(id);
        const index = this.state.ids.indexOf(id);
        let decklists = [...this.state.decklists];
        decklists.splice(index, 1);
        let ids = [...this.state.ids];
        ids.splice(index, 1);
        let deckNames = [...this.state.deckNames];
        deckNames.splice(index, 1);
        this.setState({ decklists: decklists, ids: ids, deckNames: deckNames });
    }

    public rename = (id: string): string => {
        const newName: string = (document.getElementById("editDeckNameInput") as any).value;
        LSM.renameDecklist(id, ((newName ?? "").length > 0) ? newName : "New Deck Name");
        const deckNames = [...this.state.deckNames];
        deckNames[this.state.ids.indexOf(id)] = newName;
        this.setState({ deckNames: deckNames });
        return newName;
    }

    public toggleEdit = (id: string): void => {
        const showEditOptions = {...this.state.showEditOptions};
        showEditOptions[id] = !showEditOptions[id];
        this.setState({ showEditOptions: showEditOptions });
    }

    public render(): React.ReactNode {
        return (<>
            <div className={styles.menu}>
                <div className={styles.title}>My Decklists</div>
                <div className={`${styles.restyleButton} ${styles.darkButton}`} onClick={this.add}>Add New Deck From Clipboard</div>
                <div className={`${styles.restyleButton} ${styles.darkButton}`} onClick={this.devCopy}>[DEV] Preprocess Deck</div>
            </div>
            <div className={styles.decklistsContainer}>
                {this.state.ids.map((id, index) => {
                    return (
                        <div key={id}>
                            <VDecklist decklist={this.state.decklists[index]} initialTitle={this.state.deckNames[index]} subtitle={""} editFunctions={{
                                replace: () => this.replace(id), delete: () => this.delete(id), rename: () => this.rename(id)
                            }}/>
                        </div>
                    );
                })}
            </div>
        </>);
    }
}
