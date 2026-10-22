import React from 'react';
import copy from 'copy-to-clipboard';
import styles from './VDecklist.module.css';

import { CardType, Decklist, GET_CCATEGORY, ImageUtil } from '../../Data';
import { VDecklistCard } from '../VDecklistCard';
import { GET_COLOR_STYLE } from '../VDecklistTable';

interface IProps {
    decklist: Decklist;
    initialTitle: string;
    subtitle: string;
    editFunctions?: {replace: () => Promise<void>, delete: () => void, rename: () => string};
}

interface IState {
    hover: ""|"export"|"confirmDelete"|"editName";
    title: string;
}

export class VDecklist extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { hover: "", title: this.props.initialTitle };
    }

    private copyStandardText: React.MouseEventHandler<HTMLDivElement> = (_) => {
        copy(this.props.decklist.exportStandard("TEXT"));
        window.alert("Decklist copied to clipboard in standard text format.");
        this.setState({hover: ""});
    }

    private copyStandardIds: React.MouseEventHandler<HTMLDivElement> = (_) => {
        copy(this.props.decklist.exportStandard("IDS"));
        window.alert("Decklist copied to clipboard in standard ID format.");
        this.setState({hover: ""});
    }

    private copyToTTS: React.MouseEventHandler<HTMLDivElement> = (_) => {
        copy(this.props.decklist.exportToTTS());
        window.alert("Decklist copied to clipboard to be used in TTS.");
        this.setState({hover: ""});
    }

    public render(): React.ReactNode {
        const dl = this.props.decklist;
        return (
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.title}>
                        <span>{this.state.title}</span>
                        {(this.props.editFunctions) && (
                            <div onClick={()=>{this.setState({hover: (this.state.hover !== "editName") ? "editName" : ""}, () => {
                                document.getElementById("editDeckNameInput")?.focus();
                            })}} className={styles.headerButton} title={"Edit Name"} style={(this.state.hover === "editName") ? {backgroundColor:"purple"}:{}}>
                                <img className={styles.icon} src={ImageUtil.getImage("Edit")} height={12} alt={"Edit Name"} />
                            </div>

                        )}
                    </div>
                    {(this.props.subtitle) && (
                        <div className={styles.subtitle}>
                            {this.props.subtitle}
                        </div>
                    )}
                    <div className={styles.headerBottomRowContainer}>
                        <div className={styles.cardTypeContainer}>
                            {(["Unit", "Spell", "Gear"] as CardType[]).map((cardType) => {
                                const md = dl.numOfCardType(cardType), sb = dl.numOfCardTypeSideboard(cardType);
                                return (
                                    <div className={styles.cardTypeInnerContainer} key={cardType}>
                                        <img src={ImageUtil.getImage(cardType)} height={20} title={cardType} alt={cardType} className={styles.cardType} />
                                        <div className={styles.cardTypeCount}>{md}</div>
                                        {(sb > 0) &&
                                            <div className={styles.sideboard} title='sideboard'>{`+${sb}`}</div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                        <div className={styles.headerButtonContainer}>
                            {(this.props.editFunctions) && (<>
                                <div onClick={()=>{this.setState({hover: (this.state.hover !== "confirmDelete") ? "confirmDelete" : ""})}} className={styles.headerButton} title={"Delete"} style={(this.state.hover === "confirmDelete") ? {backgroundColor:"purple"}:{}}>
                                    <img className={styles.icon} src={ImageUtil.getImage("Trash")} height={12} alt={"Delete"} />
                                </div>
                                <div onClick={this.props.editFunctions.replace} className={styles.headerButton} title={"Import"}>
                                    <img className={styles.icon} src={ImageUtil.getImage("Import")} height={12} alt={"Import"} />
                                </div>
                            </>)}
                            <div onClick={()=>{this.setState({hover: (this.state.hover !== "export") ? "export" : ""})}} className={styles.headerButton} title={"Export"} style={(this.state.hover === "export") ? {backgroundColor:"purple"}:{}}>
                                <img className={styles.icon} src={ImageUtil.getImage("Export")} height={12} alt={"Export"} />
                            </div>
                        </div>
                    </div>
                </div>
                {(this.state.hover === "export" || (this.state.hover !== "" && this.props.editFunctions)) && (
                    <div className={styles.hoverContainer}>
                        <div className={styles.hoverInnerContainer}>
                            {(this.state.hover === "export") && (<>
                                <div style={{fontWeight: "600"}}>Export To</div>
                                <div className={styles.exportOptionContainer}>
                                    <div className={styles.hoverBoxButton} onClick={this.copyStandardText}>Text</div>
                                    <div className={styles.hoverBoxButton} onClick={this.copyStandardIds}>IDs</div>
                                    <div className={styles.hoverBoxButton} onClick={this.copyToTTS}>TTS</div>
                                </div>
                            </>)}
                            {(this.state.hover === "confirmDelete" && this.props.editFunctions) && (<>
                                <div className={styles.hoverBoxButton} onClick={this.props.editFunctions?.delete}>Confirm Deletion</div>
                            </>)}
                            {(this.state.hover === "editName" && this.props.editFunctions) && (<>
                                <div className={styles.editInput}>
                                    <input id={"editDeckNameInput"} style={{width: "calc(100% - 8px)"}} defaultValue={this.state.title}/>
                                </div>
                                <div className={styles.hoverBoxButton} onClick={() => {
                                    this.setState({hover: "", title: this.props.editFunctions?.rename() ?? "Unnamed Decklist"});
                                }}>Update Deck Name</div>
                            </>)}
                        </div>
                    </div>
                )}
                <div className={styles.decklistContainer}>
                    {[[{id: dl.legend, count: 1}], [{id: dl.chosenChampion, count: 1}], dl.mainDeck, dl.battlefields, dl.runeDeck, dl.sideboard].map((arr, i) => (
                        <div className={styles.section} key={i}>
                            {(arr.map((listing, j) => 
                                <div className={styles.row} key={j}>
                                    <span className={`${styles.count} ${GET_COLOR_STYLE(GET_CCATEGORY(listing.id), listing.count, 0)}`}>{listing.count}x</span>
                                    <VDecklistCard id={listing.id} options={{type: "decklist"}} withCountOnLeft={true} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
