# Pokke (repo: Olic)

Premium adaptive music app — phone / tablet / desktop / TV / web.

## Fix del build (log que me pasaste)

El Actions falló por:
```
Dependencies lock file is not found ... package-lock.json
```

**Ya está corregido:**
- `package-lock.json` incluido
- Workflow **sin Expo token / EAS** → usa `expo prebuild` + Gradle `assembleRelease`
- APK se sube automáticamente como artifact `pokke-apk`

Push a `main` o dispara el workflow → el APK aparece en **Actions → Artifacts**.

## Audios de notificación

Incluidos en `assets/sounds/`:
- bubble-pop, marimba, twinkle, joyous-chime, message, out-of-nowhere
- variantes: bubble-pop-alt, marimba-bloop, joyous-chime-full, twinkle-alert

Registrados en `app.json` (expo-notifications) y usables con `playNotifSound()` de `lib/notifications.ts`.

## Qué trae esta versión

- Full Player + Mini Player + progress bar
- Audio real (expo-av) + notificaciones
- Karaoke lyrics (LRC + auto-scroll)
- Descargas reales (app / álbum Pokke)
- Nav compacta al scroll + gota de agua en Search
- Auth store Kokoro + perfiles
- Chats / Stories / Mapa (flags experimentales)
- GitHub Actions → APK automático
- Todos los sonidos de notificación

```bash
npm install
npx expo start
```
