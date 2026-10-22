import React from 'react';
import { Link } from 'react-router-dom';
import styles from './VDecklistTable.module.css';

import { ALL_CCATEGORIES, Archetype, CCATEGORY, Decklist, GET_ARCHETYPE_DECKLISTS, GET_CCATEGORY, GET_META_NAME, LocalStorageManager, Meta, TO_BASE_ID } from '../../Data';
import { ROUTES } from '../../Routes';
import { VDecklistCard } from '../VDecklistCard';

interface IProps {
    archetype: Archetype;
    meta: Meta;
}

interface IState {
    showSettings: boolean;
    view: "stats"|"matchups";
    hideCards: string[];
}

export function GET_COLOR_STYLE(cc: CCATEGORY, count: number, sideCount: number): string {
    return ((cc === CCATEGORY.BATTLEFIELD && count === 1) || cc === CCATEGORY.RUNE || cc === CCATEGORY.LEGEND) ? ""
        : (count === 3) ? styles.gold : (count === 2) ? styles.silver : (count === 1) ? styles.bronze : (count === 0 && sideCount === 0) ? styles.blank : "";
}

const colors: [number, number, number][] = [ [0,0,0], [180,95,6], [100,100,100], [187,154,66] ];
const maxStyleStr: string = `rgb(${colors[colors.length-1][0]},${colors[colors.length-1][1]},${colors[colors.length-1][2]})`;
function getColorScale(cc: CCATEGORY, n: number): React.CSSProperties {
    if(cc === CCATEGORY.RUNE) { return { backgroundColor: "#000" }; }
    // if(cc === CCATEGORY.LEGEND) { return { backgroundColor: (n === 0) ? "#000" : maxStyleStr }; }
    if(n < 0 || n > 1) {
        console.warn(`getColorScale n=${n} not in [0,1]`);
        n = Math.max(0, Math.min(1, n));
    }
    if(n === 1) { return { backgroundColor: maxStyleStr }; }
    const nSections = colors.length-1;
    
    let lowColor = colors[0], highColor = colors[colors.length-1];
    for(let i = 0; i < colors.length-1; i++) {
        if(nSections*n < i+1) {
            lowColor = colors[i];
            highColor = colors[i+1];
            break;
        }
    }
    const adjN = nSections*n - Math.floor(nSections*n);
    const r = lowColor[0] + adjN*(highColor[0]-lowColor[0]), g = lowColor[1] + adjN*(highColor[1]-lowColor[1]), b = lowColor[2] + adjN*(highColor[2]-lowColor[2]);
    return { backgroundColor: `rgb(${r},${g},${b})` };
}

interface CARD_STATS { mdApp: number; avg: number; sbAvg: number; min: number; max: number; }
interface CC_CARD_STATS { avg: number; sbAvg: number; min: number; max: number; /*sbMin: number; sbMax: number;*/}
interface DL_CC_CARD_STATS { total: number; sbTotal: number; }

export class VDecklistTable extends React.Component<IProps, IState> {
    private lsmDecklistIds: string[];
    private decklists: Decklist[]; // tournament decklists
    private cardIds: string[];
    private cardAmounts: {[cardId: string]: number[]};
    private sideboardAmounts: {[cardId: string]: number[]};
    private cardStats: {[cardId: string]: CARD_STATS};
    private ccategoryStats: {[ccategory: string]: CC_CARD_STATS};
    private decklistCCategoryStats: {[ccategory: string]: DL_CC_CARD_STATS}[];

    constructor(props: IProps) {
        super(props);
        this.lsmDecklistIds = LocalStorageManager.getInstance().getArchetypeDecklistIds(props.archetype);
        this.decklists = (this.lsmDecklistIds.map((id) => LocalStorageManager.getInstance().getDecklist(id)).filter((e) => e !== undefined) as Decklist[]).concat(GET_ARCHETYPE_DECKLISTS(props.archetype, props.meta));
        this.cardIds = [];
        this.cardAmounts = {};
        this.sideboardAmounts = {};
        this.cardStats = {};
        this.ccategoryStats = {};
        this.decklistCCategoryStats = [];

        this.recordCardAmounts();
        this.recordStats();
        this.sortCardIds();
        this.state = {
            showSettings: false, view: "stats",
            hideCards: []
            // hideCards: this.cardIds.filter((id) =>
            //     this.cardStats[id].avg + this.cardStats[id].sbAvg <= (["Battlefield","Legend","Rune"].includes(GET_CARD(id).type) ? 0.1/3 : 0.1)
            // )
        };
    }

