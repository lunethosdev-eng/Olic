import { ukiyo } from './supabase';
import type { Track } from '@/stores/player';

/** Fetch recent / sample tracks from Ukiyo catalog */
export async function fetchTracks(limit = 20): Promise<Track[]> {
  const { data, error } = await ukiyo
    .from('songs')
    .select(
      'id, title, artist, album, duration_seconds, cover_url, animated_cover_url, audio_url, lyrics_text'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('Ukiyo fetchTracks error', error.message);
    // Fallback demo data (real songs we already know exist)
    return DEMO_TRACKS;
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    album: row.album,
    duration_seconds: row.duration_seconds ?? 180,
    cover_url: row.cover_url,
    animated_cover_url: row.animated_cover_url,
    audio_url: row.audio_url,
    lyrics_text: row.lyrics_text,
  }));
}

const DEMO_TRACKS: Track[] = [
  {
    id: 'bab884a8-99bf-4263-839b-161b46be9cbc',
    title: 'From The Start',
    artist: 'Laufey',
    album: 'From The Start - Single',
    duration_seconds: 180,
    cover_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/covers/lSD_L-xic9o.jpg',
    animated_cover_url:
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8b/8b/20/8b8b2083-c8a3-a1a6-1f9e-a4da5bf45d5d/197188679637.jpg/1400x1400bb.m4v',
    audio_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/audio/lSD_L-xic9o.mp3',
    lyrics_text:
      '[00:10.00] Letras de From The Start por Laufey\n[00:30.00] Sincronización Seki Automática',
  },
  {
    id: '8b426bea-a642-4697-b942-b451efa50605',
    title: 'Falling Behind',
    artist: 'Laufey',
    album: 'Everything I Know About Love',
    duration_seconds: 180,
    cover_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/covers/Ej8RhiSv2-4.jpg',
    animated_cover_url:
      'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a4/e7/5e/a4e75e8c-2875-4576-12d8-ac8d2f865815/5056167175841_1.jpg/1400x1400bb.m4v',
    audio_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/audio/Ej8RhiSv2-4.mp3',
    lyrics_text:
      '[00:10.00] Letras de Falling Behind por Laufey\n[00:30.00] Sincronización Seki Automática',
  },
  {
    id: '66e040c4-a32c-4b48-b229-7c4022b84b96',
    title: 'Valentine',
    artist: 'Laufey',
    album: 'Valentine - Single',
    duration_seconds: 180,
    cover_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/covers/tyKu0uZS86Q.jpg',
    animated_cover_url:
      'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ed/76/5e/ed765e68-3e35-eeb0-5760-68af76e6d455/5056167170075_1.jpg/1400x1400bb.m4v',
    audio_url:
      'https://esjoifsjljvymttinyhj.supabase.co/storage/v1/object/public/audio/tyKu0uZS86Q.mp3',
    lyrics_text:
      '[00:10.00] Letras de Valentine por Laufey\n[00:30.00] Sincronización Seki Automática',
  },
];
