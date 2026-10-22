import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TournamentResultsPage.module.css';

import { DEV_STRING_PRE, GET_TOURNAMENT_ID, ARCHETYPE_TO_LEGEND_BASE_ID, ImageUtil, ImageType, TOURNAMENT_RESULTS } from '../../Data';
import { LegendImage } from '../../Views';
import { ROUTES } from '../../Routes';

export class TournamentResultsPage extends React.Component {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Tournament Results`;
    }
    
    public render(): React.ReactNode {
        return (
            <div className={styles.container}>
                {TOURNAMENT_RESULTS./*filter(t => t.meta === "UNL").*/map((tournament) =>
                    <div className={styles.tournamentContainer} key={`${tournament.tournamentName} ${tournament.date}`}>
                        <div className={styles.tournamentHeader}>
                            {`${tournament.tournamentName} ${tournament.date} (T${tournament.tier})`}
                            <span className={styles.tournamentLinksContainer}>
                                {(tournament.links.map((link, i) => {
                                    const s = link.toLowerCase();
                                    const imgType: ImageType = (
                                        (s.includes("locator.riftbound.uvsgames.com")) ? "UVS" :
                                        (s.includes("challonge")) ? "Challonge" :
                                        (s.includes("start")) ? "Start" :
                                        (s.includes("docs.google.com/spreadsheets")) ? "Sheets" :
                                        (s.includes("battlefy")) ? "Battlefy" : ""
                                    );
                                    return (
                                        <a href={link} target="_blank" rel="noreferrer" key={i}>
                                            {(imgType) ? <img src={ImageUtil.getImage(imgType)} height={16} alt={"Link"}/> : "Link"}
                                        </a>
                                    );
                                }
                                ))}
                            </span>
                        </div>
                            {tournament.results.filter((placing) => placing.decklists.length > 0).map((placing, i) => <>
                                <div className={styles.placing}>{placing.placing}</div>
                                <div className={styles.resultsContainer}>
                                    {placing.decklists.map((decklist, j) => {
                                        const content = (
                                            <span className={styles.resultRow} key={`${i} ${j}`}>
                                                <LegendImage id={ARCHETYPE_TO_LEGEND_BASE_ID(decklist.archetype)} size={28} extraStyles={{border: "none"}} />
                                                <span className={styles.rowText} title={decklist.username} style={(decklist.username[0] === "*") ? {fontStyle: "italic"} : {}}>
                                                    {decklist.username}
                                                </span>
                                                {decklist.isIncomplete() && (
                                                    <div className={styles.incompleteContainer}>
                                                        <img src={ImageUtil.getImage("Incomplete")} height={16} alt={"Incomplete"}/>
                                                    </div>
                                                )}
                                            </span>
                                        );
                                        return ((decklist.mainDeck.length > 0)
                                            ? 
                                                <Link to={ROUTES.tournamentDecklist(GET_TOURNAMENT_ID(tournament.abbrName, tournament.date), decklist.username)} style={{color: "var(--text-default)"}} key={`${i} ${j}`}>{content}</Link>
                                            : content
                                        );
                                    }
                                    )}
                                </div>
                            </>)}
                    </div>
                )}
            </div>
        );
    }
}
