import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AllArchetypesPage.module.css';

import { DEV_STRING_PRE, GET_ARCHETYPE_DECKLISTS, ARCHETYPE_TO_LEGEND_BASE_ID, ImageUtil, ARCHETYPE_TIER_NAMES, GET_CARD, Meta, ALL_METAS, GET_ARCHETYPE_TIERS, GET_MAX_ARCHETYPE_TIER_SIZE, GET_META_NAME, GET_ARCHETYPE_ANNOTATIONS, AnnotationImageType } from '../../Data';
import { AnnotationImage, LegendImage } from '../../Views';

const BOTTOM_ARCHETYPE_STYLE = {borderBottom: "none", borderRadius: "0 0 8px 8px"};

interface IState {
    meta: Meta
}

export class AllArchetypesPage extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        let url: string = document.URL;
        if(url.length > 0 && url.charAt(url.length-1) !== "/") {
            url += "/";
        }
        const metaParsed = url.slice(url.indexOf("all-archetypes/")+15, url.length-1).toUpperCase();
        this.state = { meta: ALL_METAS.includes(metaParsed as Meta) ? metaParsed as Meta : ALL_METAS[ALL_METAS.length-1] };
    }

    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}All Archetypes`;
    }
    
    public render(): React.ReactNode {
        return (
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLabel} style={{borderLeft: "none"}}>{`${GET_META_NAME(this.state.meta)} Meta`}</div>
                    {ALL_METAS.filter((meta) => meta !== this.state.meta).map((meta) =>
                        <div className={`${styles.headerLabel} ${styles.headerLabelLink}`} onClick={() => {
                            window.history.pushState("", "", `/decklists/riftbound/all-archetypes/${meta}`);
                            this.setState({meta: meta});
                        }}>
                            {meta}
                        </div>
                    )}
                </div>
                <div className={styles.innerContainer}>
                    {GET_ARCHETYPE_TIERS(this.state.meta).map((tier, tierIdx) =>
                        <div className={styles.columnContainer} key={tierIdx}>
                            <div className={styles.tierHeader}>{ARCHETYPE_TIER_NAMES[tierIdx]}</div>
                            {(tier.length === 0) &&
                                <div className={styles.archetypeContainer} style={{paddingLeft: "15px"}}>
                                    <span>Nothing in This Tier Right Now</span>
                                </div>
                            }
                            {tier.map((archetype, archetypeIdx) => {
                                const baseId = ARCHETYPE_TO_LEGEND_BASE_ID(archetype);
                                const numLists = GET_ARCHETYPE_DECKLISTS(archetype, this.state.meta).length;
                                const subtitle = `${numLists} Tourney Decklist${(numLists !== 1) ? "s" : ""}`
                                const title = `${archetype}: ${subtitle}`;
                                const colors = GET_CARD(baseId).domains;
                                return (
                                    <Link to={`/decklists/riftbound/archetype/${archetype.replaceAll(" ", "-")}/${this.state.meta}`} style={{all: "unset"}} key={archetypeIdx}>
                                        <div className={styles.archetypeContainer} style={(archetypeIdx === GET_MAX_ARCHETYPE_TIER_SIZE(this.state.meta)-1) ? BOTTOM_ARCHETYPE_STYLE : {}}>
                                            <LegendImage id={baseId} imgTitle={title} size={48} extraStyles={{border: "none"}} />
                                            <div className={styles.colorsContainer}>
                                                <div className={styles.colorDiv} style={{backgroundColor: `var(--bg-${colors[0].toLowerCase()})`}}>
                                                    <img src={ImageUtil.getImage(`${colors[0]}BW`)} height={16} title={colors[0]} alt={colors[0]} />
                                                </div>
                                                <div className={styles.colorDiv} style={{backgroundColor: `var(--bg-${colors[1].toLowerCase()})`, marginTop: "2px"}}>
                                                    <img src={ImageUtil.getImage(`${colors[1]}BW`)} height={16} title={colors[1]} alt={colors[1]} />
                                                </div>
                                            </div>
                                            <div className={styles.labelContainer}>
                                                <div className={styles.archetypeText}>{archetype}</div>
                                                <div className={styles.archetypeSubtitle}>{subtitle}</div>
                                            </div>
                                            <div className={styles.archetypeAnnotationContainer}>{
                                                GET_ARCHETYPE_ANNOTATIONS(this.state.meta, archetype).map((str) => <AnnotationImage input={str as AnnotationImageType} size={18}/>)
                                            }</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
