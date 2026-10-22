import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { DEV_STRING_PRE } from './Data';
import { AppNav } from './AppNav';
import { AllArchetypesPage, CardListPage, DecklistTablePage, ErrorPage, PlayerResultsPage, TournamentResultsPage, TournamentDecklistPage, MyDecklistsPage, DecklistPage } from './Pages';
import { APP_BASENAME, ROUTE_PATHS } from './Routes';
import { withRoute } from './withRoute';

const RouteAwareAppNav = withRoute(AppNav);
const RouteAwareArchetypesPage = withRoute(AllArchetypesPage);
const RouteAwareDecklistPage = withRoute(DecklistPage);
const RouteAwareDecklistTablePage = withRoute(DecklistTablePage);
const RouteAwareTournamentResultsPage = withRoute(TournamentResultsPage);
const RouteAwareTournamentDecklistPage = withRoute(TournamentDecklistPage);

export class AppMainRouter extends React.Component {
    public override componentDidMount(): void {
        document.title = `${DEV_STRING_PRE}Decklist Comparisons`;
    }
    
    public render(): React.ReactNode {
        return (
            <BrowserRouter basename={APP_BASENAME}>
                <RouteAwareAppNav />
                <Routes>
                    <Route path={ROUTE_PATHS.home} element={<RouteAwareArchetypesPage />} />
                    <Route path="/riftbound" element={<RouteAwareArchetypesPage />} />
                    <Route path={ROUTE_PATHS.myDecklists} element={<MyDecklistsPage />} />
                    <Route path={ROUTE_PATHS.decklist} element={<RouteAwareDecklistPage />} />
                    <Route path={ROUTE_PATHS.archetypes} element={<RouteAwareArchetypesPage />} />
                    <Route path={ROUTE_PATHS.archetypeDecklists} element={<RouteAwareDecklistTablePage />} />
                    <Route path={ROUTE_PATHS.playerResults} element={<PlayerResultsPage />} />
                    <Route path={ROUTE_PATHS.allCards} element={<CardListPage />} />
                    <Route path={ROUTE_PATHS.tournamentResults} element={<RouteAwareTournamentResultsPage />} />
                    <Route path={ROUTE_PATHS.tournamentResultsMeta} element={<RouteAwareTournamentResultsPage />} />
                    <Route path={ROUTE_PATHS.tournamentDecklist} element={<RouteAwareTournamentDecklistPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        );
    }
}
