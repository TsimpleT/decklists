import React from 'react';

import { Decklist, DEV_STRING_PRE, LocalStorageManager } from '../../Data';
import { VDecklist } from '../../Views';
import { RouteAwareProps } from '../../withRoute';

export class DecklistPage extends React.Component<RouteAwareProps> {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Decklist ${LocalStorageManager.getInstance().getDeckName(this.uuid)}`;
    }
    
    public override componentDidUpdate(previousProps: RouteAwareProps): void {
        if(previousProps.route.params.deckid !== this.props.route.params.deckid) {
            document.title = `${DEV_STRING_PRE}Decklist ${LocalStorageManager.getInstance().getDeckName(this.uuid)}`;
        }
    }

    private get uuid(): string {
        return this.props.route.params.deckid ?? "";
    }

    private get decklist(): Decklist|undefined {
        return LocalStorageManager.getInstance().getDecklist(this.uuid);
    }

    public render(): React.ReactNode {
        return ((!this.decklist) ? <div style={{marginLeft: "4px"}}>decklist not found</div> : 
            <VDecklist decklist={this.decklist} initialTitle={LocalStorageManager.getInstance().getDeckName(this.uuid)} subtitle={""}  />
        );
    }
}
