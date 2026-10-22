import React from 'react';
import styles from './AnnotationImage.module.css';
import { AnnotationImageType, ImageUtil } from '../../Data';

interface IProps { input: string; size: number; }

export class AnnotationImage extends React.Component<IProps> {
    public render(): React.ReactNode {
        const idx = this.props.input.indexOf(" ");
        const text = this.props.input.substring(idx+1);
        const id = ((idx > -1) ? this.props.input.substring(0, idx) : this.props.input) as AnnotationImageType;
        return (
            <div className={styles.imageContainer} style={{width: this.props.size, height: this.props.size, minWidth: this.props.size}}>
                <img src={ImageUtil.getImage(id)} title={text} alt={text} />
            </div>
        );
    }
}
