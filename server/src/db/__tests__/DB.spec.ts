import { getTokenStems } from '../DB';

describe('stemming', () => {
  test('returns expected stems', () => {
    const stems = getTokenStems('test', 2);

    expect(stems).toHaveLength(6);
    expect(stems.sort()).toEqual(['test', 'tes', 'te', 'est', 'es', 'st'].sort());
  });

  test('returns non-duplicate stems', () => {
    const stems = getTokenStems('testest', 2);

    expect(stems).toHaveLength(15);
    expect(stems.sort()).toEqual(
      [
        'testest',
        'test',
        'te',
        'es',
        'st',
        'tes',
        'est',
        'ste',
        'este',
        'stes',
        'teste',
        'estes',
        'stest',
        'testes',
        'estest',
      ].sort(),
    );
  });
});
