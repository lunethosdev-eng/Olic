import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function LinkDeviceScreen() {
  const code = 'PK-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  return (
    <View style={s.root}>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Volver</Text></Pressable>
      <Text style={s.title}>Vincular dispositivo</Text>
      <Text style={s.sub}>En el otro dispositivo abre Pokke → Settings → Vincular dispositivo y escanea el código o escríbelo.</Text>
      <View style={s.qrBox}>
        <Text style={s.qrPlaceholder}>QR</Text>
        <Text style={s.code}>{code}</Text>
      </View>
      <Text style={s.hint}>Código único de esta sesión (real se generará con backend).</Text>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', padding: 24, paddingTop: 56 },
  back: { color: '#aaa', marginBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sub: { color: '#888', marginBottom: 24, lineHeight: 20 },
  qrBox: { alignSelf: 'center', width: 220, height: 220, backgroundColor: '#111', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  qrPlaceholder: { color: '#444', fontSize: 48, fontWeight: '800' },
  code: { color: '#fff', marginTop: 12, fontSize: 20, letterSpacing: 2, fontWeight: '700' },
  hint: { color: '#666', textAlign: 'center', marginTop: 20, fontSize: 13 },
});
