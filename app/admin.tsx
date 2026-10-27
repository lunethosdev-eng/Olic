import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  FlatList, Image, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/stores/auth';
import { ukiyo, kokoro } from '@/lib/supabase';

type SongRow = {
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  cover_url?: string | null;
  animated_cover_url?: string | null;
  album_art?: string | null;
};

export default function AdminPanel() {
  const user = useAuth((s) => s.user);
  const grantBadge = useAuth((s) => s.grantBadge);
  const [tab, setTab] = useState<'badges' | 'covers'>('covers');
  const [target, setTarget] = useState('');
  const [badge, setBadge] = useState<'admin' | 'exclusive' | 'verified'>('admin');
  const [songs, setSongs] = useState<SongRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState<Record<string, string>>({});
  const [animUrl, setAnimUrl] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || (user.badge !== 'owner' && user.badge !== 'admin')) {
      Alert.alert('Acceso denegado', 'Solo owner/admin');
      router.back();
    }
  }, [user]);

  const loadMissingCovers = async () => {
    setLoading(true);
    try {
      if (!ukiyo) {
        setSongs([]);
        return;
      }
      // Try common table names
      let data: any[] | null = null;
      for (const table of ['songs', 'tracks', 'music']) {
        const res = await ukiyo.from(table).select('*').limit(80);
        if (!res.error && res.data) {
          data = res.data;
          break;
        }
      }
      const rows = (data || []).map((r: any) => ({
        id: String(r.id ?? r.uuid ?? Math.random()),
        title: r.title || r.name || r.song_name || 'Sin título',
        artist: r.artist || r.artist_name || r.artists || '',
        cover_url: r.cover_url || r.album_art || r.image || r.thumbnail || null,
        animated_cover_url: r.animated_cover_url || r.animated_cover || null,
      }));
      // prioritize missing covers
      rows.sort((a, b) => {
        const am = !a.cover_url && !a.animated_cover_url ? 0 : 1;
        const bm = !b.cover_url && !b.animated_cover_url ? 0 : 1;
        return am - bm;
      });
      setSongs(rows);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'covers') loadMissingCovers();
  }, [tab]);

  const saveCover = async (song: SongRow, kind: 'static' | 'animated') => {
    const url = kind === 'static' ? coverUrl[song.id] : animUrl[song.id];
    if (!url?.trim()) {
      Alert.alert('Pega un link de imagen/GIF/MP4/WebM');
      return;
    }
    if (!ukiyo) {
      Alert.alert('Ukiyo no conectado');
      return;
    }
    const payload =
      kind === 'static'
        ? { cover_url: url.trim() }
        : { animated_cover_url: url.trim() };
    // try update on songs
    const { error } = await ukiyo.from('songs').update(payload).eq('id', song.id);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    Alert.alert('Guardado', `${kind} cover actualizado`);
    loadMissingCovers();
  };

  const onGrant = async () => {
    if (!target.trim()) return;
    const ok = await grantBadge(target.trim(), badge);
    Alert.alert(ok ? 'Listo' : 'Error', ok ? `Badge ${badge} → ${target}` : 'No se pudo');
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </Pressable>
        <Text style={s.title}>Admin Panel</Text>
        <Text style={s.badge}>{user?.badge?.toUpperCase()}</Text>
      </View>

      <View style={s.tabs}>
        <Pressable style={[s.tab, tab === 'covers' && s.tabOn]} onPress={() => setTab('covers')}>
          <Text style={[s.tabText, tab === 'covers' && s.tabTextOn]}>Covers faltantes</Text>
        </Pressable>
        <Pressable style={[s.tab, tab === 'badges' && s.tabOn]} onPress={() => setTab('badges')}>
          <Text style={[s.tabText, tab === 'badges' && s.tabTextOn]}>Badges</Text>
        </Pressable>
      </View>

      {tab === 'badges' && (
        <View style={s.section}>
          <Text style={s.label}>Username o ID</Text>
          <TextInput
            style={s.input}
            placeholder="usuario"
            placeholderTextColor="#666"
            value={target}
            onChangeText={setTarget}
            autoCapitalize="none"
          />
          <View style={s.row}>
            {(['admin', 'exclusive', 'verified'] as const).map((b) => (
              <Pressable
                key={b}
                style={[s.chip, badge === b && s.chipOn]}
                onPress={() => setBadge(b)}
              >
                <Text style={[s.chipText, badge === b && s.chipTextOn]}>{b}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={s.btn} onPress={onGrant}>
            <Text style={s.btnText}>Asignar badge (tiempo real)</Text>
          </Pressable>
          <Text style={s.hint}>
            Owner puede dar admin / exclusive / verified sin redeploy. Se sincroniza vía Kokoro.
          </Text>
        </View>
      )}

      {tab === 'covers' && (
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={songs}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              ListEmptyComponent={
                <Text style={s.hint}>No hay canciones o Ukiyo no respondió.</Text>
              }
              renderItem={({ item }) => {
                const missing = !item.cover_url && !item.animated_cover_url;
                return (
                  <View style={[s.card, missing && s.cardWarn]}>
                    <View style={s.cardRow}>
                      {item.cover_url ? (
                        <Image source={{ uri: item.cover_url }} style={s.thumb} />
                      ) : (
                        <View style={[s.thumb, s.thumbEmpty]}>
                          <Text style={{ color: '#666' }}>?</Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={s.songTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={s.songArtist} numberOfLines={1}>
                          {item.artist}
                        </Text>
                        <Text style={s.meta}>
                          static: {item.cover_url ? '✓' : '✗'} · anim: {item.animated_cover_url ? '✓' : '✗'}
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      style={s.input}
                      placeholder="URL cover estático (jpg/png/webp)"
                      placeholderTextColor="#555"
                      value={coverUrl[item.id] || ''}
                      onChangeText={(t) => setCoverUrl((p) => ({ ...p, [item.id]: t }))}
                      autoCapitalize="none"
                    />
                    <Pressable style={s.btnSm} onPress={() => saveCover(item, 'static')}>
                      <Text style={s.btnSmText}>Guardar estático</Text>
                    </Pressable>
                    <TextInput
                      style={s.input}
                      placeholder="URL cover animado (gif/mp4/webm)"
                      placeholderTextColor="#555"
                      value={animUrl[item.id] || ''}
                      onChangeText={(t) => setAnimUrl((p) => ({ ...p, [item.id]: t }))}
                      autoCapitalize="none"
                    />
                    <Pressable style={s.btnSm} onPress={() => saveCover(item, 'animated')}>
                      <Text style={s.btnSmText}>Guardar animado</Text>
                    </Pressable>
                  </View>
                );
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  back: { color: '#fff', fontSize: 24, width: 32 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', flex: 1 },
  badge: { color: '#000', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: '800', fontSize: 11 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 8, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#141414', alignItems: 'center' },
  tabOn: { backgroundColor: '#fff' },
  tabText: { color: '#aaa', fontWeight: '600' },
  tabTextOn: { color: '#000' },
  section: { padding: 16 },
  label: { color: '#888', marginBottom: 6 },
  input: {
    backgroundColor: '#141414', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12,
    color: '#fff', marginBottom: 8, borderWidth: 1, borderColor: '#222',
  },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { color: '#ccc', fontSize: 13 },
  chipTextOn: { color: '#000', fontWeight: '700' },
  btn: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '700' },
  btnSm: { backgroundColor: '#222', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginBottom: 10 },
  btnSmText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  hint: { color: '#666', marginTop: 12, fontSize: 13, lineHeight: 18 },
  card: { backgroundColor: '#111', borderRadius: 14, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  cardWarn: { borderColor: '#553' },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'center' },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: '#222' },
  thumbEmpty: { alignItems: 'center', justifyContent: 'center' },
  songTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  songArtist: { color: '#888', fontSize: 13 },
  meta: { color: '#555', fontSize: 11, marginTop: 2 },
});
