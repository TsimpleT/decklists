import React from 'react';
import styles from './CardListPage.module.css';

import { ALL_CARD_IDS, DEV_STRING_PRE, GET_CARD } from '../../Data';
import { SquareImage, VDecklistCard } from '../../Views';

export class CardListPage extends React.Component {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}All Cards`;
    }
    
    public render(): React.ReactNode {
        return (<>
            <div className={styles.container1}>
                {ALL_CARD_IDS.filter(
                    (id) => (GET_CARD(id).type.length > 0 && ["Battlefield"].includes(GET_CARD(id).type[0])) || GET_CARD(id).supertype === "Champion"
                ).map((id) => 
                    <SquareImage id={id} size={40} extraStyles={{border: "none", margin: "2px"}} loading={"lazy"} enableHover={true}
                        // subscript={id.substring(4)} subscriptFontSize={7}
                    />
                )}
            </div>
            <div className={styles.container}>
                {ALL_CARD_IDS.map((id) => 
                    <VDecklistCard id={id} options={{type: "allCards"}} key={id} fixHover={-288} />
                )}
            </div>
        </>);
    }
}
