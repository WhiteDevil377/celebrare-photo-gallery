import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import Gallery from './Gallery';
import { PHOTOS_URL } from '../hooks/useFetchPhotos';
import { FAVOURITES_KEY } from '../reducers/favouritesReducer';

// Only tests use fixtures. The application always requests the real Picsum API.
const photos = Array.from({ length: 30 }, (_, index) => ({
  id: String(index),
  author: index === 0 ? 'Ada Lovelace' : 'Grace Hopper',
}));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => photos,
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('the gallery', () => {
  it('shows a loading status until the API responds, then displays all 30 photos', async () => {
    let resolveRequest;
    fetch.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<Gallery />);
    expect(screen.getByText('Finding a little inspiration...')).toBeInTheDocument();

    resolveRequest({ ok: true, json: async () => photos });
    expect(await screen.findAllByRole('article')).toHaveLength(30);
    expect(screen.queryByText('Finding a little inspiration...')).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(PHOTOS_URL, { signal: expect.any(AbortSignal) });
  });

  it('filters authors immediately, ignoring case and outer whitespace, without refetching', async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findAllByRole('article');
    await user.type(screen.getByRole('searchbox', { name: 'Search by author' }), '  ADA  ');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('shows an empty search state and restores the photos when search is cleared', async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await screen.findAllByRole('article');
    await user.type(screen.getByRole('searchbox'), 'no such author');
    expect(screen.getByText('No photographers found.')).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getAllByRole('article')).toHaveLength(30);
  });

  it('toggles favourites, restores them after remount, and persists removal', async () => {
    const user = userEvent.setup();
    const view = render(<Gallery />);
    await user.click(await screen.findByRole('button', { name: 'Add to favourites: photo 0 by Ada Lovelace' }));
    expect(screen.getByRole('button', { name: 'Remove from favourites: photo 0 by Ada Lovelace' })).toHaveAttribute('aria-pressed', 'true');
    expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY))).toEqual(['0']);

    view.unmount();
    render(<Gallery />);
    const saved = await screen.findByRole('button', { name: 'Remove from favourites: photo 0 by Ada Lovelace' });
    expect(saved).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('1 saved')).toBeInTheDocument();
    await user.click(saved);
    expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY))).toEqual([]);
    expect(screen.getByText('0 saved')).toBeInTheDocument();
  });

  it('keeps a favourite selected when it is hidden by search and shown again', async () => {
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(await screen.findByRole('button', { name: 'Add to favourites: photo 0 by Ada Lovelace' }));
    const search = screen.getByRole('searchbox');
    await user.type(search, 'Grace');
    expect(screen.queryByRole('button', { name: /photo 0 by Ada/ })).not.toBeInTheDocument();
    await user.clear(search);
    expect(screen.getByRole('button', { name: 'Remove from favourites: photo 0 by Ada Lovelace' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('recovers from malformed saved data', async () => {
    localStorage.setItem(FAVOURITES_KEY, '{broken json');
    render(<Gallery />);
    expect(await screen.findAllByRole('article')).toHaveLength(30);
    expect(screen.getByText('0 saved')).toBeInTheDocument();
  });

  it('keeps toggling hearts when localStorage is unavailable and explains the persistence limit', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    const user = userEvent.setup();
    render(<Gallery />);
    await user.click(await screen.findByRole('button', { name: 'Add to favourites: photo 0 by Ada Lovelace' }));
    expect(screen.getByText(/Your browser couldn't save favourites/)).toBeInTheDocument();
    expect(screen.getByText('1 saved')).toBeInTheDocument();
  });

  it.each([
    ['an HTTP error', () => Promise.resolve({ ok: false, status: 500 })],
    ['a network failure', () => Promise.reject(new TypeError('Failed to fetch'))],
    ['an invalid response', () => Promise.resolve({ ok: true, json: async () => ({}) })],
  ])('shows an error instead of photos after %s', async (_, response) => {
    fetch.mockImplementation(response);
    render(<Gallery />);
    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load the photos");
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.queryByText('Finding a little inspiration...')).not.toBeInTheDocument();
  });

  it('aborts the fetch when the component unmounts', async () => {
    fetch.mockReturnValue(new Promise(() => {}));
    const view = render(<Gallery />);
    const signal = fetch.mock.calls[0][1].signal;
    view.unmount();
    expect(signal.aborted).toBe(true);
  });

  it('handles a broken image without removing its author or favourite button', async () => {
    render(<Gallery />);
    const image = await screen.findByAltText('Photograph by Ada Lovelace');
    fireEvent.error(image);
    await waitFor(() => expect(screen.getByText('Photo unavailable')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Add to favourites: photo 0 by Ada Lovelace' })).toBeInTheDocument();
  });
});
