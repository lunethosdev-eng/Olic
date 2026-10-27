import { View, Text, StyleSheet, Switch, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/stores/auth';
import { useSettings } from '@/stores/settings';

export default function SettingsScreen() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const settings = useSettings();

  const isStaff = user?.badge === 'owner' || user?.badge === 'admin';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </Pressable>
        <Text style={s.title}>Ajustes</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {user && (
          <View style={s.card}>
            <Text style={s.cardTitle}>{user.displayName || user.username}</Text>
            <Text style={s.muted}>@{user.username} · {user.badge || 'user'}</Text>
          </View>
        )}

        <Text style={s.section}>Cuenta</Text>
        <Pressable style={s.row} onPress={() => router.push('/link-device')}>
          <Text style={s.rowText}>Vincular dispositivo</Text>
          <Text style={s.chev}>›</Text>
        </Pressable>
        <Pressable style={s.row} onPress={() => router.push('/support')}>
          <Text style={s.rowText}>Soporte / Feedback</Text>
          <Text style={s.chev}>›</Text>
        </Pressable>

        {isStaff && (
          <>
            <Text style={s.section}>Admin</Text>
            <Pressable style={[s.row, s.rowAdmin]} onPress={() => router.push('/admin')}>
              <Text style={[s.rowText, { color: '#fff' }]}>Admin Panel</Text>
              <Text style={s.chev}>›</Text>
            </Pressable>
          </>
        )}

        <Text style={s.section}>Experimental</Text>
        <View style={s.row}>
          <Text style={s.rowText}>Liquid Glass</Text>
          <Switch
            value={!!settings.liquidGlass}
            onValueChange={(v) => settings.set?.({ liquidGlass: v })}
            trackColor={{ true: '#fff', false: '#333' }}
          />
        </View>
        <View style={s.row}>
          <Text style={s.rowText}>Cover animado auto</Text>
          <Switch
            value={!!settings.autoAnimatedCover}
            onValueChange={(v) => settings.set?.({ autoAnimatedCover: v })}
            trackColor={{ true: '#fff', false: '#333' }}
          />
        </View>

        <Pressable
          style={[s.row, { marginTop: 24 }]}
          onPress={async () => {
            await logout();
            router.replace('/(auth)/login');
          }}
        >
          <Text style={[s.rowText, { color: '#ff6b6b' }]}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  back: { color: '#fff', fontSize: 24, width: 32 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  card: { backgroundColor: '#141414', borderRadius: 14, padding: 16, marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  muted: { color: '#888', marginTop: 4 },
  section: { color: '#666', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 8, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#141414', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8,
  },
  rowAdmin: { borderWidth: 1, borderColor: '#333' },
  rowText: { color: '#eee', fontSize: 15 },
  chev: { color: '#555', fontSize: 22 },
});
