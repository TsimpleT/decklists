import React from 'react';
import styles from './LegendImage.module.css';

import { GET_CARD, GET_CARD_ART } from '../../Data';

interface IProps { id: string; size: number; imgTitle?: string; subscript?: string; subscriptFontSize?: number; extraStyles?: React.CSSProperties; loading?: 'eager' | 'lazy' }

export class LegendImage extends React.Component<IProps> {
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
        const imgTitle = this.props.imgTitle ?? card.name.substring(0, card.name.search(","));
        return (
            <div className={styles.imageContainer} style={{width: this.props.size, height: this.props.size, minWidth: this.props.size, ...(this.props.extraStyles ?? {})}}>
                <img src={GET_CARD_ART(this.props.id)} className={styles[`position-${this.props.id}`]} title={imgTitle} alt={imgTitle} loading={this.props.loading} />
                <span className={styles.subscript} style={(this.props.subscriptFontSize) ? {fontSize: `${this.props.subscriptFontSize}px`} : {}}>{this.props.subscript}</span>
            </div>
        );
    }
}
