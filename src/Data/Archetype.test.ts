import { ALL_ARCHETYPES, Archetype, GET_ARCHETYPE_TIERS } from './Archetype';
import { ALL_METAS, GET_ARCHETYPE_DECKLISTS } from './TournamentResults';

test('each archetype with decks is in the tierlist', () => {
    const missingArchetypesWithDecks: string[] = [];

    for(let meta of ALL_METAS) {
        const tierlistArchetypes: Archetype[] = GET_ARCHETYPE_TIERS(meta).flat();
        for(let archetype of ALL_ARCHETYPES) {
            if(archetype !== "Unknown" && !tierlistArchetypes.includes(archetype)) {
                const dls = GET_ARCHETYPE_DECKLISTS(archetype, meta);
                if(dls.length > 0) {
                    missingArchetypesWithDecks.push(`${meta} | ${archetype}: ${dls.length} decks`);
                }
            }
        }
    }

    expect(missingArchetypesWithDecks).toEqual([]);
});
