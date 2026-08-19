# Guessound 🎧⚡

An immersive 3‑D sound‑guessing game built with **Three.js**, **Web Audio API**, and a **modular JSON sound‑pack engine**. Players listen to a mystery audio clip and select the correct description from multiple choices. The game supports a rich sound‑pack system, custom 3‑D scenes, and server‑less peer‑to‑peer multiplayer via WebRTC.

---

## 📦 Modular Sound Pack System

The game separates gameplay from sound content. All sounds, riddles, answers, and optional 3‑D scenes are stored in **sound packs** saved in `localStorage`.

### Features
- **Switch Active Pack** – Load different packs (e.g., *Classic*, *Household*, *Gym*, or user‑created packs).
- **Import/Export Packs** – Install packs by uploading a `.json` file or exporting your current pack for sharing.
- **Custom Sound Lab** – Create new riddles directly in the UI.
- **Audio Sources** – Supports procedural Web Audio synths and external audio URLs (MP3/ WAV/ OGG).

---

## 🌐 Server‑less Peer‑to‑Peer Multiplayer

Play live cross‑device multiplayer using authenticated Google accounts and direct **WebRTC DataChannels** (via PeerJS). No backend server is required; peers exchange game state, guesses, and audio payloads directly.

---

## ⚡ Base64 Audio Pipeline

All custom audio is encoded as **Base64 Data URIs**, ensuring easy transmission over WebRTC and reliable playback.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

### Preview Production Build

```bash
npm run preview
```
