export const FAVOURITES_KEY = 'still:favourites';

// The lazy initializer reads storage before the first render, avoiding a reset on refresh.
export function loadFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? '[]');
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id) => typeof id === 'string'))]
      : [];
  } catch {
    // Missing access or malformed saved JSON should not prevent browsing.
    return [];
  }
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    default:
      return state;
  }
}
