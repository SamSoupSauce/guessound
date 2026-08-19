# Sexercise: Steampunk Foley Mystery — Workspace Rules & Guidelines

## 1. Multiplayer Architecture
- **Serverless Peer-to-Peer (P2P)**: Multiplayer must operate **without an intermediary backend game server** or relay (`src/network/lobbyClient.js`).
- **WebRTC DataChannels & Mesh**: Use direct browser-to-browser WebRTC DataChannels (`RTCDataChannel` via PeerJS) with public STUN servers.
- **Local Fallback**: Synchronize multi-tab/same-device testing over native `BroadcastChannel('sexercise_p2p_channel')`.

## 2. Sound Pack Studio & Lab UX
- **Main Menu Integration**: The Sound Pack Forge lives directly on the Main Menu (`#home-pane-forge`) via mode switcher tabs (`[ 🎙️ PLAY SHOWDOWN ]` / `[ 🧪 PACK FORGE STUDIO 100MB ]`). Do not hide the primary studio in buried secondary sub-modals.
- **Dynamic $N$ Riddles**: Support arbitrary $N$ riddles (stepper input + on-the-fly add/delete in wizard). Never restrict pack creation to rigid chip presets.
- **100 MB Strict Budget**: Enforce a client-side 100 MB max pack storage budget (`MAX_PACK_BYTES = 100 * 1024 * 1024`), validating audio file uploads and Base64 strings with live progress meters.

## 3. UI Layout & Styling Invariants
- **Centered Responsive Layout**: All top-level view screens, cards, and panes must maintain `margin: 0 auto; max-width: 680px; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;`.
- **Viewport Overflow Safety**: `.view-screen` must maintain adequate bottom padding (`padding: 85px 20px 60px; overflow-y: auto;`) so action buttons are never cut off by viewport edges.
- **Header Auth Exclusivity**: The header login button (`btn-google-login-header`) must be strictly hidden when the user is signed in and the profile badge (`user-profile-badge`) is active.

## 4. Theme-Driven 3D Scene Architecture
- **Self-Contained in Themes**: 3D scenes, geometry, alignment, materials, and live frame animations are stored directly within the sound pack / theme definitions (`sceneScript`, `scene3D`, `theme3D`).
- **Dynamic JS Execution**: Support executable JavaScript 3D scene scripts via `ThemeSceneEngine` with full access to `THREE`, `group`, and lifecycle hooks (`update(time, delta, audioVol, freqData, isRevealed)`, `onReveal()`, `dispose()`).
