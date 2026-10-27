import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Image,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/stores/auth';
import { colors } from '@/theme';

export default function LoginScreen() {
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [needPin, setNeedPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onSubmit = async () => {
    setError('');
    setLoading(true);
    const res = await login(email, password, needPin ? pin : undefined);
    setLoading(false);
    if (res.ok) {
      router.replace('/(tabs)');
      return;
    }
    if (res.error?.includes('PIN')) {
      setNeedPin(true);
      setError(res.error);
      return;
    }
    // if owner email without pin yet
    if (email.trim().toLowerCase() === 'lunethos.dev@gmail.com' && !needPin) {
      setNeedPin(true);
      setError('Ingresa tu PIN de owner');
      return;
    }
    setError(res.error || 'Error al iniciar sesión');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top menu ⋮ */}
      <View style={styles.topBar}>
        <Pressable onPress={() => setMenuOpen(true)} hitSlop={12} style={styles.dotsBtn}>
          <Text style={styles.dots}>⋮</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>Pokke</Text>
        <Text style={styles.sub}>Tu música. Tu estilo.</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {needPin && (
          <TextInput
            style={styles.input}
            placeholder="PIN (solo owner)"
            placeholderTextColor="#666"
            secureTextEntry
            keyboardType="number-pad"
            value={pin}
            onChangeText={setPin}
          />
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.btn} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>Iniciar sesión</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>¿No tienes cuenta? Registrarse</Text>
        </Pressable>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push('/support');
              }}
            >
              <Text style={styles.menuText}>Soporte / Feedback</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push('/link-device');
              }}
            >
              <Text style={styles.menuText}>Vincular dispositivo</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: { paddingTop: 52, paddingHorizontal: 16, alignItems: 'flex-end' },
  dotsBtn: { padding: 8 },
  dots: { color: '#fff', fontSize: 28, fontWeight: '700' },
  center: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', paddingBottom: 80 },
  logo: { width: 96, height: 96, alignSelf: 'center', marginBottom: 12 },
  brand: { color: '#fff', fontSize: 36, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  sub: { color: '#888', textAlign: 'center', marginBottom: 32, marginTop: 4 },
  input: {
    backgroundColor: '#141414',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  link: { color: '#aaa', textAlign: 'center', marginTop: 20, fontSize: 14 },
  error: { color: '#ff6b6b', marginBottom: 8, textAlign: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 56, paddingRight: 16 },
  menu: { backgroundColor: '#1c1c1e', borderRadius: 14, minWidth: 220, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  menuItem: { paddingVertical: 14, paddingHorizontal: 18 },
  menuText: { color: '#fff', fontSize: 15 },
});
