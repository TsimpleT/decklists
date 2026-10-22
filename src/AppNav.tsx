import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./AppNav.module.css";

import { ALL_METAS, ImageUtil, IS_DEV, VERSION_STRING } from './Data';
import { ROUTES } from './Routes';
import { RouteAwareProps } from './withRoute';

export class AppNav extends React.Component<RouteAwareProps> {
    public render(): React.ReactNode {
        const { pathname } = this.props.route.location;
        const archetypeStatsActive = pathname === "/riftbound"
            || pathname === "/"
            || pathname.startsWith("/riftbound/all-archetypes/")
            || pathname.startsWith("/riftbound/archetype/");
        const myDecklistsActive = pathname.startsWith("/riftbound/me");
        const tournamentResultsActive = pathname === "/riftbound/tournament-results"
            || pathname.startsWith("/riftbound/tournament/");
        const allCardsActive = pathname === "/riftbound/all-cards";

        return (<>
            <nav className={styles.container}>
                <img className={styles.icon} src={ImageUtil.getImage("CATL")} height={26} title={"Riftbound"} alt={"Riftbound"} />
                <span className={styles.title} title={VERSION_STRING}>Decklists</span>
                {IS_DEV && <span className={styles.titleNotes}>test build</span>}
                {archetypeStatsActive
                    ? <span className={`${styles.navItem} ${styles.active}`} aria-current="page" aria-disabled="true">Archetype Stats</span>
                    : <Link className={styles.navItem} to={ROUTES.archetypes(ALL_METAS[ALL_METAS.length-1])}>Archetype Stats</Link>}
                {myDecklistsActive
                    ? <span className={`${styles.navItem} ${styles.active}`} aria-current="page" aria-disabled="true">My Decklists</span>
                    : <Link className={styles.navItem} to={ROUTES.myDecklists()}>My Decklists</Link>}
                {tournamentResultsActive
                    ? <span className={`${styles.navItem} ${styles.active}`} aria-current="page" aria-disabled="true">Tournament Results</span>
                    : <Link className={styles.navItem} to={ROUTES.tournamentResults()}>Tournament Results</Link>}
                {allCardsActive
                    ? <span className={`${styles.navItem} ${styles.active}`} aria-current="page" aria-disabled="true">All Cards</span>
                    : <Link className={styles.navItem} to={ROUTES.allCards()}>All Cards</Link>}
            </nav>
            <div style={{marginBottom: "43px"}}/>
        </>);
    }
}
