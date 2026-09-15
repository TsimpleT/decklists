import React from 'react';
import styles from './AnnotationImage.module.css';
import { AnnotationImageType, ImageUtil } from '../../Data';

interface IProps { input: string; size: number; }

export class AnnotationImage extends React.Component<IProps> {
    private text: string;
    private id: AnnotationImageType;

    constructor(props: IProps) {
        super(props);
        let idx = props.input.indexOf(" ");
        this.text = props.input.substring(idx+1);
        this.id = props.input.substring(0, idx) as AnnotationImageType;
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.imageContainer} style={{width: this.props.size, height: this.props.size, minWidth: this.props.size}}>
                <img src={ImageUtil.getImage(this.id)} title={this.text} alt={this.text} />
            </div>
        );
    }
}
