import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AllArchetypesPage.module.css';

import { DEV_STRING_PRE, GET_ARCHETYPE_DECKLISTS, ARCHETYPE_TO_LEGEND_BASE_ID, ImageUtil, ARCHETYPE_TIER_NAMES, GET_CARD, Meta, ALL_METAS, GET_ARCHETYPE_TIERS, GET_MAX_ARCHETYPE_TIER_SIZE, GET_META_NAME, GET_ARCHETYPE_ANNOTATIONS, AnnotationImageType, MAIN_SET_FROM_STRING, SET_HAS_METAL, META_FROM_STRING } from '../../Data';
import { AnnotationImage, SquareImage } from '../../Views';
import { ROUTES } from '../../Routes';
import { RouteAwareProps } from '../../withRoute';

export class AllArchetypesPage extends React.Component<RouteAwareProps> {
    private getMetaFromPath(): Meta {
        return META_FROM_STRING(this.props.route.params.meta ?? "");
    }

    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}All Archetypes`;
    }

    public override componentDidUpdate(previousProps: RouteAwareProps): void {
        if(previousProps.route.params.meta !== this.props.route.params.meta) {
            document.title = `${DEV_STRING_PRE}All Archetypes`;
        }
    }

    public render(): React.ReactNode {
        const meta = this.getMetaFromPath();
        return (
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <div className={`${styles.headerContainer} ${styles.metaTitleContainer}`}>
                        <div className={styles.metaTitle}>{`${GET_META_NAME(meta)} Meta`}</div>
                    </div>
                    <div className={styles.headerContainer}>
                        {[...ALL_METAS].reverse().map((iterMeta: Meta, idx: number) => {
                            const extraStyles = (
                                (idx === 0) ?
                                    styles.firstMeta :
                                    (idx === ALL_METAS.length-1) ?
                                        `${styles.leftBorder} ${styles.lastMeta}` :
                                        (idx > 0) ? styles.leftBorder : ""
                            );
                            const labelStyles = `${extraStyles} ${styles.headerLabel}`;
                            if(iterMeta === meta) {
                                return (
                                    <div
                                        className={`${labelStyles} ${styles.currentMeta}`}
                                        aria-current="page"
                                        key={iterMeta}
                                    >
                                        {iterMeta}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    to={ROUTES.archetypes(iterMeta)}
                                    className={`${labelStyles} ${styles.headerLabelLink}`}
                                    key={iterMeta}
                                >
                                    {iterMeta}
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.innerContainer}>
                    {GET_ARCHETYPE_TIERS(meta).map((tier, tierIdx) =>
                        <div className={styles.columnContainer} key={tierIdx}>
                            <div className={styles.tierHeader}>{ARCHETYPE_TIER_NAMES[tierIdx]}</div>
                            {(tier.length === 0) &&
                                <div className={styles.archetypeContainer} style={{paddingLeft: "15px"}}>
                                    <span>Nothing in This Tier Right Now</span>
                                </div>
                            }
                            {tier.map((archetype, archetypeIdx) => {
                                const baseId = ARCHETYPE_TO_LEGEND_BASE_ID(archetype);
                                const numLists = GET_ARCHETYPE_DECKLISTS(archetype, meta).length;
                                const subtitle = `${numLists} Tourney Decklist${(numLists !== 1) ? "s" : ""}`
                                const title = `${archetype}: ${subtitle}`;
                                const colors = GET_CARD(baseId).domains;
                                const hasMetal: boolean = SET_HAS_METAL(MAIN_SET_FROM_STRING(baseId.substring(0, 3)));
                                const isBottomOfTier = (archetypeIdx === GET_MAX_ARCHETYPE_TIER_SIZE(meta)-1);
                                const archetypeStyle: React.CSSProperties = {
                                    borderBottom: (isBottomOfTier) ? "none" : "",
                                    borderRadius: (isBottomOfTier) ? "0 0 8px 8px" : ""
                                };
                                return (
                                    <Link to={ROUTES.archetypeDecklists(archetype, meta)} style={{all: "unset"}} key={archetypeIdx}>
                                        <div className={`${styles.archetypeContainer} ${((hasMetal || meta !== ALL_METAS[ALL_METAS.length-1]) ? {} : styles.noMetal)}`} style={archetypeStyle}>
                                            <SquareImage id={baseId} imgTitle={title} size={48} extraStyles={{border: "none"}} />
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
                                                GET_ARCHETYPE_ANNOTATIONS(meta, archetype).map((str, annotationIdx) => <AnnotationImage input={str as AnnotationImageType} size={18} key={`${str}-${annotationIdx}`}/> )
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
