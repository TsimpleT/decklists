import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TournamentResultsPage.module.css';

import { DEV_STRING_PRE, GET_TOURNAMENT_ID, ARCHETYPE_TO_LEGEND_BASE_ID, ImageUtil, ImageType, TOURNAMENT_RESULTS, ALL_METAS, GET_META_NAME, Meta } from '../../Data';
import { SquareImage } from '../../Views';
import { ROUTES } from '../../Routes';
import { RouteAwareProps } from '../../withRoute';

export class TournamentResultsPage extends React.Component<RouteAwareProps> {
    private getSelectedMeta(): Meta | undefined {
        const metaParam = this.props.route.params.meta?.toUpperCase();
        return ALL_METAS.find((meta) => meta === metaParam);
    }

    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Tournament Results`;
    }
    
    public render(): React.ReactNode {
        const selectedMeta = this.getSelectedMeta();
        const metas = [...ALL_METAS].reverse();
        return (
            <div className={styles.pageContainer}>
                <nav className={styles.metaFilters} aria-label="Filter tournament results by meta">
                    <div className={styles.headerContainer}>
                        {selectedMeta === undefined
                            ? <span className={`${styles.headerLabel} ${styles.currentMeta} ${styles.allMetaLabel}`} aria-current="page">ALL</span>
                            : <Link className={`${styles.headerLabel} ${styles.headerLabelLink} ${styles.allMetaLabel}`} to={ROUTES.tournamentResults()}>ALL</Link>
                        }
                    </div>
                    <div className={styles.headerContainer}>
                        {metas.map((meta, index) => {
                            const metaPositionClass = index === 0
                                ? styles.firstMeta
                                : index === metas.length - 1
                                    ? `${styles.leftBorder} ${styles.lastMeta}`
                                    : styles.leftBorder;
                            const labelClasses = `${metaPositionClass} ${styles.headerLabel}`;
                            return meta === selectedMeta
                                ? <span className={`${labelClasses} ${styles.currentMeta}`} aria-current="page" key={meta} title={`${GET_META_NAME(meta)} Meta`}>{meta}</span>
                                : <Link className={`${labelClasses} ${styles.headerLabelLink}`} key={meta} to={ROUTES.tournamentResults(meta)} title={`${GET_META_NAME(meta)} Meta`}>{meta}</Link>;
                        })}
                    </div>
                </nav>
                <div className={styles.container}>
                {TOURNAMENT_RESULTS.filter((tournament) => selectedMeta === undefined || tournament.meta === selectedMeta).map((tournament) =>
                    <div className={styles.tournamentContainer} key={`${tournament.tournamentName} ${tournament.date}`}>
                        <div className={styles.tournamentHeader}>
                            {`${tournament.tournamentName} ${tournament.date}`}
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
                                                <SquareImage id={ARCHETYPE_TO_LEGEND_BASE_ID(decklist.archetype)} size={28} extraStyles={{border: "none"}} loading="lazy" />
                                                <span className={styles.rowText} title={decklist.username} style={(decklist.username[0] === "*") ? {fontStyle: "italic"} : {}}>
                                                    {decklist.username}
                                                </span>
                                                {decklist.isIncomplete() && (
                                                    <div className={styles.incompleteContainer}>
                                                        <img src={ImageUtil.getImage("Incomplete")} height={16} alt={"Incomplete"} title={"Incomplete"} />
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
            </div>
        );
    }
}
