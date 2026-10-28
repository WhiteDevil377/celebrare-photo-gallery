import { useEffect, useState } from 'react';

export const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30';

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal });
        // fetch does not reject automatically for HTTP errors such as 404 or 500.
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected response format');

        if (!controller.signal.aborted) setPhotos(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("We couldn't load the photos. Please refresh the page to try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPhotos();
    // Prevent stale requests from updating state after unmount (including Strict Mode).
    return () => controller.abort();
  }, []);

  return { photos, loading, error };
}