    private recordCardAmounts(): void {
        for(let decklistNum = 0; decklistNum < this.decklists.length; decklistNum++) {
            const decklist = this.decklists[decklistNum];
            for(let listing of [{id:decklist.chosenChampion, count:1}].concat(decklist.mainDeck).concat(decklist.battlefields).concat(decklist.runeDeck).concat({id: decklist.legend, count: 1})) {
                const cardId = TO_BASE_ID(listing.id);
                if(!this.cardIds.includes(cardId)) {
                    this.cardIds.push(cardId);
                    this.cardAmounts[cardId] = [];
                    for(let i = 0; i < decklistNum; i++) {
                        this.cardAmounts[cardId].push(0);
                    }
                    this.sideboardAmounts[cardId] = [];
                    for(let i = 0; i < decklistNum; i++) {
                        this.sideboardAmounts[cardId].push(0);
                    }
                }
                if(this.cardAmounts[cardId].length === decklistNum) {
                    this.cardAmounts[cardId].push(0);
                }
                this.cardAmounts[cardId][decklistNum] += listing.count;
            }
            for(let listing of decklist.sideboard) {
                const cardId = TO_BASE_ID(listing.id);
                if(!this.cardIds.includes(cardId)) {
                    this.cardIds.push(cardId);
                    this.cardAmounts[cardId] = [];
                    for(let i = 0; i < decklistNum; i++) {
                        this.cardAmounts[cardId].push(0);
                    }
                    this.sideboardAmounts[cardId] = [];
                    for(let i = 0; i < decklistNum; i++) {
                        this.sideboardAmounts[cardId].push(0);
                    }
                }
                if(this.sideboardAmounts[cardId].length === decklistNum) {
                    this.sideboardAmounts[cardId].push(0);
                }
                this.sideboardAmounts[cardId][decklistNum] += listing.count;
            }
            for(let cardId in this.cardAmounts) {
                if(this.cardAmounts[cardId].length <= decklistNum) {
                    this.cardAmounts[cardId].push(0);
                }
                if(this.sideboardAmounts[cardId].length <= decklistNum) {
                    this.sideboardAmounts[cardId].push(0);
                }
            }
        }
    }

    private recordStats(): void {
        for(let cc of ALL_CCATEGORIES) {
            this.ccategoryStats[cc] = { avg: 0, sbAvg: 0, min: -1, max: -1/*, sbMin: -1, sbMax: -1*/ };
        }
        for(let cardId of this.cardIds) {
            const maindeckAmts = this.cardAmounts[cardId];
            this.cardStats[cardId] = {
                mdApp: maindeckAmts.filter((n) => n > 0).length / maindeckAmts.length,
                avg: maindeckAmts.reduce((a,b)=>a+b) / maindeckAmts.length,
                min: Math.min(...maindeckAmts),
                max: Math.max(...maindeckAmts),
                sbAvg: this.sideboardAmounts[cardId].reduce((a, b) => a + b) / this.sideboardAmounts[cardId].length
            }
            const cc = GET_CCATEGORY(cardId);
            this.ccategoryStats[cc].avg += this.cardStats[cardId].avg;
            this.ccategoryStats[cc].sbAvg += this.cardStats[cardId].sbAvg;
        }

        for(let decklistNum = 0; decklistNum < this.decklists.length; decklistNum++) {
            const decklist = this.decklists[decklistNum];
            this.decklistCCategoryStats.push({});
            for(let cc of ALL_CCATEGORIES) {
                this.decklistCCategoryStats[decklistNum][cc] = { total: 0, sbTotal: 0 };
            }
            for(let cardAmount of decklist.mainDeck.concat(decklist.battlefields).concat(decklist.runeDeck).concat({id: decklist.legend, count: 1})) {
                this.decklistCCategoryStats[decklistNum][GET_CCATEGORY(cardAmount.id)].total += cardAmount.count;
            }
            for(let cardAmount of decklist.sideboard) {
                this.decklistCCategoryStats[decklistNum][GET_CCATEGORY(cardAmount.id)].sbTotal += cardAmount.count;
            }
        }
        
        for(let cc of ALL_CCATEGORIES) {
            const statsArr: DL_CC_CARD_STATS[] = this.decklistCCategoryStats.map((ccDict) => ccDict[cc]);
            this.ccategoryStats[cc].min = Math.min(...statsArr.map((stats) => stats.total));
            this.ccategoryStats[cc].max = Math.max(...statsArr.map((stats) => stats.total));
            // this.ccategoryStats[cc].sbMin = Math.min(...statsArr.map((stats) => stats.sbTotal));
            // this.ccategoryStats[cc].sbMax = Math.max(...statsArr.map((stats) => stats.sbTotal));
        }
    }

