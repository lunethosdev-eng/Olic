import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/stores/auth';

const SAMPLE_ARTISTS = [
  'Laufey', 'Taylor Swift', 'The Weeknd', 'Bad Bunny', 'Billie Eilish',
  'Rosalía', 'Arctic Monkeys', 'SZA', 'Kendrick Lamar', 'Feid',
  'NewJeans', 'Ado', 'Yoasobi', 'Her\'s', 'Frank Ocean',
];

export default function RegisterScreen() {
  const register = useAuth((s) => s.register);
  const setLikedArtists = useAuth((s) => s.setLikedArtists);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (a: string) => {
    setSelected((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const onCreate = async () => {
    setError('');
    setLoading(true);
    const res = await register({ email, password, username });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Error');
      return;
    }
    setStep(2);
  };

  const onFinishArtists = () => {
    setLikedArtists(selected);
    router.replace('/(tabs)');
  };

  if (step === 2) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>¿Qué artistas te gustan?</Text>
        <Text style={styles.sub}>Elige al menos uno, o “Me gustan todos”</Text>
        <ScrollView contentContainerStyle={styles.chips}>
          {SAMPLE_ARTISTS.map((a) => {
            const on = selected.includes(a);
            return (
              <Pressable
                key={a}
                onPress={() => toggle(a)}
                style={[styles.chip, on && styles.chipOn]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{a}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          style={styles.btnGhost}
          onPress={() => {
            setLikedArtists(SAMPLE_ARTISTS);
            router.replace('/(tabs)');
          }}
        >
          <Text style={styles.btnGhostText}>Me gustan todos</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, selected.length === 0 && { opacity: 0.4 }]}
          disabled={selected.length === 0}
          onPress={onFinishArtists}
        >
          <Text style={styles.btnText}>Continuar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Crear cuenta</Text>
      <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#666" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Correo" placeholderTextColor="#666" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#666" secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.btn} onPress={onCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>Siguiente</Text>}
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', paddingHorizontal: 24, paddingTop: 72 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  sub: { color: '#888', marginBottom: 20 },
  input: {
    backgroundColor: '#141414', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    color: '#fff', fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222',
  },
  btn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  btnGhost: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  btnGhostText: { color: '#aaa', fontWeight: '600' },
  link: { color: '#aaa', textAlign: 'center', marginTop: 20 },
  error: { color: '#ff6b6b', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 24 },
  chip: { borderRadius: 20, borderWidth: 1, borderColor: '#333', paddingHorizontal: 14, paddingVertical: 10 },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipText: { color: '#ccc', fontSize: 14 },
  chipTextOn: { color: '#000', fontWeight: '700' },
});
