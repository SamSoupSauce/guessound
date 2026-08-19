import Peer from 'peerjs';
import { isBase64Audio } from '../audio/base64Audio.js';

export class P2PLobbyClient {
  constructor() {
    this.peer = null;
    this.isHostRole = false;
    this.hostConnection = null; // Client's connection to host
    this.peerConnections = new Map(); // Host's map of connected peers (peerId -> DataConnection)
    this.localPlayer = null;
    this.currentLobby = null;
    this.currentLobbyId = null;
    this.listeners = [];
    this.broadcastChannel = null;

    this._initBroadcastChannel();
  }

  _initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('sexercise_p2p_channel');
      this.broadcastChannel.onmessage = (event) => {
        this._handleIncomingP2PMessage(event.data, 'local_broadcast');
      };
    }
  }

  addListener(fn) {
    this.listeners.push(fn);
    if (this.currentLobby) fn(this.currentLobby);
  }

  removeListener(fn) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }

  _notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.currentLobby);
      } catch (e) {
        console.error('P2P Lobby listener error:', e);
      }
    });
  }

  getCurrentLobby() {
    return this.currentLobby;
  }

  isHost() {
    return this.isHostRole;
  }

  generateLobbyID() {
    const prefixes = ['STEAM', 'FOLEY', 'GEAR', 'BRASS', 'CLOCK', 'SONIC'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${num}`;
  }

  /**
   * Host Creates a Serverless P2P Room (WebRTC Host)
   */
  async createLobby(hostUser, pack, teams = [], mode = 'classic') {
    this.localPlayer = hostUser;
    this.isHostRole = true;
    this.currentLobbyId = this.generateLobbyID();

    const teamCount = Math.max(2, teams.length);
    const defaultColors = ['#d4af37', '#00f0ff', '#ff3366', '#00ff88', '#bd00ff', '#ff9900'];
    const teamList = teams.length >= 2
      ? teams
      : Array.from({ length: teamCount }, (_, i) => ({
          id: i,
          name: i === 0 ? `Team ${hostUser.givenName || hostUser.name} ⚙️` : `Team ${i + 1}`,
          color: defaultColors[i % defaultColors.length],
          score: 0,
          captain: i === 0 ? hostUser.name : '',
        }));

    this.currentLobby = {
      id: this.currentLobbyId,
      hostId: hostUser.id,
      hostName: hostUser.name,
      packId: pack.id,
      packName: pack.name,
      mode: mode,
      teams: teamList,
      players: {
        [hostUser.id]: {
          user: hostUser,
          teamId: 0,
          isHost: true,
          isReady: true,
          joinedAt: Date.now(),
        },
      },
      sounds: {},
      game: {
        status: 'WAITING',
        currentRound: 1,
        totalRounds: 6,
        activeTeamIndex: 0,
        broadcastStage: 1,
        selectedOption: -1,
        lastActionTimestamp: Date.now(),
      },
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isP2P: true,
    };

    // Initialize Host PeerJS with room code
    await this._initHostPeer(this.currentLobbyId);
    this._broadcastLobbyState();
    this._notifyListeners();

    return { success: true, lobbyId: this.currentLobbyId, lobby: this.currentLobby };
  }

  _initHostPeer(roomId) {
    return new Promise((resolve) => {
      // Peer ID prefix sanitized
      const peerId = `sexercise_${roomId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      if (this.peer) {
        try {
          this.peer.destroy();
        } catch (e) {}
      }

      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
          ],
        },
      });

      this.peer.on('open', (id) => {
        console.log(`[P2P Host] WebRTC Peer online as room "${roomId}" (PeerID: ${id})`);
        resolve(id);
      });

      this.peer.on('connection', (conn) => {
        console.log(`[P2P Host] Remote Peer connected: ${conn.peer}`);
        this.peerConnections.set(conn.peer, conn);

        conn.on('data', (data) => {
          this._handleIncomingP2PMessage(data, conn.peer);
        });

        conn.on('close', () => {
          console.log(`[P2P Host] Remote Peer disconnected: ${conn.peer}`);
          this.peerConnections.delete(conn.peer);
        });

        // Send current state to newly connected peer immediately
        conn.on('open', () => {
          conn.send({
            type: 'STATE_UPDATE',
            lobby: this.currentLobby,
          });
        });
      });

      this.peer.on('error', (err) => {
        console.warn('[P2P Host] PeerJS connection notice:', err);
        resolve(roomId);
      });

      // Timeout fallback so UI never hangs
      setTimeout(() => resolve(roomId), 1500);
    });
  }

  /**
   * Client Joins a Serverless P2P Room (WebRTC Client)
   */
  async joinLobby(lobbyId, user) {
    this.localPlayer = user;
    this.isHostRole = false;
    const cleanId = lobbyId.trim().toUpperCase();
    this.currentLobbyId = cleanId;

    const hostPeerId = `sexercise_${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
    }

    this.peer = new Peer({
      debug: 1,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      },
    });

    return new Promise((resolve) => {
      this.peer.on('open', () => {
        console.log(`[P2P Client] Connecting to Host "${cleanId}" at ${hostPeerId}...`);
        const conn = this.peer.connect(hostPeerId, { reliable: true });
        this.hostConnection = conn;

        conn.on('open', () => {
          console.log(`[P2P Client] WebRTC Direct DataChannel connected to Host!`);
          conn.send({
            type: 'JOIN_REQUEST',
            user: user,
            lobbyId: cleanId,
          });
        });

        conn.on('data', (data) => {
          this._handleIncomingP2PMessage(data, 'host');
          resolve({ success: true, lobby: this.currentLobby });
        });

        conn.on('error', (err) => {
          console.warn('[P2P Client] Connection error:', err);
        });
      });

      // Fallback: Also broadcast over local channel
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'JOIN_REQUEST',
          user: user,
          lobbyId: cleanId,
        });
      }

      // Timeout resolve so UI proceeds smoothly
      setTimeout(() => {
        if (!this.currentLobby) {
          // Setup optimistic client view
          this.currentLobby = {
            id: cleanId,
            hostId: 'host_peer',
            packName: 'Multiplayer P2P Sound Pack',
            teams: [
              { id: 0, name: 'Team Brass ⚙️', color: '#d4af37', score: 0 },
              { id: 1, name: 'Team Steam ⚡', color: '#00f0ff', score: 0 },
            ],
            players: {
              [user.id]: {
                user: user,
                teamId: 1,
                isHost: false,
                isReady: true,
                joinedAt: Date.now(),
              },
            },
            game: { status: 'WAITING', currentRound: 1, totalRounds: 6 },
            isP2P: true,
          };
          this._notifyListeners();
        }
        resolve({ success: true, lobby: this.currentLobby });
      }, 1800);
    });
  }

  _handleIncomingP2PMessage(msg, senderId) {
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'STATE_UPDATE':
        if (msg.lobby) {
          this.currentLobby = msg.lobby;
          this.currentLobbyId = msg.lobby.id;
          this._notifyListeners();
        }
        break;

      case 'JOIN_REQUEST':
        if (this.isHostRole && this.currentLobby && msg.user) {
          const user = msg.user;
          // Auto-assign to team with fewest members
          const teamCounts = {};
          Object.values(this.currentLobby.players).forEach((p) => {
            teamCounts[p.teamId] = (teamCounts[p.teamId] || 0) + 1;
          });

          let assignedTeam = 0;
          let minCount = 999;
          for (let i = 0; i < this.currentLobby.teams.length; i++) {
            const count = teamCounts[i] || 0;
            if (count < minCount) {
              minCount = count;
              assignedTeam = i;
            }
          }

          this.currentLobby.players[user.id] = {
            user: user,
            teamId: assignedTeam,
            isHost: false,
            isReady: true,
            joinedAt: Date.now(),
          };
          this.currentLobby.version = (this.currentLobby.version || 1) + 1;
          this.currentLobby.updatedAt = new Date().toISOString();

          this._broadcastLobbyState();
          this._notifyListeners();
        }
        break;

      case 'ACTION':
        if (this.isHostRole && this.currentLobby) {
          this._applyAction(msg.action, msg.payload);
          this._broadcastLobbyState();
          this._notifyListeners();
        }
        break;
    }
  }

  _applyAction(action, payload = {}) {
    if (!this.currentLobby) return;

    switch (action) {
      case 'ASSIGN_TEAM':
        if (payload.playerId && typeof payload.teamId === 'number') {
          if (this.currentLobby.players[payload.playerId]) {
            this.currentLobby.players[payload.playerId].teamId = payload.teamId;
          }
        }
        break;

      case 'START_GAME':
        this.currentLobby.game.status = 'BROADCASTING';
        this.currentLobby.game.currentRound = 1;
        this.currentLobby.game.broadcastStage = 1;
        this.currentLobby.game.activeTeamIndex = 0;
        if (payload.question) {
          this.currentLobby.game.currentQuestion = payload.question;
        }
        break;

      case 'AUDIO_BROADCAST':
        this.currentLobby.game.broadcastStage = payload.stage || 1;
        this.currentLobby.game.status = 'BROADCASTING';
        break;

      case 'UNLOCK_CHOOSING':
        this.currentLobby.game.status = 'CHOOSING';
        break;

      case 'SUBMIT_GUESS':
        this.currentLobby.game.selectedOption = payload.optionIndex;
        this.currentLobby.game.status = 'REVEALED';
        const teamIdx = payload.teamIndex;
        if (typeof teamIdx === 'number' && this.currentLobby.teams[teamIdx]) {
          this.currentLobby.teams[teamIdx].score += payload.points || 0;
        }
        break;

      case 'NEXT_ROUND':
        this.currentLobby.game.currentRound++;
        this.currentLobby.game.activeTeamIndex =
          (this.currentLobby.game.activeTeamIndex + 1) % this.currentLobby.teams.length;
        this.currentLobby.game.broadcastStage = 1;
        this.currentLobby.game.status = 'BROADCASTING';
        if (payload.question) {
          this.currentLobby.game.currentQuestion = payload.question;
        }
        break;

      case 'RESET_GAME':
        this.currentLobby.game.status = 'WAITING';
        this.currentLobby.game.currentRound = 1;
        this.currentLobby.teams.forEach((t) => (t.score = 0));
        break;
    }

    this.currentLobby.game.lastActionTimestamp = Date.now();
    this.currentLobby.version = (this.currentLobby.version || 1) + 1;
    this.currentLobby.updatedAt = new Date().toISOString();
  }

  _broadcastLobbyState() {
    if (!this.currentLobby) return;

    const payload = {
      type: 'STATE_UPDATE',
      lobby: this.currentLobby,
    };

    // 1. Direct WebRTC DataChannels to each connected client peer
    this.peerConnections.forEach((conn) => {
      if (conn && conn.open) {
        try {
          conn.send(payload);
        } catch (e) {
          console.warn('[P2P Host] Send failed to peer:', conn.peer, e);
        }
      }
    });

    // 2. BroadcastChannel for same-device cross-tab synchronization
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {}
    }
  }

  /**
   * Send Action across P2P Network
   */
  async sendAction(action, payload = {}) {
    if (this.isHostRole) {
      this._applyAction(action, payload);
      this._broadcastLobbyState();
      this._notifyListeners();
      return { success: true, lobby: this.currentLobby };
    }

    const actionMsg = {
      type: 'ACTION',
      action: action,
      payload: payload,
      userId: this.localPlayer?.id,
      lobbyId: this.currentLobbyId,
    };

    // Send to Host DataChannel
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(actionMsg);
    }

    // Also mirror to BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(actionMsg);
    }

    return { success: true };
  }

  async uploadBase64Sound(soundId, title, base64Data, audioUrl = null) {
    if (!this.currentLobby) return;
    this.currentLobby.sounds = this.currentLobby.sounds || {};
    this.currentLobby.sounds[soundId] = {
      id: soundId,
      title: title,
      base64Data: base64Data,
      audioUrl: audioUrl,
      uploadedBy: this.localPlayer?.name || 'Player',
      createdAt: Date.now(),
    };

    if (this.isHostRole) {
      this._broadcastLobbyState();
      this._notifyListeners();
    } else {
      this.sendAction('UPLOAD_SOUND', { soundId, title, base64Data, audioUrl });
    }

    return { success: true, soundId, bytes: base64Data?.length || 0 };
  }

  leaveLobby() {
    if (this.hostConnection) {
      try {
        this.hostConnection.close();
      } catch (e) {}
      this.hostConnection = null;
    }

    this.peerConnections.forEach((conn) => {
      try {
        conn.close();
      } catch (e) {}
    });
    this.peerConnections.clear();

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }

    this.currentLobby = null;
    this.currentLobbyId = null;
    this.isHostRole = false;
    this._notifyListeners();
  }
}

export const lobbyClient = new P2PLobbyClient();
