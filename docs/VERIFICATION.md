# Verification record

Verified on 28 October 2026.

## Automated checks

- `npm run build`: passed with Vite 7.3.7. The production bundle is generated in `dist/`.
- `npm test`: 15 passing tests across two files.

The tests cover loading until a response arrives, rendering 30 records, case-insensitive search without another API call, empty search recovery, favourite toggles and persistence across remounts, selection surviving filtering, corrupt saved JSON, unavailable browser storage, HTTP errors, network failures, invalid list responses, fetch cancellation on unmount, image failure fallback, immutable state transitions, and saved-ID validation.

Test fixtures are isolated to test files. The application uses the live Picsum endpoint.

## Browser checks

- The real API populated all 30 cards and the images loaded.
- Searching for `pAuL` showed 10 cards by Paul Jarvis. Clearing search restored all 30.
- Saving photo 0 changed the count to 1; refreshing preserved the selection. Removing it restored the count to 0.
- A query with no matches showed the empty state and Clear search restored the collection.
- Grid measurements at CSS viewport widths of 375px, 698px, and 1309px showed one, two, and four columns respectively, without horizontal overflow.
- The desktop, tablet, and mobile layouts were visually inspected. A desktop screenshot is included in this directory.

The app's Tailwind breakpoints are 640px for two columns and 1024px for four columns. Browser viewport overrides were reset after verification, and the favourite selected during testing was removed.

## Remaining submission steps

The source is published at [WhiteDevil377/celebrare-photo-gallery](https://github.com/WhiteDevil377/celebrare-photo-gallery). The candidate must still record their own explanation, upload the recording with view access, and submit the repository and recording links through the recruiter's separately shared form.
