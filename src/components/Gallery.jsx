import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import { FAVOURITES_KEY, favouritesReducer, loadFavourites } from '../reducers/favouritesReducer';
import { FrameIcon, HeartIcon, SearchIcon } from './Icons';
import PhotoCard from './PhotoCard';

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, loadFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [favourites]);

  // Stable function reference; the filter itself is computed by useMemo below.
  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, search]);

  function toggleFavourite(id) {
    dispatch({ type: 'TOGGLE_FAVOURITE', id });
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-forest selection:text-white">
      <a href="#collection" className="sr-only rounded-lg bg-forest p-3 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10">Skip to collection</a>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        <header className="flex h-24 items-center justify-between border-b border-line sm:h-28">
          <div className="flex items-center gap-3 text-forest" aria-label="Still photo gallery">
            <FrameIcon className="size-8" />
            <span className="font-display text-[38px] leading-none tracking-[-0.06em]">still.</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-line bg-white/50 px-4 py-2.5 text-xs font-medium text-forest">
            <HeartIcon className="size-3.5" filled={favourites.length > 0} />
            <span aria-live="polite" aria-atomic="true">{favourites.length} saved</span>
          </div>
        </header>

        <main>
          <section className="flex flex-col justify-between gap-7 pt-12 pb-10 sm:pt-16 sm:pb-12 lg:flex-row lg:items-end">
            <div>
              <p className="mb-5 flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.2em] text-forest uppercase sm:text-[11px]">
                <span className="size-1.5 rounded-full bg-forest" />
                The everyday, seen differently
              </p>
              <h1 className="font-display text-5xl leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">
                A little <em className="font-normal text-forest">perspective.</em>
              </h1>
            </div>
            <p className="max-w-64 text-sm leading-6 text-muted lg:pb-1">
              A collection of moments.<br />
              Keep the ones that stay with you.
            </p>
          </section>

          <section id="collection" aria-labelledby="collection-title" className="scroll-mt-6 pb-12">
            <div className="mb-7 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 id="collection-title" className="text-sm font-semibold">The collection</h2>
                <span aria-live="polite" aria-atomic="true" className="rounded-full bg-sage px-2.5 py-1 text-[11px] tabular-nums text-forest">
                  {loading ? 'Loading' : error ? 'Unavailable' : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? 'photo' : 'photos'}`}
                </span>
              </div>

              <div className="relative w-full sm:w-80">
                <label htmlFor="author-search" className="sr-only">Search by author</label>
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted" />
                <input
                  id="author-search"
                  type="search"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by author..."
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-line bg-white/70 pr-4 pl-11 text-sm text-ink transition-colors outline-none placeholder:text-muted focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
              </div>
            </div>

            {storageError && (
              <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                Your browser couldn't save favourites. They will last for this visit only.
              </p>
            )}

            {loading ? (
              <div role="status" className="flex min-h-72 flex-col items-center justify-center gap-5 text-muted">
                <span className="size-9 animate-spin rounded-full border-2 border-line border-t-forest motion-reduce:animate-none" aria-hidden="true" />
                <p className="text-sm">Finding a little inspiration...</p>
              </div>
            ) : error ? (
              <div role="alert" className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border border-line px-6 text-center">
                <FrameIcon className="size-9 text-muted" />
                <h3 className="font-display text-3xl">A moment out of focus.</h3>
                <p className="max-w-sm text-sm leading-6 text-muted">{error}</p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div role="status" className="flex min-h-72 flex-col items-center justify-center gap-3 px-5 text-center">
                <SearchIcon className="mb-2 size-8 text-muted" />
                <h3 className="font-display text-3xl">No photographers found.</h3>
                <p className="max-w-full text-sm break-words text-muted">Try a different author name.</p>
                {search && <button type="button" onClick={() => setSearch('')} className="mt-2 min-h-11 cursor-pointer rounded-full bg-forest px-5 text-sm text-white hover:bg-forest/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest">Clear search</button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={photos.indexOf(photo)}
                    isFavourite={favourites.includes(photo.id)}
                    onToggle={toggleFavourite}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="flex flex-col justify-between gap-2 border-t border-line py-7 text-[11px] text-muted sm:flex-row">
          <p>Photography via <a href="https://picsum.photos" target="_blank" rel="noreferrer" className="rounded-sm underline decoration-line underline-offset-4 hover:text-forest focus-visible:outline-2 focus-visible:outline-forest">Lorem Picsum</a></p>
          <p>Made for a second look.</p>
        </footer>
      </div>
    </div>
  );
}
