import { useState } from 'react';
import { FrameIcon, HeartIcon } from './Icons';

export default function PhotoCard({ photo, index, isFavourite, onToggle }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sage">
        {imageFailed ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
            <FrameIcon className="size-7" />
            <span className="text-sm">Photo unavailable</span>
          </div>
        ) : (
          <img
            src={`https://picsum.photos/id/${photo.id}/800/600`}
            alt={`Photograph by ${photo.author}`}
            width="800"
            height="600"
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
          />
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium tracking-widest text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex min-h-18 items-center justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-medium tracking-[0.15em] text-muted uppercase">Behind the lens</p>
          <h3 className="truncate text-sm font-medium text-ink" title={photo.author}>{photo.author}</h3>
        </div>
        <button
          type="button"
          onClick={() => onToggle(photo.id)}
          aria-label={`${isFavourite ? 'Remove from' : 'Add to'} favourites: photo ${photo.id} by ${photo.author}`}
          aria-pressed={isFavourite}
          className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
            isFavourite
              ? 'bg-forest text-white hover:bg-forest/85'
              : 'text-muted hover:bg-sage hover:text-forest'
          }`}
        >
          <HeartIcon className="size-[19px]" filled={isFavourite} />
        </button>
      </div>
    </article>
  );
}
