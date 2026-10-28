import { afterEach, describe, expect, it, vi } from 'vitest';
import { FAVOURITES_KEY, favouritesReducer, loadFavourites } from './favouritesReducer';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('favourites state', () => {
  it('never mutates the existing list when toggling a favourite', () => {
    const original = Object.freeze(['1', '2']);
    expect(favouritesReducer(original, { type: 'TOGGLE_FAVOURITE', id: '3' })).toEqual(['1', '2', '3']);
    expect(favouritesReducer(original, { type: 'TOGGLE_FAVOURITE', id: '1' })).toEqual(['2']);
    expect(original).toEqual(['1', '2']);
  });

  it('drops invalid and duplicate stored IDs', () => {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(['1', null, 2, '1', '3']));
    expect(loadFavourites()).toEqual(['1', '3']);
  });

  it('recovers if reading browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Access denied'); });
    expect(loadFavourites()).toEqual([]);
  });
});
