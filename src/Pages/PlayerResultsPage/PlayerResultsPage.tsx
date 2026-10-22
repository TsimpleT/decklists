import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PlayerResultsPage.module.css';

import { DEV_STRING_PRE, GET_TOURNAMENT_DECKLIST, GET_TOURNAMENT_ABBR, GET_TOURNAMENT_ID, ALL_PLAYERS, GET_PLAYER_RESULTS } from '../../Data';
import { ROUTES } from '../../Routes';

export class PlayerResultsPage extends React.Component {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Player Results`;
    }
    
    public render(): React.ReactNode {
        return (
            <div className={styles.container}>
                {ALL_PLAYERS.map((username) => 
                    <div className={styles.tournamentContainer} key={username}>
                        <div className={styles.tournamentHeader}>{username}</div>
                        <div>
                            {GET_PLAYER_RESULTS(username).map((placing) => {
                                const tournId = GET_TOURNAMENT_ID(GET_TOURNAMENT_ABBR(placing.tournament), placing.date);
                                const decklist = GET_TOURNAMENT_DECKLIST(tournId, username);
                                const content = `[${placing.placing}] ${placing.date} ${placing.tournament}`;
                                return (
                                    <div className={styles.row} key={content}>
                                        <span>{content}</span>
                                        {(decklist !== undefined && decklist.mainDeck.length > 0) &&
                                            <span>
                                                {" ("}
                                                <Link to={ROUTES.tournamentDecklist(tournId, decklist.username)}
                                                    style={{color: "var(--text-default)"}}>
                                                        {decklist.archetype}
                                                </Link>
                                                {")"}
                                            </span>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
