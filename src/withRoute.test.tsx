import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { ROUTES, ROUTE_PATHS } from './Routes';
import { RouteAwareProps, withRoute } from './withRoute';

class RouteProbe extends React.Component<RouteAwareProps> {
    public render(): React.ReactNode {
        return <div data-testid="route-info">{JSON.stringify({
            pathname: this.props.route.location.pathname,
            params: this.props.route.params
        })}</div>;
    }
}

const RoutedProbe = withRoute(RouteProbe);

test('route adapter exposes decoded router params and current location', () => {
    const path = ROUTES.tournamentDecklist('CNO-20261019', 'Rift Player');

    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path={ROUTE_PATHS.tournamentDecklist} element={<RoutedProbe />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByTestId('route-info').textContent).toBe(JSON.stringify({
        pathname: path,
        params: { tourneyName: 'CNO-20261019', username: 'Rift Player' }
    }));
});
