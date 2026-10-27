import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import type { Track } from '@/stores/player';

const POKKE_DIR = `${FileSystem.documentDirectory}Pokke/`;

async function ensurePokkeDir() {
  const info = await FileSystem.getInfoAsync(POKKE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(POKKE_DIR, { intermediates: true });
  }
  return POKKE_DIR;
}

export type DownloadTarget = 'app' | 'device';

export async function downloadTrack(
  track: Track,
  target: DownloadTarget,
  onProgress?: (pct: number) => void
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const safeName = `${track.artist} - ${track.title}`
      .replace(/[^\w\s\-.]/g, '')
      .slice(0, 80);
    const filename = `${safeName}.mp3`;

    let dest: string;
    if (target === 'app') {
      await ensurePokkeDir();
      dest = `${POKKE_DIR}${filename}`;
    } else {
      // Temporary then save to media library / Music
      dest = `${FileSystem.cacheDirectory}${filename}`;
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      track.audio_url,
      dest,
      {},
      (progress) => {
        if (progress.totalBytesExpectedToWrite > 0) {
          const pct =
            progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          onProgress?.(pct);
        }
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result?.uri) throw new Error('Download failed');

    // Also download cover + lyrics if present
    if (track.cover_url) {
      const coverDest = result.uri.replace(/\.mp3$/, '.jpg');
      await FileSystem.downloadAsync(track.cover_url, coverDest).catch(() => null);
    }
    if (track.lyrics_text) {
      const lyricsDest = result.uri.replace(/\.mp3$/, '.lrc');
      await FileSystem.writeAsStringAsync(lyricsDest, track.lyrics_text);
    }
    if (track.animated_cover_url) {
      const animDest = result.uri.replace(/\.mp3$/, '_animated.m4v');
      await FileSystem.downloadAsync(track.animated_cover_url, animDest).catch(
        () => null
      );
    }

    if (target === 'device' && Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.createAssetAsync(result.uri);
        // Optionally create album "Pokke"
        try {
          const asset = await MediaLibrary.createAssetAsync(result.uri);
          const album = await MediaLibrary.getAlbumAsync('Pokke');
          if (album) {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          } else {
            await MediaLibrary.createAlbumAsync('Pokke', asset, false);
          }
        } catch {
          // ignore album errors
        }
      }
    }

    return { success: true, path: result.uri };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
}
