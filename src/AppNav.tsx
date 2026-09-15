import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./AppNav.module.css";

import { ALL_METAS, ImageUtil, IS_DEV, VERSION_STRING } from './Data';

// enum Game { NONE, RIFTBOUND }
// interface IState { game: Game }

export class AppNav extends React.Component/*<{}, IState>*/ {
    // constructor(props: {}) {
    //     super(props);
    //     this.state = { game: Game.NONE };
    // }

    // public override componentDidMount(): void {
    //     console.log("mount");
    //     this.setState({game: document.URL.includes("Riftbound") ? Game.RIFTBOUND : Game.NONE });
    // }

    // public override componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
    //     console.log("update");
    //     this.setState({game: document.URL.includes("Riftbound") ? Game.RIFTBOUND : Game.NONE });
    // }

    public render(): React.ReactNode {
        return /*(this.state.game === Game.RIFTBOUND) ? */this.renderRiftbound()/* : <nav />*/;
    }

    public renderRiftbound(): React.ReactNode {
        return (<>
            <nav className={styles.container}>
                <img className={styles.icon} src={ImageUtil.getImage("Riftbound")} height={26} title={"Riftbound"} alt={"Riftbound"} />
                <span className={styles.title} title={VERSION_STRING}>Decklists</span>
                {IS_DEV && <span className={styles.titleNotes}>test build</span>}
                <Link to={`/decklists/riftbound/all-archetypes/${ALL_METAS[ALL_METAS.length-1]}`}>
                    Archetype Stats
                </Link>
                <Link to={"/decklists/riftbound/me"}>
                    My Decklists
                </Link>
                <Link to={"/decklists/riftbound/tournament-results"}>
                    Tournament Results
                </Link>
                {/* <Link to={"/decklists/riftbound/player-results"}>
                    Player Results
                </Link> */}
                <Link to={"/decklists/riftbound/all-cards"}>
                    All Cards
                </Link>
            </nav>
            <div style={{marginBottom: "43px"}}/>
        </>);
    }
}