    private sortCardIds(): void {
        this.cardIds.sort((aId, bId) => {
            const aStats = this.cardStats[aId], bStats = this.cardStats[bId];
            if(aStats.mdApp !== bStats.mdApp) {
                return bStats.mdApp - aStats.mdApp;
            }
            if(aStats.avg !== bStats.avg) {
                return bStats.avg - aStats.avg;
            }
            if(aStats.sbAvg !== bStats.sbAvg) {
                return bStats.sbAvg - aStats.sbAvg;
            }
            return aId.localeCompare(bId);
        });
    }

    public render(): React.ReactNode {
        if(this.decklists.length === 0) {
            return (
                <div className={styles.container}>
                    {`No top tournament decklists found for ${this.props.archetype} in ${GET_META_NAME(this.props.meta)} meta`}
                </div>
            );
        } else if(this.state.view === "stats") {
            return this.renderStats();
        }/* else if(this.state.view === "matchups") {
            return this.renderMatchups();
        }*/
    }

    private showCard = (cardId: string): void => {
        this.setState({ hideCards: this.state.hideCards.filter((id) => id !== cardId) });
    }

    private renderStats(): React.ReactNode {
        return (
            <div className={styles.container}>
                <table className={styles.stickyColumns}>
                    <thead>
                        <tr className={styles.topRow}>
                            <th className={styles.stickyCol1}>
                                <span>Card</span>
                                {/* <img className={styles.settingsButton} src={ImageUtil.getImage("Settings")} height={18} title={"Riftbound"} alt={"Riftbound"} 
                                    onClick={() => this.setState({showSettings: !this.state.showSettings})}/>
                                {(this.state.showSettings) && (
                                    <div className={styles.settingsContainer}>
                                        <div>Hidden Cards due to Low Sample</div>
                                        {(this.state.hideCards.length === 0) ? <div className={styles.settingsSubheader}>none</div>
                                        : ( <>
                                            <div className={styles.settingsSubheader}>click card to reveal</div>
                                            <div className={styles.settingsSubheader} onClick={() => this.setState({hideCards: []})} style={{marginBottom: "2px"}}>show all</div>
                                            {this.state.hideCards.map((id) => (
                                                <div className={styles.settingsCardWrapper} onClick={() => this.showCard(id)}>
                                                    <VDecklistCard id={id} options={{type: "allCards"}} />
                                                </div>
                                            ))}
                                        </>)}
                                    </div>
                                )} */}
                            </th>
                            <th className={styles.stickyCol2} title={"Main Deck % Appearance"}>MD%</th>
                            <th className={styles.stickyCol3}>Avg</th>
                            <th className={styles.stickyCol4}>Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {([...ALL_CCATEGORIES].map((cc) => (<>
                            <tr>
                                <th colSpan={2} className={`${styles.categorySectionHeader} ${styles.stickyCol1}`}>{cc}</th>
                                <th className={`${styles.sectionHeaderRowCell} ${styles.stickyCol3}`}>
                                    <span className={styles.mainDeck}>
                                        { this.ccategoryStats[cc].avg.toFixed(2) }
                                    </span>
                                    {(this.ccategoryStats[cc].sbAvg > 0) &&
                                        <span className={styles.sideboard} title={"sideboard"}>{ this.ccategoryStats[cc].sbAvg.toFixed(2) }</span>
                                    }
                                </th>
                                <th className={`${styles.sectionHeaderRowCell} ${styles.stickyCol4}`}>
                                    <span className={styles.mainDeck}>
                                        { (this.ccategoryStats[cc].min === this.ccategoryStats[cc].max) ? this.ccategoryStats[cc].min : `${this.ccategoryStats[cc].min}-${this.ccategoryStats[cc].max}` }
                                    </span>
                                    {/* {(this.ccategoryStats[cc].sbMin + this.ccategoryStats[cc].sbMax > 0) &&
                                        <span className={styles.sideboard} title={"sideboard"}>
                                            { (this.ccategoryStats[cc].sbMin === this.ccategoryStats[cc].sbMax) ? this.ccategoryStats[cc].sbMin : `${this.ccategoryStats[cc].sbMin}-${this.ccategoryStats[cc].sbMax}` }
                                        </span>
                                    } */}
                                </th>
                            </tr>
                            {this.cardIds.filter((cardId) => (GET_CCATEGORY(cardId) === cc && !this.state.hideCards.includes(cardId))).map((cardId, cardIdx) => {
                                const stats = this.cardStats[cardId];
                                return (
                                    <tr key={cardIdx}>
                                        <VDecklistCard id={cardId} options={{type: "table"}} fixHover={-303} />
                                        <td className={`${styles.statsCell} ${styles.stickyCol2}`} style={getColorScale(cc, stats.mdApp)}>
                                            <span className={styles.mainDeck}>
                                                { stats.mdApp.toLocaleString(undefined,{style:'percent'}) }
                                            </span>
                                        </td>
                                        <td className={`${styles.statsCell} ${styles.stickyCol3}`} style={getColorScale(cc, stats.avg / ((cc === CCATEGORY.BATTLEFIELD || cc === CCATEGORY.LEGEND) ? 1 : 3))}>
                                            <span className={styles.mainDeck}>
                                                { stats.avg.toFixed(2) }
                                            </span>
                                            {(stats.sbAvg > 0) &&
                                                <span className={styles.sideboard} title={"sideboard"}>{ stats.sbAvg.toFixed(2) }</span>
                                            }
                                        </td>
                                        <td className={`${styles.statsCell} ${styles.stickyCol4}`} style={(cc === CCATEGORY.BATTLEFIELD || cc === CCATEGORY.LEGEND) ? { backgroundColor: "black" } : getColorScale(cc, (stats.min+stats.max) / 6)}>
                                            <span className={styles.mainDeck}>
                                                { (stats.min === stats.max) ? stats.min : `${stats.min}-${stats.max}` }
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </>)))}
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr className={styles.topRow}>
                            {this.decklists.map((decklist, deckIdx) => {
                                let md = 0, sb = 0;
                                for(let cardId of this.cardIds) {
                                    md += this.cardAmounts[cardId][deckIdx];
                                    sb += this.sideboardAmounts[cardId][deckIdx];
                                }
                                if(md !== 56 || sb < 0 || sb > 10) {
                                    console.warn(`Decklist "${decklist.username}: ${decklist.tournamentName} ${decklist.date} ${decklist.placing}" has size ${md}+${sb}`);
                                }
                                return (
                                    <th className={styles.headerLinkCell} key={deckIdx} title={((decklist.username === "") ? "" : `${decklist.username}: `) + `${decklist.tournamentName} ${decklist.date} ${decklist.placing}`}>
                                        {(decklist.username !== "You") ?
                                            <Link to={ROUTES.tournamentDecklist(decklist.tournId, decklist.username)} style={{color: "var(--text-default)"}}>
                                                <div className={styles.deckLabelCell}>
                                                    <div>{decklist.tournId.substring(0,decklist.tournId.indexOf("-"))}</div>
                                                    <div className={styles.placingLabel}>{decklist.placing}</div>
                                                </div>
                                            </Link>
                                        :
                                            <Link to={ROUTES.decklist(this.lsmDecklistIds[deckIdx])} style={{color: "var(--text-default)"}}>
                                                <div className={styles.deckLabelCell}>
                                                    {decklist.username}
                                                </div>
                                            </Link>
                                        }
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {([...ALL_CCATEGORIES].map((cc) => (<>
                            <tr>
                                {this.decklists.map((_, deckIdx) => 
                                    <th className={styles.sectionHeaderRowCell}>
                                        <span className={styles.mainDeck}>
                                            { this.decklistCCategoryStats[deckIdx][cc].total }
                                        </span>
                                        {(this.decklistCCategoryStats[deckIdx][cc].sbTotal > 0) &&
                                            <span className={styles.sideboard} title={"sideboard"}>{ this.decklistCCategoryStats[deckIdx][cc].sbTotal }</span>
                                        }
                                    </th>
                                )}
                            </tr>
                            {this.cardIds.filter((cardId) => (GET_CCATEGORY(cardId) === cc && !this.state.hideCards.includes(cardId))).map((cardId, cardIdx) => {
                                return (
                                    <tr key={cardIdx}>
                                        {this.cardAmounts[cardId].map((count, deckIdx) => (
                                            <td className={`${styles.cell} ${GET_COLOR_STYLE(cc, count, this.sideboardAmounts[cardId][deckIdx])}`} key={deckIdx}>
                                                <span className={styles.mainDeck}>{count}</span>
                                                {(this.sideboardAmounts[cardId][deckIdx] > 0) &&
                                                    <span className={styles.sideboard} title={"sideboard"}>
                                                        {this.sideboardAmounts[cardId][deckIdx]}
                                                    </span>
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </>)))}
                    </tbody>
                </table>
            </div>
        );
    }
}
