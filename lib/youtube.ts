import 'server-only';

import {
  WORKSHOP_VIDEOS,
  YOUTUBE_PLAYLIST_ID,
  type WorkshopVideo,
} from '@/constants/workshopVideos';

// Playlist feed — returns ONLY the videos in the "AzerII scale models" playlist.
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${YOUTUBE_PLAYLIST_ID}`;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function match(block: string, tag: string): string | undefined {
  return block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1];
}

/**
 * Fetch the latest videos from the YouTube channel RSS feed (no API key).
 * Cached with ISR revalidation; falls back to demo data on any failure.
 */
export async function getWorkshopVideos(limit = 8): Promise<WorkshopVideo[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 }, // refresh hourly
      headers: { 'user-agent': 'AZERII/1.0' },
    });
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const xml = await res.text();

    const videos = xml
      .split('<entry>')
      .slice(1)
      .map((entry): WorkshopVideo | null => {
        const id = match(entry, 'yt:videoId');
        if (!id) return null;
        const title = decodeEntities(match(entry, 'title') ?? '');
        const author = decodeEntities(match(entry, 'name') ?? 'Ilgar Ismailov');
        return {
          id,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          author,
          caption: title,
          href: `https://www.youtube.com/watch?v=${id}`,
          published: match(entry, 'published'),
        };
      })
      .filter((v): v is WorkshopVideo => v !== null);

    return videos.length > 0 ? videos.slice(0, limit) : WORKSHOP_VIDEOS;
  } catch (err) {
    console.error('[youtube] RSS feed failed, using demo data:', err);
    return WORKSHOP_VIDEOS;
  }
}
