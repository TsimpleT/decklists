import React from 'react';

import { Archetype, ARCHETYPE_FROM_STRING, DEV_STRING_PRE, Meta, META_FROM_STRING } from '../../Data';
import { VDecklistTable } from '../../Views';
import { RouteAwareProps } from '../../withRoute';

export class DecklistTablePage extends React.Component<RouteAwareProps> {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}${this.archetype} Decklists`;
    }

    public override componentDidUpdate(previousProps: RouteAwareProps): void {
        if(previousProps.route.params.archetype !== this.props.route.params.archetype) {
            document.title = `${DEV_STRING_PRE}${this.archetype} Decklists`;
        }
    }

    private get archetype(): Archetype {
        return ARCHETYPE_FROM_STRING((this.props.route.params.archetype ?? "").replaceAll("-", " "));
    }

    private get meta(): Meta {
        return META_FROM_STRING(this.props.route.params.meta ?? "");
    }

    public render(): React.ReactNode {
        return (<>
            <VDecklistTable archetype={this.archetype} meta={this.meta} />
        </>);
    }
}
