import React from 'react';

import { Decklist, DEV_STRING_PRE, GET_TOURNAMENT_DECKLIST, GET_PLACING, GET_TOURNAMENT_NAME } from '../../Data';
import { VDecklist } from '../../Views';
import { RouteAwareProps } from '../../withRoute';

export class TournamentDecklistPage extends React.Component<RouteAwareProps> {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Decklist ${this.username} ${this.tournId}`;
    }
    
    public override componentDidUpdate(previousProps: RouteAwareProps): void {
        if(previousProps.route.params.tourneyName !== this.props.route.params.tourneyName
            || previousProps.route.params.username !== this.props.route.params.username) {
            document.title = `${DEV_STRING_PRE}Decklist ${this.username} ${this.tournId}`;
        }
    }

    private get tournId(): string {
        return this.props.route.params.tourneyName ?? "";
    }

    private get username(): string {
        return this.props.route.params.username ?? "";
    }

    private get decklist(): Decklist|undefined {
        return GET_TOURNAMENT_DECKLIST(this.tournId, this.username);
    }

    private get placing(): string|undefined {
        return GET_PLACING(this.tournId, this.username);
    }

    public render(): React.ReactNode {
        return ((!this.decklist || !this.placing) ? <div style={{marginLeft: "4px"}}>decklist not found</div> :
            <VDecklist decklist={this.decklist} initialTitle={`${GET_TOURNAMENT_NAME(this.tournId)} ${this.decklist.date}: ${this.placing}`} subtitle={(this.username[0] === "*") ? "" : `by ${this.username}`}  />
        );
    }
}
