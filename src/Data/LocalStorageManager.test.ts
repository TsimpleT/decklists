import { Decklist } from './Decklist';
import { LocalStorageManager } from './LocalStorageManager';

test('the shared manager is stable and decklists survive manager rehydration', () => {
    localStorage.clear();
    const originalCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: { randomUUID: () => 'test-deck-id' }
    });

    try {
        const manager = LocalStorageManager.getInstance();
        expect(LocalStorageManager.getInstance()).toBe(manager);

        const decklist = new Decklist({
            archetype: 'Jinx',
            legend: 'OGN-251',
            chosenChampion: 'OGN-251'
        });
        const id = manager.addDecklist(decklist);
        manager.renameDecklist(id, 'Test deck');

        const rehydratedManager = new LocalStorageManager();
        expect(rehydratedManager.getDecklist(id)?.legend).toBe('OGN-251');
        expect(rehydratedManager.getDeckName(id)).toBe('Test deck');
        expect(rehydratedManager.getArchetypeDecklistIds('Jinx')).toContain(id);

        manager.deleteDecklist(id);
        expect(manager.getDecklist(id)).toBeUndefined();
        expect(localStorage.getItem(`deck-${id}`)).toBeNull();
    } finally {
        localStorage.clear();
        if(originalCrypto) {
            Object.defineProperty(globalThis, 'crypto', originalCrypto);
        } else {
            delete (globalThis as { crypto?: Crypto }).crypto;
        }
    }
});
