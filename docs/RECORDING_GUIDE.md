# Five-minute recording guide

Use this outline to understand the code and rehearse. Explain it in your own words. The brief allows AI assistance but expects you to understand every line you present. Do not claim a difficulty or an implementation decision as your own unless that is accurate.

## Before recording

1. Run `npm run dev` in this folder. Keep the browser and editor open side by side.
2. Open `Gallery.jsx`, `useFetchPhotos.js`, and `favouritesReducer.js` in editor tabs.
3. Check your microphone and hide notifications or private tabs.
4. Make sure the internet connection loads Picsum. For a visible spinner, DevTools Network throttling can slow the request; restore normal speed afterwards.
5. Start a screen recording with macOS Screenshot (`Command + Shift + 5`) or QuickTime Player's New Screen Recording. Select your microphone before starting.

## 0:00-1:00 - Demonstrate the app

Explain that this is a React + Vite photo gallery styled with Tailwind.

- Reload and show photos loading.
- Point out the author names and heart buttons.
- Type part of an author's name. Show that matching cards appear immediately, then clear the search.
- Save a photo, refresh, and show the filled heart is still selected. Toggle it off.
- Briefly resize the browser to show the grid adapting.

## 1:00-2:00 - Explain the custom hook

Open `src/hooks/useFetchPhotos.js`.

Cover these points:

- `photos` starts as an empty array, `loading` as true, and `error` as null.
- The effect requests the required Picsum endpoint on mount.
- `response.ok` is checked because HTTP failures do not automatically reject `fetch`.
- Valid JSON populates the photo array; a failed network request, HTTP error, or invalid list response produces a readable error.
- `finally` ends the loading state when the active request finishes.
- Cleanup aborts the request. Checking `signal.aborted` avoids treating normal cancellation as an error.
- The return value is `{ photos, loading, error }`; `Gallery` decides what to render.

## 2:00-3:00 - Explain favourites and persistence

Open `src/reducers/favouritesReducer.js`, then the `useReducer` and persistence effect in `Gallery.jsx`.

- The reducer handles one action: `TOGGLE_FAVOURITE`, carrying a photo ID.
- An ID already in the array is removed with `filter`; a new ID is added with array spread.
- These operations return a new array. The reducer does not mutate old state or write to storage.
- `useReducer` is required by the brief and keeps the state transition in one pure, testable function. A small toggle could also be implemented with `useState`, but that would not satisfy this assignment.
- The initializer reads saved JSON before the first render. A separate effect saves the latest array whenever favourites change.
- Malformed JSON or blocked storage should not crash the gallery.

## 3:00-4:10 - Explain useCallback and useMemo

Open the two hooks in `Gallery.jsx`.

- `handleSearchChange` stores the latest input value. `useCallback` returns a stable handler reference between renders. An empty dependency array is correct because it only uses the stable `setSearch` setter and the event passed to it.
- `useMemo` stores the result of filtering the photos by the normalized author query. It recalculates when `photos` or `search` changes.
- A favourite change does not change those dependencies, so it can reuse the filtered array.
- Filtering happens locally. There is no API request on typing and no page reload.
- **What would break if removed?** Nothing functionally, if replaced by equivalent plain code. The handler reference would be new on each render and the filter would run on every render. In this small app the performance gain is modest. In particular, the callback goes directly to an input, so it is not currently skipping a memoized child render.

Do not say that `useCallback` debounces input, stops all re-renders, or caches search results. It does none of those things.

## 4:10-5:00 - Explain a difficulty you understand

Choose something you actually worked through. A useful topic to practise is favourite persistence during startup:

- Problem to understand: if the app first renders an empty list and writes it to storage before restoring the saved list, existing favourites could be lost.
- Approach in this code: use the reducer's lazy initializer to restore saved state before the first render, then let the effect persist future changes.
- Verification: select a photo, refresh, confirm it remains selected; remove it and refresh again. The automated tests also cover unmounting and remounting the component.

If this accurately describes the part you found hardest, a possible form response is: "Restoring favourites before the first render so the persistence effect does not overwrite previously saved IDs."

Close by pointing to the test command and README. Keep the recording close to five minutes.

## Quick practice questions

| Question | What you should understand |
| --- | --- |
| Why use photo IDs as React keys? | IDs are stable when search changes the visible order; array positions are not stable identifiers. |
| Why not mutate `state` with `push` or `splice`? | React state should be treated as immutable; return a new value. |
| Why put localStorage outside the reducer? | It is an external side effect; reducers should be pure. |
| Why do effects have dependencies? | Dependencies determine when React re-runs an effect with new values. |
| Why does an API error need `response.ok`? | `fetch` rejects for network failures, but resolves responses for HTTP error statuses. |
| Why might DevTools show a cancelled initial request? | Development Strict Mode checks cleanup by running effect setup again. |
| What does `aria-pressed` do? | It exposes the heart button's selected state to assistive technology. |
| Does localStorage sync across devices? | No. It belongs to this browser and origin and may be cleared or blocked. |

## Before submitting

- Watch the recording once and confirm your voice and screen are readable.
- Open your public repository URL and recording URL in a private browser window.
- Submit the links and your own hardest-part sentence through the Google Form shared by the recruiter.
- The deadline is relative to when you received the assignment; confirm that time yourself.
