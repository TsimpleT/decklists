import React from 'react';
import styles from './SquareImage.module.css';
import posStyles from './SquareImagePositioning.module.css';

import { CardType, GET_CARD, GET_CARD_ART } from '../../Data';

interface IProps {
    id: string;
    size: number;
    imgTitle?: string;
    subscript?: string;
    subscriptFontSize?: number;
    extraStyles?: React.CSSProperties;
    loading?: 'eager' | 'lazy'
    enableHover?: boolean;
}
interface IState { hover: boolean; }

export class SquareImage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { hover: false };
    }

    private enableHover = (): void => {
        this.setState({ hover: true });
    }

    private disableHover = (): void => {
        this.setState({ hover: false });
    }

    public render(): React.ReactNode {
        if(this.props.id === "") {
            return (
                <div className={styles.imageContainer} style={{width: this.props.size, height: this.props.size, ...(this.props.extraStyles ?? {})}}>
                    <div className={styles.unknown}>?</div>
                    <span className={styles.subscript} style={(this.props.subscriptFontSize) ? {fontSize: `${this.props.subscriptFontSize}px`} : {}}>{this.props.subscript}</span>
                </div>
            );
        }
        const card = GET_CARD(this.props.id);
        const cardType: CardType = (card.type.length > 0) ? card.type[0] : "Legend";
        const imgTitle = this.props.imgTitle ?? `${card.name} (${this.props.id})`;
        return (
            <div className={styles.wrapperForImg} title={`${card.name} (${this.props.id})`}
                onMouseEnter={this.props.enableHover ? this.enableHover : undefined} onMouseLeave={this.props.enableHover ? this.disableHover : undefined}
            >
                <div className={styles.imageContainer} style={{width: this.props.size, height: this.props.size, minWidth: this.props.size, ...(this.props.extraStyles ?? {})}}>
                    <img src={GET_CARD_ART(this.props.id)} className={posStyles[this.props.id.replaceAll("*","")]} title={imgTitle} alt={imgTitle} loading={this.props.loading} />
                    <span className={styles.subscript} style={(this.props.subscriptFontSize) ? {fontSize: `${this.props.subscriptFontSize}px`} : {}}>{this.props.subscript}</span>
                </div>
                {(this.state.hover) &&
                    <img src={GET_CARD_ART(this.props.id)} className={`${styles.cardHoverImage} ${(cardType === "Battlefield") && styles.cardHoverImageBF}`}
                        alt={`${card.name} (${this.props.id})`} />
                }
            </div>
        );
    }
}
