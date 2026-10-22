import React from 'react';
import { Location, Params, useLocation, useParams } from 'react-router-dom';

export interface RouteInfo {
    location: Location;
    params: Readonly<Params<string>>;
}

export interface RouteAwareProps {
    route: RouteInfo;
}

export function withRoute(Component: React.ComponentType<RouteAwareProps>): React.ComponentType {
    const RouteAwareComponent: React.FC = () => {
        const location = useLocation();
        const params = useParams();
        return <Component route={{ location, params }} />;
    };
    RouteAwareComponent.displayName = `withRoute(${Component.displayName ?? Component.name ?? 'Component'})`;
    return RouteAwareComponent;
}
