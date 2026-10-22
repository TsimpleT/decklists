import { generatePath } from 'react-router-dom';

export const APP_BASENAME = '/decklists';

export const ROUTE_PATHS = {
    home: '/',
    archetypes: '/riftbound/all-archetypes/:meta',
    archetypeDecklists: '/riftbound/archetype/:archetype/:meta',
    myDecklists: '/riftbound/me',
    decklist: '/riftbound/me/:deckid',
    playerResults: '/riftbound/player-results',
    allCards: '/riftbound/all-cards',
    tournamentResults: '/riftbound/tournament-results',
    tournamentResultsMeta: '/riftbound/tournament-results/:meta',
    tournamentDecklist: '/riftbound/tournament/:tourneyName/decklist/:username'
};

export const ROUTES = {
    archetypes: (meta: string): string => generatePath(ROUTE_PATHS.archetypes, { meta }),
    archetypeDecklists: (archetype: string, meta: string): string =>
        generatePath(ROUTE_PATHS.archetypeDecklists, { archetype: archetype.replaceAll(' ', '-'), meta }),
    myDecklists: (): string => ROUTE_PATHS.myDecklists,
    decklist: (deckId: string): string => generatePath(ROUTE_PATHS.decklist, { deckid: deckId }),
    playerResults: (): string => ROUTE_PATHS.playerResults,
    allCards: (): string => ROUTE_PATHS.allCards,
    tournamentResults: (meta?: string): string => meta
        ? generatePath(ROUTE_PATHS.tournamentResultsMeta, { meta })
        : ROUTE_PATHS.tournamentResults,
    tournamentDecklist: (tourneyName: string, username: string): string =>
        generatePath(ROUTE_PATHS.tournamentDecklist, { tourneyName, username })
};
