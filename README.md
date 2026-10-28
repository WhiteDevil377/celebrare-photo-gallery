# Still - Photo Gallery

A small photo gallery built for the Celebrare Frontend Intern pre-screening assignment. Browse 30 photographs, search their authors, and save favourites that survive a page refresh.

Built with **React, Vite, and Tailwind CSS**. No component or icon libraries, backend, API key, or environment variables are required.

Repository: [WhiteDevil377/celebrare-photo-gallery](https://github.com/WhiteDevil377/celebrare-photo-gallery)

## Run locally

Use Node.js 22.12 or newer (Node 22 LTS recommended). Clone the repository, then run:

```bash
git clone https://github.com/WhiteDevil377/celebrare-photo-gallery.git
cd celebrare-photo-gallery
npm ci
npm run dev
```

If you already have the project folder, run the npm commands from that folder.

Open the local URL Vite prints, usually `http://127.0.0.1:5173`.

```bash
npm test         # Behaviour and state tests
npm run build    # Production bundle in dist/
npm run preview  # Serve the production build locally
```

The first photo request and the photographs need an internet connection. The dependency versions are recorded in `package-lock.json` for repeatable installation.

## The seven requirements

| Requirement | Implementation |
| --- | --- |
| React + Vite + Tailwind | `vite.config.js`, `src/main.jsx`, `src/index.css`. All page styling uses Tailwind utilities; the CSS entry defines the design tokens. |
| Fetch 30 photos, loading and error states | `src/hooks/useFetchPhotos.js` requests `https://picsum.photos/v2/list?limit=30`. `Gallery.jsx` displays a spinner or an error message. |
| Responsive photo grid | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`: one column below 640px, two from 640px, four from 1024px. Each card contains a photo, author, and heart. |
| Search by author in real time | A controlled input updates `search`. Filtering is case-insensitive and ignores leading/trailing spaces. Search never triggers a network request. |
| Favourites with `useReducer` and `localStorage` | `favouritesReducer.js` toggles photo IDs. A lazy initializer restores them before rendering; an effect saves changes under `still:favourites`. |
| `useFetchPhotos` custom hook | Returns exactly `{ photos, loading, error }`. `Gallery` consumes it and never fetches directly. |
| `useCallback` and `useMemo` | `Gallery.jsx` memoizes the search handler and computes the filtered list with `[photos, search]` dependencies. |

## Code map

```text
src/
  main.jsx                       React entry point and Strict Mode
  index.css                      Tailwind import and colour/font tokens
  components/
    Gallery.jsx                  Page, search, reducer wiring, persistence
    PhotoCard.jsx                Photo, author, accessible heart button
    Icons.jsx                    Small inline SVGs
    Gallery.test.jsx             User behaviour and fetch failure tests
  hooks/
    useFetchPhotos.js            Network request and lifecycle cleanup
  reducers/
    favouritesReducer.js         Pure favourite toggle and storage initializer
    favouritesReducer.test.js    Immutability and saved-data recovery tests
  test/setup.js                  Test environment cleanup
docs/
  RECORDING_GUIDE.md             Five-minute walkthrough and practice questions
```

## References

- [Vite setup](https://vite.dev/guide/)
- [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite)
- [Picsum API and sized image URLs](https://picsum.photos/)
- [React useReducer](https://react.dev/reference/react/useReducer), [useCallback](https://react.dev/reference/react/useCallback), and [useMemo](https://react.dev/reference/react/useMemo)
