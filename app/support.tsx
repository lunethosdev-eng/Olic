import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function SupportScreen() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <View style={s.root}>
      <Pressable onPress={() => router.back()}><Text style={s.back}>← Volver</Text></Pressable>
      <Text style={s.title}>Soporte / Feedback</Text>
      <Text style={s.sub}>Tu mensaje se queda dentro de Pokke. Te responderemos al correo.</Text>
      <TextInput style={s.input} placeholder="Tu correo" placeholderTextColor="#666" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={[s.input, { height: 140, textAlignVertical: 'top' }]} placeholder="Describe el problema..." placeholderTextColor="#666" multiline value={msg} onChangeText={setMsg} />
      <Pressable
        style={s.btn}
        onPress={() => {
          if (!email || !msg) return Alert.alert('Completa los campos');
          Alert.alert('Enviado', 'Gracias. Revisaremos tu mensaje.');
          router.back();
        }}
      >
        <Text style={s.btnText}>Enviar</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', padding: 24, paddingTop: 56 },
  back: { color: '#aaa', marginBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  sub: { color: '#888', marginBottom: 20 },
  input: { backgroundColor: '#141414', borderRadius: 14, padding: 14, color: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  btn: { backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: '700' },
});
