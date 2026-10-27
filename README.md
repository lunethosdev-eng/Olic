# Pokke (repo: Olic)

**Pokke** — Premium adaptive music app  
Phone · Tablet · Desktop · Android TV · Web

## Qué incluye esta versión

### Core
- [x] Expo + TypeScript + Expo Router
- [x] Design system (Material 3 Expressive + Liquid Glass tokens)
- [x] `GlassView` (blur real solo si experimental ON)
- [x] Floating nav redondeada
- [x] **Scroll → nav compacta** + **efecto gota de agua en Search**
- [x] Browse se oculta al compactar (4 → 3 tabs)
- [x] Mini Player + Full Player

### Player
- [x] Reproducción real con **expo-av** (background audio)
- [x] Notificaciones multimedia básicas
- [x] Progress bar (referencia)
- [x] Context menu Liquid Glass
- [x] Submenú de descarga (app / dispositivo)
- [x] **Lógica real de descarga** (FileSystem + MediaLibrary + álbum Pokke)
- [x] Cover animado toggle
- [x] **Lyrics karaoke** (parse LRC + auto-scroll + highlight)

### Datos & Auth
- [x] Catálogo Ukiyo (canciones reales)
- [x] Store de auth Kokoro + perfiles
- [x] Settings + flags experimentales

### Experimental (UI lista, flags en Settings)
- [x] Chats (lista demo)
- [x] Stories placeholder
- [x] Mapa placeholder
- [x] Listen Together flag

### CI/CD
- [x] **GitHub Actions** → build APK (`eas.json` + workflow)
- [x] Perfiles EAS: development / preview / production

## Cómo correr

```bash
cd Pokke
npm install
npx expo start
```

Para APK:
1. Crea cuenta Expo y `eas login`
2. Pon `EXPO_TOKEN` en GitHub Secrets
3. Push a `main` o dispara el workflow manualmente

## Estructura importante

```
components/player/   FullPlayer, MiniPlayer, KaraokeLyrics, ProgressBar, ContextMenu
lib/audio.ts         expo-av + notificaciones
lib/download.ts      descargas reales
lib/music.ts         Ukiyo
stores/              player, settings, auth, scroll
.github/workflows/   build-apk.yml
```
