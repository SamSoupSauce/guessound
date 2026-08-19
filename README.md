# Sexercise: Guess The Noise 🎧⚡ (Three.js Modular Edition)

An interactive 3D audio-visual mystery game built with **Three.js**, **Web Audio API**, and a **Modular JSON Sound Pack Engine** backed by `localStorage`.

---

## 📦 Modular Sound Pack System (`localStorage`)

The game now completely decouples game mechanics from sound content. All sounds, options, answers, 3D scenes, and trivia are loaded dynamically from **Sound Packs** stored in `localStorage`.

### 1. Sound Pack Features
- **Switch Active Pack**: Seamlessly swap between installed sound packs (e.g. *Sexercise Original*, *Kitchen & ASMR*, *Gym & Action Mayhem*, or custom user packs).
- **Import JSON Packs**: Upload `.json` files or paste JSON directly in the browser to install community packs.
- **Export JSON Packs**: Download packs as `.json` or copy formatted JSON to the clipboard.
- **Custom Sound Lab**: Create and append custom sound riddles directly into any pack.
- **Audio Support**: Supports procedural Web Audio synthesizers (`panting_groan`, `flip_flops`, `stubbed_toe`, `squeaky_duck`, `bacon_sizzle`, `massage_gun`, `bike_pump`, `band_snap`, `mac_cheese`, `dog_taps`) as well as external audio URLs (`mp3`, `wav`, `ogg`).

---

### 2. JSON Sound Pack Schema

```json
{
  "id": "my_custom_pack",
  "name": "My Custom Foley Pack",
  "description": "Hilarious deception sound riddles",
  "author": "Your Name",
  "version": "1.0.0",
  "icon": "📦",
  "categories": {
    "workoutVsDaily": {
      "id": "workoutVsDaily",
      "name": "Workout vs Daily Life",
      "color": "#FF2E93",
      "icon": "💪"
    }
  },
  "sounds": [
    {
      "id": "sound_01",
      "title": "Violent Rattling & Thumping",
      "soundHint": "High-velocity rhythmic vibration...",
      "category": "workoutVsDaily",
      "synthPreset": "massage_gun",
      "audioUrl": null,
      "options": [
        "Unbalanced Washing Machine on Spin Cycle",
        "Modified V8 Dragster Idling",
        "Jackhammer Breaking Concrete",
        "Heavy Duty Paint Shaker"
      ],
      "correctIndex": 0,
      "revealTitle": "Washing Machine on 1400 RPM Spin Cycle!",
      "revealExplanation": "A single wet bath towel got trapped on one side of the drum.",
      "funFact": "Unbalanced washing machines can generate centrifugal forces exceeding 300 Gs.",
      "sceneModel": "massage_gun",
      "difficulty": 1
    }
  ]
}
```

## 🌐 Serverless Peer-to-Peer (P2P) WebRTC Multiplayer

The game features live cross-device multiplayer powered by authenticated Google Accounts and direct **browser-to-browser WebRTC DataChannels (`RTCDataChannel` via PeerJS)** with zero intermediary server:

### 1. Direct Peer-to-Peer Architecture (`src/network/lobbyClient.js`)
- **Zero Intermediary Server**: All gameplay state, turn transitions, guesses, and Base64 audio payloads stream directly peer-to-peer between players' browsers.
- **Host Authoritative Peer**: The room host creates a 6-character room code (e.g. `STEAM-4821`) and coordinates team assignments and round scoring.
- **Encrypted WebRTC DataChannels**: Remote peers connect directly via WebRTC data channels with public STUN signaling (`stun:stun.l.google.com:19302`).
- **Local Mesh Offline Fallback**: Same-device multi-tab testing automatically synchronizes over the browser's native `BroadcastChannel('sexercise_p2p_channel')`.

---

## ⚡ Base64 Audio Encoding Pipeline

All custom audio is standardized as self-contained **Base64 Data URIs** (`data:audio/...;base64,...`):
- **Audio File Uploads**: MP3, WAV, OGG, M4A files are converted directly via `FileReader.readAsDataURL()`.
- **Web Audio Links**: External audio URLs are fetched as blobs and auto-encoded into Base64 strings.
- **P2P Multiplayer Distribution**: Base64 audio payloads are transmitted directly between browsers over WebRTC DataChannels.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

### Preview Production Build
```bash
npm run preview
```
