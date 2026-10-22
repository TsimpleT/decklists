import { Decklist, IDecklist } from './Decklist';

test('sorting a decklist does not reorder its input arrays', () => {
    const mainDeck = [{ id: 'ZZZ', count: 1 }, { id: 'AAA', count: 1 }];
    const sideboard = [{ id: 'YYY', count: 1 }, { id: 'BBB', count: 1 }];
    const input: IDecklist = { mainDeck, sideboard };
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    try {
        const decklist = new Decklist(input);

        expect(mainDeck.map((card) => card.id)).toEqual(['ZZZ', 'AAA']);
        expect(sideboard.map((card) => card.id)).toEqual(['YYY', 'BBB']);
        expect(decklist.mainDeck).not.toBe(mainDeck);
        expect(decklist.sideboard).not.toBe(sideboard);
        expect(decklist.mainDeck.map((card) => card.id)).toEqual(['AAA', 'ZZZ']);
        expect(decklist.sideboard.map((card) => card.id)).toEqual(['BBB', 'YYY']);
    } finally {
        warn.mockRestore();
    }
});
