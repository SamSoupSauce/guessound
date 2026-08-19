import confetti from 'canvas-confetti';
import { SceneManager } from './three/sceneManager.js';
import { soundEngine } from './audio/soundEngine.js';
import { GameSession } from './game/gameSession.js';
import { soundPackManager } from './data/soundPackManager.js';
import { googleAuth } from './auth/googleAuth.js';
import { lobbyClient } from './network/lobbyClient.js';
import { soundPackWizard } from './audio/packWizard.js';

// DOM Elements
const canvasContainer = document.getElementById('canvas-container');
const homeView = document.getElementById('home-view');
const gameHud = document.getElementById('game-hud');
const categoryGrid = document.getElementById('category-grid');

// Header elements
const btnHome = document.getElementById('btn-home');
const btnPacksNav = document.getElementById('btn-packs-nav');
const headerPackName = document.getElementById('header-pack-name');
const btnVault = document.getElementById('btn-vault');
const btnHow = document.getElementById('btn-how');
const btnInstallPwa = document.getElementById('btn-install-pwa');
const btnOpenLobbyHero = document.getElementById('btn-open-lobby-hero');

// Google Auth Elements
const userProfileBadge = document.getElementById('user-profile-badge');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const btnSignOut = document.getElementById('btn-sign-out');
const googleSigninHomeCard = document.getElementById('google-signin-home-card');
const btnDemoSignin = document.getElementById('btn-demo-signin');
const btnGoogleLoginModal = document.getElementById('btn-google-login-modal');
const btnGoogleLoginHome = document.getElementById('btn-google-login-home');
const btnGoogleLoginHeader = document.getElementById('btn-google-login-header');
const authRequiredModal = document.getElementById('auth-required-modal');
const btnCloseAuthModal = document.getElementById('btn-close-auth-modal');
const btnModalDemoSignin = document.getElementById('btn-modal-demo-signin');

// Multiplayer Serverless P2P WebRTC Elements
const lobbyModal = document.getElementById('lobby-modal');
const btnCloseLobby = document.getElementById('btn-close-lobby');
const tabBtnCreateLobby = document.getElementById('tab-btn-create-lobby');
const tabBtnJoinLobby = document.getElementById('tab-btn-join-lobby');
const lobbyTabCreate = document.getElementById('lobby-tab-create');
const lobbyTabJoin = document.getElementById('lobby-tab-join');
const lobbyActiveRoom = document.getElementById('lobby-active-room');
const lobbyTabsHeader = document.getElementById('lobby-tabs-header');
const lobbyCreatePack = document.getElementById('lobby-create-pack');
const btnCreateLobbySubmit = document.getElementById('btn-create-lobby-submit');
const joinLobbyInput = document.getElementById('join-lobby-input');
const btnJoinLobbySubmit = document.getElementById('btn-join-lobby-submit');
const activeLobbyId = document.getElementById('active-lobby-id');
const btnCopyLobbyId = document.getElementById('btn-copy-lobby-id');
const activeLobbyPack = document.getElementById('active-lobby-pack');
const activeLobbyMode = document.getElementById('active-lobby-mode');
const lobbyPlayersGrid = document.getElementById('lobby-players-grid');
const btnLeaveLobby = document.getElementById('btn-leave-lobby');
const btnLaunchMultiplayerGame = document.getElementById('btn-launch-multiplayer-game');
const lobbyTeamCountSelector = document.getElementById('lobby-team-count-selector');

// Custom Lab Base64 Audio Elements
const labAudioFile = document.getElementById('lab-audio-file');
const labAudioUrl = document.getElementById('lab-audio-url');
const labBase64Badge = document.getElementById('lab-base64-badge');
const btnLabTestAudio = document.getElementById('btn-lab-test-audio');
let labBase64AudioData = null;

// Starting Topic & Team Modal elements
const topicSelectModal = document.getElementById('topic-select-modal');
const topicGrid = document.getElementById('topic-grid');
const teamRosterListModal = document.getElementById('team-roster-list-modal');
const modalTeamCountBadge = document.getElementById('modal-team-count-badge');
const btnModalAddTeam = document.getElementById('btn-modal-add-team');
const btnModalRandomizeTeams = document.getElementById('btn-modal-randomize-teams');
const btnCloseTopicModal = document.getElementById('btn-close-topic-modal');
const btnTopicImport = document.getElementById('btn-topic-import');
const btnTopicLaunch = document.getElementById('btn-topic-launch');
const topicLaunchLabel = document.getElementById('topic-launch-label');

// Start Menu N-Team Roster elements
const teamRosterListHome = document.getElementById('team-roster-list-home');
const teamCountBadge = document.getElementById('team-count-badge');
const btnAddTeam = document.getElementById('btn-add-team');
const btnRandomizeTeams = document.getElementById('btn-randomize-teams');

// Hero elements
const btnStartGame = document.getElementById('btn-start-game');
const heroPackBtn = document.getElementById('hero-pack-btn');
const heroPackIcon = document.getElementById('hero-pack-icon');
const heroPackTitle = document.getElementById('hero-pack-title');
const heroPackMeta = document.getElementById('hero-pack-meta');

// Game HUD N-Team Scoreboard elements
const hudRound = document.getElementById('hud-round');
const hudTeamScoreboard = document.getElementById('hud-team-scoreboard');
const turnAnnouncementBar = document.getElementById('turn-announcement-bar');
const turnText = document.getElementById('turn-text');
const hudStreak = document.getElementById('hud-streak');

// Game Over N-Team results
const goTeamResultsGrid = document.getElementById('go-team-results-grid');

// Timer elements
const timerBar = document.getElementById('timer-bar');
const timerSecPill = document.getElementById('timer-sec-pill');

// 3-Listen Broadcast Phase elements
const listenDots = document.getElementById('listen-dots');
const listenCountLabel = document.getElementById('listen-count-label');
const listenPhaseCard = document.getElementById('listen-phase-card');
const listenStageTitle = document.getElementById('listen-stage-title');
const listenMeterFill = document.getElementById('listen-meter-fill');
const btnSkipBroadcast = document.getElementById('btn-skip-broadcast');
const hudOscilloscope = document.getElementById('hud-oscilloscope');
const optionsContainer = document.getElementById('options-container');

const hudHint = document.getElementById('hud-hint');
const hudQuestionTitle = document.getElementById('hud-question-title');
const optionsGrid = document.getElementById('options-grid');
const hudActions = document.getElementById('hud-actions');
const btnHint5050 = document.getElementById('btn-hint-5050');

// Reveal Card elements
const revealCard = document.getElementById('reveal-card');
const revealStatus = document.getElementById('reveal-status');
const revealIcon = document.getElementById('reveal-icon');
const revealMsg = document.getElementById('reveal-msg');
const revealSourceTitle = document.getElementById('reveal-source-title');
const revealExplanation = document.getElementById('reveal-explanation');
const revealTrivia = document.getElementById('reveal-trivia');
const btnNextRound = document.getElementById('btn-next-round');

// Sound Packs Modal elements
const packsModal = document.getElementById('packs-modal');
const packsList = document.getElementById('packs-list');
const btnClosePacks = document.getElementById('btn-close-packs');
const btnOpenImport = document.getElementById('btn-open-import');
const btnExportActive = document.getElementById('btn-export-active');
const btnResetPacks = document.getElementById('btn-reset-packs');

// Import Pack Modal elements
const importModal = document.getElementById('import-modal');
const importFileInput = document.getElementById('import-file-input');
const importTextarea = document.getElementById('import-textarea');
const importErrorMsg = document.getElementById('import-error-msg');
const btnCloseImport = document.getElementById('btn-close-import');
const btnCancelImport = document.getElementById('btn-cancel-import');
const btnSubmitImport = document.getElementById('btn-submit-import');

// Game Over / 2-Team Duel Modal
const gameoverModal = document.getElementById('gameover-modal');
const goWinnerTitle = document.getElementById('go-winner-title');
const goScore = document.getElementById('go-score');
const goT1Title = document.getElementById('go-t1-title');
const goT1Pts = document.getElementById('go-t1-pts');
const goT1Meta = document.getElementById('go-t1-meta');
const goT2Title = document.getElementById('go-t2-title');
const goT2Pts = document.getElementById('go-t2-pts');
const goT2Meta = document.getElementById('go-t2-meta');
const goRecapList = document.getElementById('go-recap-list');
const btnGoHome = document.getElementById('btn-go-home');
const btnGoReplay = document.getElementById('btn-go-replay');

const vaultModal = document.getElementById('vault-modal');
const vaultList = document.getElementById('vault-list');
const vaultDesc = document.getElementById('vault-desc');
const btnCloseVault = document.getElementById('btn-close-vault');

const labModal = document.getElementById('lab-modal');
const customForm = document.getElementById('custom-form');
const labTargetPack = document.getElementById('lab-target-pack');
const labTimerInput = document.getElementById('lab-timer');
const btnCloseLab = document.getElementById('btn-close-lab');
const btnSavePackSound = document.getElementById('btn-save-pack-sound');

const guideModal = document.getElementById('guide-modal');
const btnCloseGuide = document.getElementById('btn-close-guide');

// PWA Install Modal Elements
const pwaInstallModal = document.getElementById('pwa-install-modal');
const btnClosePwaModal = document.getElementById('btn-close-pwa-modal');
const btnDismissPwa = document.getElementById('btn-dismiss-pwa');
const btnConfirmPwaInstall = document.getElementById('btn-confirm-pwa-install');
const pwaIosInstruction = document.getElementById('pwa-ios-instruction');

// Mobile Header Dropdown Menu Elements
const btnHeaderMenuToggle = document.getElementById('btn-header-menu-toggle');
const headerDropdownMenu = document.getElementById('header-dropdown-menu');
const menuUserProfileBadge = document.getElementById('menu-user-profile-badge');
const menuUserAvatar = document.getElementById('menu-user-avatar');
const menuUserName = document.getElementById('menu-user-name');
const btnMenuSignOut = document.getElementById('btn-menu-sign-out');
const btnGoogleLoginMenu = document.getElementById('btn-google-login-menu');
const btnMenuSwitchPack = document.getElementById('btn-menu-switch-pack');
const menuCurrentPackLabel = document.getElementById('menu-current-pack-label');
const btnMenuVault = document.getElementById('btn-menu-vault');
const btnMenuForge = document.getElementById('btn-menu-forge');
const btnMenuGuide = document.getElementById('btn-menu-guide');
const btnMenuPwa = document.getElementById('btn-menu-pwa');

// Application State
let sceneManager = null;
let gameSession = null;
let selectedMode = 'classic';
let selectedTopicId = null;
let gameTimerId = null;
let sequenceTimers = [];
let lastTickSecond = -1;
let deferredPrompt = null;

// Dynamic N-Team Roster State
let teamRoster = [
  { id: 0, name: 'Team Brass ⚙️', color: '#d4af37', avatar: null, isGoogleUser: true },
  { id: 1, name: 'Team Steam ⚡', color: '#00f0ff', avatar: null, isGoogleUser: false },
];

function renderTeamRosters() {
  const updateList = (containerEl) => {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    teamRoster.forEach((team, index) => {
      const card = document.createElement('div');
      card.className = 'team-roster-card';
      card.style.setProperty('--team-color', team.color);

      const isFirst = index === 0;
      const canDelete = teamRoster.length > 2 && !isFirst;

      let avatarHtml = '';
      if (team.avatar) {
        avatarHtml = `<img class="team-roster-avatar" src="${team.avatar}" alt="${team.name}">`;
      } else {
        const emojis = ['⚙️', '⚡', '🦊', '🎈', '🧪', '📻', '🕵️', '🚀', '🏆', '🔧'];
        avatarHtml = `<span style="font-size:1.1rem; flex-shrink:0;">${emojis[index % emojis.length]}</span>`;
      }

      card.innerHTML = `
        <span class="team-badge-pill">TEAM ${index + 1}</span>
        ${avatarHtml}
        <input type="text" class="team-roster-input" value="${team.name}" placeholder="Team ${index + 1} Name">
        ${canDelete ? `<button type="button" class="btn-remove-team" title="Remove Team">✕</button>` : ''}
      `;

      const input = card.querySelector('.team-roster-input');
      input.addEventListener('input', (e) => {
        team.name = e.target.value;
        // Sync across other rendered inputs
        document.querySelectorAll(`.team-roster-input[data-team-idx="${index}"]`).forEach((other) => {
          if (other !== input) other.value = e.target.value;
        });
      });
      input.dataset.teamIdx = index;

      if (canDelete) {
        const delBtn = card.querySelector('.btn-remove-team');
        delBtn.addEventListener('click', () => removeTeam(index));
      }

      containerEl.appendChild(card);
    });
  };

  updateList(teamRosterListHome);
  updateList(teamRosterListModal);

  const countText = `${teamRoster.length} Teams`;
  if (teamCountBadge) teamCountBadge.textContent = countText;
  if (modalTeamCountBadge) modalTeamCountBadge.textContent = countText;
  if (topicLaunchLabel) topicLaunchLabel.textContent = `🚀 START ${teamRoster.length}-TEAM SHOWDOWN`;
}

function addTeam() {
  if (teamRoster.length >= 8) {
    alert('Maximum 8 teams reached.');
    return;
  }
  const colors = ['#d4af37', '#00f0ff', '#ff3366', '#00ff88', '#bd00ff', '#ff9900', '#00e5ff', '#ff5722'];
  const nextIndex = teamRoster.length;
  const nextColor = colors[nextIndex % colors.length];

  const ADJECTIVES = ['Copper', 'Clockwork', 'Velvet', 'Dynamo', 'Tesla', 'Aether', 'Zephyr', 'Cyber', 'Neon', 'Cogwheel', 'Radiant'];
  const NOUNS = ['Pioneers ⚙️', 'Aeronauts 🎈', 'Inventors 🧪', 'Foxes 🦊', 'Radiowaves 📻', 'Voyagers 🚀', 'Titans 🏆', 'Sorcerers ⚡', 'Detectives 🕵️'];

  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  teamRoster.push({
    id: nextIndex,
    name: `Team ${adj} ${noun}`,
    color: nextColor,
    avatar: null,
    isGoogleUser: false,
  });

  renderTeamRosters();
  soundEngine.playClick();
}

function removeTeam(index) {
  if (teamRoster.length <= 2) return;
  teamRoster.splice(index, 1);
  teamRoster.forEach((t, i) => (t.id = i));
  renderTeamRosters();
  soundEngine.playClick();
}

function randomizeAllTeams() {
  const ADJECTIVES = ['Brass', 'Steam', 'Copper', 'Clockwork', 'Velvet', 'Dynamo', 'Tesla', 'Aether', 'Zephyr', 'Cyber', 'Gramophone', 'Neon', 'Cogwheel'];
  const NOUNS = ['Pioneers ⚙️', 'Aeronauts 🎈', 'Inventors 🧪', 'Foxes 🦊', 'Radiowaves 📻', 'Voyagers 🚀', 'Detectives 🕵️', 'Titans 🏆', 'Riveters 🔧', 'Sorcerers ⚡'];

  const user = googleAuth.getUser();
  teamRoster.forEach((team, idx) => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    if (idx === 0 && user) {
      team.name = `Team ${user.givenName || user.name} (${adj}) ⚙️`;
    } else {
      team.name = `Team ${adj} ${noun}`;
    }
  });

  renderTeamRosters();
  soundEngine.playClick();
}

// PWA Install Prompt Listener
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstallPwa) {
    btnInstallPwa.style.display = 'inline-flex';
  }
  if (btnMenuPwa) {
    btnMenuPwa.style.display = 'flex';
  }

  const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (!dismissed && !isStandalone && pwaInstallModal) {
    setTimeout(() => {
      pwaInstallModal.classList.add('active');
    }, 1200);
  }
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  if (btnInstallPwa) btnInstallPwa.style.display = 'none';
  if (btnMenuPwa) btnMenuPwa.style.display = 'none';
  if (pwaInstallModal) pwaInstallModal.classList.remove('active');
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
});

function init() {
  const container = document.getElementById('canvas-container') || canvasContainer;
  sceneManager = new SceneManager(container);
  const activePack = soundPackManager.getActivePack();
  sceneManager.loadThemeScene(activePack.sounds[0] || activePack, activePack);
  sceneManager.setRevealed(true);

  selectedTopicId = activePack.id;

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('PWA ServiceWorker registered with scope:', reg.scope);
    }).catch((err) => {
      console.warn('PWA ServiceWorker registration failed:', err);
    });
  }

  // Listen to sound pack updates
  soundPackManager.addListener(onSoundPackChanged);

  // Initialize Google Sign In & Auth State
  googleAuth.addListener(onAuthChanged);
  googleAuth.initGIS((user) => onAuthChanged(user));

  renderTeamRosters();
  updateActivePackUI();
  renderTopicGrid();
  renderCategoryGrid();
  renderVaultList();
  renderPacksList();
  populateLabPackOptions();
  populateLobbyPackOptions();
  soundPackWizard.init({
    onPackSaved: (pack) => {
      if (labModal) labModal.classList.remove('active');
      updateActivePackUI();
      renderTopicGrid();
      renderCategoryGrid();
      renderVaultList();
      renderPacksList();
      populateLabPackOptions();
      populateLobbyPackOptions();
      const tabPlay = document.getElementById('tab-home-play');
      if (tabPlay) tabPlay.click();
    },
    onPlayTest: (pack) => {
      if (labModal) labModal.classList.remove('active');
      startCustomGame(pack.sounds);
    },
    onInspect3D: (q, pack) => {
      openSceneViewer(q, pack);
    },
  });
  setupEventListeners();
  setupLobbyEventListeners();
  lobbyClient.addListener(onLobbyUpdated);

  // Auto-connect if URL has ?lobby=CODE
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyParam = urlParams.get('lobby');
  if (lobbyParam) {
    setTimeout(() => {
      requireAuth(() => {
        if (joinLobbyInput) joinLobbyInput.value = lobbyParam;
        if (tabBtnJoinLobby) tabBtnJoinLobby.click();
        if (lobbyModal) lobbyModal.classList.add('active');
        lobbyClient.joinLobby(lobbyParam, googleAuth.getUser());
      });
    }, 800);
  }

  // Enforce Google Sign-In Gate before Start Menu
  if (googleAuth.isSignedIn()) {
    if (authRequiredModal) authRequiredModal.classList.remove('active');
    if (homeView) homeView.classList.add('active');
    onAuthChanged(googleAuth.getUser());
  } else {
    if (authRequiredModal) authRequiredModal.classList.add('active');
    if (homeView) homeView.classList.remove('active');
    googleAuth.renderButton('google-btn-modal', { width: 240 });
  }

  // Three.js Render Loop + Live Oscilloscope Canvas
  function animate() {
    requestAnimationFrame(animate);
    const freqData = soundEngine.getFrequencyData();
    const audioVol = soundEngine.getAverageVolume();
    sceneManager.render(freqData, audioVol);

    // Draw Live HUD Oscilloscope
    drawHudOscilloscope(freqData, audioVol);
  }
  animate();
}

function onAuthChanged(user) {
  if (user) {
    if (authRequiredModal) {
      authRequiredModal.classList.remove('active');
    }
    if (homeView && !gameHud.classList.contains('active')) {
      homeView.classList.add('active');
    }
    if (userProfileBadge) {
      userProfileBadge.style.display = 'flex';
      userAvatar.src = user.picture;
      userName.textContent = user.givenName || user.name;
    }
    // Mobile Dropdown Profile
    if (menuUserProfileBadge) {
      menuUserProfileBadge.style.display = 'flex';
      if (menuUserAvatar) menuUserAvatar.src = user.picture;
      if (menuUserName) menuUserName.textContent = user.givenName || user.name;
    }
    if (btnGoogleLoginMenu) {
      btnGoogleLoginMenu.style.display = 'none';
    }
    const btnGoogleLoginHeader = document.getElementById('btn-google-login-header');
    if (btnGoogleLoginHeader) {
      btnGoogleLoginHeader.style.display = 'none';
    }
    if (googleSigninHomeCard) {
      googleSigninHomeCard.style.display = 'none';
    }
    if (btnStartGame) {
      btnStartGame.innerHTML = `<span>🎙️ START ${teamRoster.length}-TEAM SHOWDOWN (as ${user.givenName || user.name})</span>`;
      btnStartGame.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--copper) 100%)';
    }
    teamRoster[0].name = `Team ${user.givenName || user.name} ⚙️`;
    teamRoster[0].avatar = user.picture;
    teamRoster[0].isGoogleUser = true;
    renderTeamRosters();
  } else {
    // Show Gatekeeper Modal & Hide other screens
    if (authRequiredModal) {
      authRequiredModal.classList.add('active');
      googleAuth.renderButton('google-btn-modal', { width: 240 });
    }
    if (homeView) {
      homeView.classList.remove('active');
    }
    if (gameHud) {
      gameHud.classList.remove('active');
    }
    if (topicSelectModal) {
      topicSelectModal.classList.remove('active');
    }
    if (userProfileBadge) {
      userProfileBadge.style.display = 'none';
    }
    if (menuUserProfileBadge) {
      menuUserProfileBadge.style.display = 'none';
    }
    if (btnGoogleLoginMenu) {
      btnGoogleLoginMenu.style.display = 'flex';
    }
    const btnGoogleLoginHeader = document.getElementById('btn-google-login-header');
    if (btnGoogleLoginHeader) {
      btnGoogleLoginHeader.style.display = 'flex';
    }
    if (googleSigninHomeCard) {
      googleSigninHomeCard.style.display = 'flex';
      googleAuth.renderButton('google-btn-home', { width: 200 });
    }
    if (btnStartGame) {
      btnStartGame.innerHTML = `<span>🔒 SIGN IN WITH GOOGLE TO PLAY</span>`;
      btnStartGame.style.background = 'linear-gradient(135deg, #4285f4 0%, #b85d19 100%)';
    }
    teamRoster[0].name = 'Team Brass ⚙️';
    teamRoster[0].avatar = null;
    teamRoster[0].isGoogleUser = false;
    renderTeamRosters();
  }
}

function requireAuth(onSuccess) {
  if (googleAuth.isSignedIn()) {
    if (onSuccess) onSuccess();
  } else {
    if (authRequiredModal) {
      authRequiredModal.classList.add('active');
      googleAuth.renderButton('google-btn-modal', { width: 220 });
    }
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {}
    }
  }
}

function drawHudOscilloscope(freqData, audioVol) {
  if (!hudOscilloscope || !listenPhaseCard || listenPhaseCard.style.display === 'none') return;
  const ctx = hudOscilloscope.getContext('2d');
  const w = hudOscilloscope.width;
  const h = hudOscilloscope.height;

  // Clear with phosphorescent persistence
  ctx.fillStyle = 'rgba(8, 20, 12, 0.35)';
  ctx.fillRect(0, 0, w, h);

  // Draw Grid Reticle
  ctx.strokeStyle = 'rgba(42, 82, 53, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  // Draw Glowing Phosphor Waveform
  ctx.strokeStyle = '#00ff88';
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  const sliceWidth = w / 32;
  let x = 0;
  for (let i = 0; i < 32; i++) {
    const v = (freqData[i] || 0) / 255.0;
    const wave = Math.sin(i * 0.4 + performance.now() * 0.008) * (audioVol * 25);
    const y = h / 2 - (v * (h * 0.4)) + wave;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function updateActivePackUI() {
  const activePack = soundPackManager.getActivePack();
  headerPackName.textContent = activePack.name;
  if (menuCurrentPackLabel) {
    menuCurrentPackLabel.textContent = activePack.name;
  }
  heroPackIcon.textContent = activePack.icon || '📦';
  heroPackTitle.textContent = activePack.name;
  heroPackMeta.textContent = `${activePack.sounds.length} 3D Riddles • Questions & Sounds • by ${activePack.author || 'Guessound'}`;
  vaultDesc.textContent = `Browse interactive 3D scenes and listen to sounds from "${activePack.name}"!`;
  topicLaunchLabel.textContent = `🚀 START 2-TEAM SHOWDOWN`;
}

function onSoundPackChanged() {
  updateActivePackUI();
  renderTopicGrid();
  renderCategoryGrid();
  renderVaultList();
  renderPacksList();

  const activePack = soundPackManager.getActivePack();
  if (homeView && homeView.classList.contains('active')) {
    sceneManager.loadThemeScene(activePack.sounds[0] || activePack, activePack);
  }
  populateLabPackOptions();
}

function renderTopicGrid() {
  topicGrid.innerHTML = '';
  const packs = soundPackManager.getAllPacks();
  const currentActive = soundPackManager.getActivePack();

  if (!selectedTopicId || !packs.some((p) => p.id === selectedTopicId)) {
    selectedTopicId = currentActive.id;
  }

  packs.forEach((pack) => {
    const isSelected = pack.id === selectedTopicId;
    const card = document.createElement('div');
    card.className = `topic-card ${isSelected ? 'active-topic' : ''}`;
    card.dataset.id = pack.id;

    card.innerHTML = `
      <span class="topic-card-check">✓</span>
      <div class="topic-card-top">
        <span class="topic-card-icon">${pack.icon || '📦'}</span>
        <div>
          <div class="topic-card-title">${pack.name}</div>
        </div>
      </div>
      <p class="topic-card-desc">${pack.description || 'Full Guessound Game Pack'}</p>
      <div class="topic-card-meta">
        <span class="topic-card-count">${pack.sounds.length} 3D Riddles • ⏳ ${pack.timerSeconds || 15}s</span>
        <span class="topic-card-author">by ${pack.author || 'Guessound'}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      selectedTopicId = pack.id;
      soundPackManager.setActivePack(pack.id);
      renderTopicGrid();
      soundEngine.playClick();
    });

    topicGrid.appendChild(card);
  });
}

function renderCategoryGrid() {
  categoryGrid.innerHTML = '';
  const activePack = soundPackManager.getActivePack();
  const cats = activePack.categories || {};

  Object.values(cats).forEach((cat) => {
    const count =
      cat.id === 'unexpectedMystery'
        ? activePack.sounds.length
        : activePack.sounds.filter((q) => q.category === cat.id).length;

    const card = document.createElement('div');
    card.className = 'cat-card';
    card.style.setProperty('--cat-color', cat.color || '#d4af37');
    card.innerHTML = `
      <div class="cat-icon" style="color: ${cat.color || '#d4af37'};">${cat.icon || '🎵'}</div>
      <div class="cat-info">
        <div class="cat-title">${cat.name}</div>
        <div class="cat-count">${count} Puzzles</div>
      </div>
    `;
    card.addEventListener('click', () => requireAuth(() => startGame(cat.id)));
    categoryGrid.appendChild(card);
  });
}

function renderVaultList() {
  vaultList.innerHTML = '';
  const activePack = soundPackManager.getActivePack();

  if (activePack.sounds.length === 0) {
    vaultList.innerHTML = '<p style="color:#94a3b8; padding:12px;">No sounds found in this pack.</p>';
    return;
  }

  activePack.sounds.forEach((q) => {
    const item = document.createElement('div');
    item.className = 'vault-item';
    const cat = (activePack.categories && activePack.categories[q.category]) || { name: 'Mystery', color: '#ffbe0b' };
    item.innerHTML = `
      <div>
        <strong>${q.title}</strong>
        <p style="font-size:0.75rem; color:#d4a373;">${cat.name} • ⏳ ${q.timerSeconds || 15}s • ${q.revealTitle}</p>
      </div>
      <button class="icon-btn" style="border-color:${cat.color}; color:${cat.color};">▶ View 3D</button>
    `;
    item.addEventListener('click', () => {
      openSceneViewer(q, activePack);
    });
    vaultList.appendChild(item);
  });
}

let currentViewerQuestion = null;

function openSceneViewer(q, pack) {
  currentViewerQuestion = q;
  vaultModal.classList.remove('active');
  homeView.classList.remove('active');
  gameHud.classList.remove('active');

  const viewerHud = document.getElementById('scene-viewer-hud');
  if (viewerHud) {
    viewerHud.classList.add('active');
    viewerHud.style.display = 'flex';
  }

  const iconEl = document.getElementById('viewer-3d-icon');
  const titleEl = document.getElementById('viewer-3d-title');
  const catEl = document.getElementById('viewer-3d-category');
  const descEl = document.getElementById('viewer-3d-desc');

  const cat = (pack.categories && pack.categories[q.category]) || { name: 'Mystery', color: '#ffbe0b' };
  if (iconEl) iconEl.textContent = q.icon || '🎙️';
  if (titleEl) titleEl.textContent = q.revealTitle || q.title;
  if (catEl) catEl.textContent = `${cat.name} • 1920s Steampunk 3D`;
  if (descEl) descEl.textContent = q.revealExplanation || q.soundHint || 'Interactive 3D Foley Model';

  sceneManager.loadThemeScene(q, pack);
  sceneManager.setRevealed(true);
  sceneManager.setMediaForTheme(q);
  soundEngine.playSoundForQuestion(q);
}

function closeSceneViewer(goToVault = false) {
  const viewerHud = document.getElementById('scene-viewer-hud');
  if (viewerHud) {
    viewerHud.classList.remove('active');
    viewerHud.style.display = 'none';
  }

  if (goToVault) {
    vaultModal.classList.add('active');
  } else {
    showHome();
  }
}

function renderPacksList() {
  packsList.innerHTML = '';
  const packs = soundPackManager.getAllPacks();
  const activePack = soundPackManager.getActivePack();

  packs.forEach((pack) => {
    const isActive = pack.id === activePack.id;
    const item = document.createElement('div');
    item.className = `pack-item ${isActive ? 'active-pack' : ''}`;

    item.innerHTML = `
      <div class="pack-item-left">
        <span class="pack-item-icon">${pack.icon || '📦'}</span>
        <div>
          <div class="pack-item-title">
            ${pack.name}
            ${isActive ? '<span class="active-pill">ACTIVE</span>' : ''}
          </div>
          <div class="pack-item-desc">${pack.description || ''}</div>
          <div class="pack-item-meta">${pack.sounds.length} 3D Riddles & Questions • ⏳ ${pack.timerSeconds || 15}s Timer • v${pack.version || '1.1.0'} (Rev ${pack.revision || 1}) • by ${pack.author || 'Guessound'}</div>
        </div>
      </div>
      <div class="pack-item-actions">
        ${!isActive ? `<button class="btn-primary btn-select-pack" data-id="${pack.id}">Select</button>` : ''}
        <button class="btn-secondary btn-export-pack" data-id="${pack.id}" title="Export JSON">📤</button>
        ${!pack.isBuiltIn ? `<button class="btn-secondary btn-delete-pack" data-id="${pack.id}" style="color:var(--error);" title="Delete">🗑️</button>` : ''}
      </div>
    `;

    const selectBtn = item.querySelector('.btn-select-pack');
    if (selectBtn) {
      selectBtn.addEventListener('click', () => {
        soundPackManager.setActivePack(pack.id);
        soundEngine.playClick();
      });
    }

    const exportBtn = item.querySelector('.btn-export-pack');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => exportPack(pack.id));
    }

    const deleteBtn = item.querySelector('.btn-delete-pack');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete sound pack "${pack.name}"?`)) {
          soundPackManager.deletePack(pack.id);
        }
      });
    }

    packsList.appendChild(item);
  });
}

function populateLabPackOptions() {
  labTargetPack.innerHTML = '';
  const packs = soundPackManager.getAllPacks();
  const activePack = soundPackManager.getActivePack();

  packs.forEach((pack) => {
    const opt = document.createElement('option');
    opt.value = pack.id;
    opt.textContent = `${pack.name} (${pack.sounds.length} sounds)`;
    if (pack.id === activePack.id) opt.selected = true;
    labTargetPack.appendChild(opt);
  });
}

function exportPack(packId) {
  const jsonStr = soundPackManager.exportPackToJSON(packId);
  const pack = soundPackManager.getAllPacks().find((p) => p.id === packId) || soundPackManager.getActivePack();

  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sound_pack_${pack.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  navigator.clipboard?.writeText(jsonStr).then(() => {
    alert(`Pack "${pack.name}" exported! JSON downloaded and copied to clipboard.`);
  }).catch(() => {
    alert(`Pack "${pack.name}" exported and downloaded!`);
  });
}

function setupEventListeners() {
  // Mode Selection
  document.querySelectorAll('.mode-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const mode = chip.dataset.mode;
      selectedMode = mode;
      document.querySelectorAll('.mode-chip').forEach((c) => {
        if (c.dataset.mode === mode) c.classList.add('active');
        else c.classList.remove('active');
      });
      soundEngine.playClick();
    });
  });

  // Start Modal Trigger Buttons with Auth Guard
  if (btnStartGame) {
    btnStartGame.addEventListener('click', () => {
      requireAuth(() => {
        topicSelectModal.classList.add('active');
        soundEngine.playClick();
      });
    });
  }

  heroPackBtn.addEventListener('click', () => {
    requireAuth(() => {
      topicSelectModal.classList.add('active');
      soundEngine.playClick();
    });
  });

  btnCloseTopicModal.addEventListener('click', () => {
    topicSelectModal.classList.remove('active');
  });

  btnTopicImport.addEventListener('click', () => {
    topicSelectModal.classList.remove('active');
    btnOpenImport.click();
  });

  // N-Team Add & Randomize Actions
  if (btnAddTeam) btnAddTeam.addEventListener('click', addTeam);
  if (btnModalAddTeam) btnModalAddTeam.addEventListener('click', addTeam);
  if (btnRandomizeTeams) btnRandomizeTeams.addEventListener('click', randomizeAllTeams);
  if (btnModalRandomizeTeams) btnModalRandomizeTeams.addEventListener('click', randomizeAllTeams);

  btnTopicLaunch.addEventListener('click', () => {
    requireAuth(() => {
      if (selectedTopicId) {
        soundPackManager.setActivePack(selectedTopicId);
      }
      topicSelectModal.classList.remove('active');
      startGame();
    });
  });

  // Auth Required Modal Handlers
  if (btnCloseAuthModal) {
    btnCloseAuthModal.addEventListener('click', () => {
      authRequiredModal.classList.remove('active');
    });
  }

  const btnCloseGooglePicker = document.getElementById('btn-close-google-picker');
  if (btnCloseGooglePicker) {
    btnCloseGooglePicker.addEventListener('click', () => {
      const modal = document.getElementById('google-account-picker-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  if (btnModalDemoSignin) {
    btnModalDemoSignin.addEventListener('click', () => {
      const name = prompt('Enter player / team leader name:', 'Captain Clockwork');
      if (name && name.trim()) {
        googleAuth.signInAsDemoUser(name.trim());
        soundEngine.playCorrect();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    });
  }

  if (btnSkipBroadcast) {
    btnSkipBroadcast.addEventListener('click', () => {
      unlockOptionsAndStartTimer();
    });
  }

  // Navigation
  btnHome.addEventListener('click', showHome);
  btnPacksNav.addEventListener('click', () => packsModal.classList.add('active'));
  btnClosePacks.addEventListener('click', () => packsModal.classList.remove('active'));

  btnVault.addEventListener('click', () => vaultModal.classList.add('active'));
  btnCloseVault.addEventListener('click', () => vaultModal.classList.remove('active'));

  // Main Menu Home Tabs (Play Showdown vs Pack Forge Studio)
  const tabHomePlay = document.getElementById('tab-home-play');
  const tabHomeForge = document.getElementById('tab-home-forge');
  const homePanePlay = document.getElementById('home-pane-play');
  const homePaneForge = document.getElementById('home-pane-forge');

  const switchHomeTab = (mode) => {
    if (mode === 'forge') {
      if (tabHomePlay) tabHomePlay.classList.remove('active');
      if (tabHomeForge) tabHomeForge.classList.add('active');
      if (homePanePlay) homePanePlay.style.display = 'none';
      if (homePaneForge) homePaneForge.style.display = 'block';
      soundPackWizard.updateSizeBudgetUI();
    } else {
      if (tabHomeForge) tabHomeForge.classList.remove('active');
      if (tabHomePlay) tabHomePlay.classList.add('active');
      if (homePaneForge) homePaneForge.style.display = 'none';
      if (homePanePlay) homePanePlay.style.display = 'block';
    }
    soundEngine.playClick();
  };

  if (tabHomePlay) tabHomePlay.addEventListener('click', () => switchHomeTab('play'));
  if (tabHomeForge) tabHomeForge.addEventListener('click', () => switchHomeTab('forge'));

  const openCustomLab = () => {
    showHome();
    switchHomeTab('forge');
    packsModal.classList.remove('active');
    if (labModal) labModal.classList.remove('active');
  };

  const btnOpenLabHero = document.getElementById('btn-open-lab-hero');
  if (btnOpenLabHero) btnOpenLabHero.addEventListener('click', openCustomLab);
  const btnPacksOpenLab = document.getElementById('btn-packs-open-lab');
  if (btnPacksOpenLab) btnPacksOpenLab.addEventListener('click', openCustomLab);
  btnHow.addEventListener('click', () => guideModal.classList.add('active'));
  btnCloseGuide.addEventListener('click', () => guideModal.classList.remove('active'));
  const btnGuideStartGame = document.getElementById('btn-guide-start-game');
  if (btnGuideStartGame) btnGuideStartGame.addEventListener('click', () => guideModal.classList.remove('active'));

  // Mobile Header Dropdown Menu Toggle & Actions
  const closeMobileMenu = () => {
    if (headerDropdownMenu) headerDropdownMenu.classList.remove('active');
    if (btnHeaderMenuToggle) btnHeaderMenuToggle.classList.remove('active');
  };

  if (btnHeaderMenuToggle) {
    btnHeaderMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = headerDropdownMenu.classList.toggle('active');
      btnHeaderMenuToggle.classList.toggle('active', isActive);
      soundEngine.playClick();
    });
  }

  document.addEventListener('click', (e) => {
    if (headerDropdownMenu && headerDropdownMenu.classList.contains('active')) {
      if (!headerDropdownMenu.contains(e.target) && !btnHeaderMenuToggle?.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  if (btnMenuSwitchPack) {
    btnMenuSwitchPack.addEventListener('click', () => {
      closeMobileMenu();
      openTopicSelector();
      soundEngine.playClick();
    });
  }

  if (btnMenuVault) {
    btnMenuVault.addEventListener('click', () => {
      closeMobileMenu();
      openVault();
      soundEngine.playClick();
    });
  }

  if (btnMenuForge) {
    btnMenuForge.addEventListener('click', () => {
      closeMobileMenu();
      const tabForge = document.getElementById('tab-home-forge');
      if (tabForge) tabForge.click();
      soundEngine.playClick();
    });
  }

  if (btnMenuGuide) {
    btnMenuGuide.addEventListener('click', () => {
      closeMobileMenu();
      guideModal.classList.add('active');
      soundEngine.playClick();
    });
  }

  if (btnMenuPwa) {
    btnMenuPwa.addEventListener('click', () => {
      closeMobileMenu();
      pwaInstallModal.classList.add('active');
      soundEngine.playClick();
    });
  }

  // Google Auth Sign In / Out Handlers
  const handleGoogleAuthClick = () => {
    closeMobileMenu();
    googleAuth.triggerGoogleSignIn((user) => {
      onAuthChanged(user);
      soundEngine.playCorrect();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    });
  };

  if (btnGoogleLoginModal) {
    btnGoogleLoginModal.addEventListener('click', handleGoogleAuthClick);
  }

  if (btnGoogleLoginHome) {
    btnGoogleLoginHome.addEventListener('click', handleGoogleAuthClick);
  }

  if (btnGoogleLoginHeader) {
    btnGoogleLoginHeader.addEventListener('click', handleGoogleAuthClick);
  }

  if (btnGoogleLoginMenu) {
    btnGoogleLoginMenu.addEventListener('click', handleGoogleAuthClick);
  }

  if (btnSignOut) {
    btnSignOut.addEventListener('click', () => {
      googleAuth.signOut();
      soundEngine.playClick();
    });
  }

  if (btnMenuSignOut) {
    btnMenuSignOut.addEventListener('click', () => {
      closeMobileMenu();
      googleAuth.signOut();
      soundEngine.playClick();
    });
  }

  if (btnDemoSignin) {
    btnDemoSignin.addEventListener('click', () => {
      const name = prompt('Enter player / team leader name:', 'Captain Clockwork');
      if (name && name.trim()) {
        googleAuth.signInAsDemoUser(name.trim());
        soundEngine.playCorrect();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    });
  }

  // 3D Scene Inspector HUD Listeners
  const btnClose3DViewer = document.getElementById('btn-close-3d-viewer');
  if (btnClose3DViewer) btnClose3DViewer.addEventListener('click', () => closeSceneViewer(false));

  const btnViewerBackHome = document.getElementById('btn-viewer-back-home');
  if (btnViewerBackHome) btnViewerBackHome.addEventListener('click', () => closeSceneViewer(false));

  const btnViewerBackVault = document.getElementById('btn-viewer-back-vault');
  if (btnViewerBackVault) btnViewerBackVault.addEventListener('click', () => closeSceneViewer(true));

  const btnViewerReplaySound = document.getElementById('btn-viewer-replay-sound');
  if (btnViewerReplaySound) {
    btnViewerReplaySound.addEventListener('click', () => {
      if (currentViewerQuestion) {
        soundEngine.playSoundForQuestion(currentViewerQuestion);
      }
    });
  }

  // PWA Install Event Listeners
  if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', () => {
      if (pwaInstallModal) {
        pwaInstallModal.classList.add('active');
      }
    });
  }

  if (btnClosePwaModal) {
    btnClosePwaModal.addEventListener('click', () => {
      pwaInstallModal.classList.remove('active');
    });
  }

  if (btnDismissPwa) {
    btnDismissPwa.addEventListener('click', () => {
      sessionStorage.setItem('pwa_prompt_dismissed', 'true');
      pwaInstallModal.classList.remove('active');
    });
  }

  if (btnConfirmPwaInstall) {
    btnConfirmPwaInstall.addEventListener('click', async () => {
      const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
      if (deferredPrompt) {
        pwaInstallModal.classList.remove('active');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User PWA response: ${outcome}`);
        deferredPrompt = null;
        if (btnInstallPwa) btnInstallPwa.style.display = 'none';
      } else if (isIos && pwaIosInstruction) {
        pwaIosInstruction.style.display = 'block';
      } else {
        alert('To install, open your browser menu and tap "Install App" or "Add to Home Screen".');
        pwaInstallModal.classList.remove('active');
      }
    });
  }

  // Sound Packs Actions
  btnExportActive.addEventListener('click', () => exportPack(soundPackManager.getActivePack().id));

  btnResetPacks.addEventListener('click', () => {
    if (confirm('Reset all sound packs to factory defaults? Custom packs will be replaced.')) {
      soundPackManager.resetToDefaults();
      alert('Sound packs reset to defaults!');
    }
  });

  // Import Modal Events
  btnOpenImport.addEventListener('click', () => {
    importErrorMsg.style.display = 'none';
    importTextarea.value = '';
    importFileInput.value = '';
    importModal.classList.add('active');
  });

  btnCloseImport.addEventListener('click', () => importModal.classList.remove('active'));
  btnCancelImport.addEventListener('click', () => importModal.classList.remove('active'));

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importTextarea.value = event.target.result;
    };
    reader.readAsText(file);
  });

  btnSubmitImport.addEventListener('click', () => {
    const text = importTextarea.value.trim();
    if (!text) {
      importErrorMsg.textContent = 'Please paste JSON or choose a .json file.';
      importErrorMsg.style.display = 'block';
      return;
    }

    try {
      const imported = soundPackManager.importPackFromJSON(text);
      importModal.classList.remove('active');
      soundEngine.playCorrect();
      alert(`Successfully imported ${imported.length} sound pack(s)! Active pack switched to "${imported[0].name}".`);
    } catch (err) {
      importErrorMsg.textContent = `Import error: ${err.message}`;
      importErrorMsg.style.display = 'block';
      soundEngine.playWrong();
    }
  });

  btnHint5050.addEventListener('click', () => {
    if (!gameSession || gameSession.hintUsed || gameSession.isRevealed) return;
    const eliminated = gameSession.use5050Hint();
    eliminated.forEach((idx) => {
      const card = optionsGrid.children[idx];
      if (card) card.classList.add('eliminated');
    });
    btnHint5050.disabled = true;
    btnHint5050.style.opacity = '0.4';
    soundEngine.playClick();
  });

  btnNextRound.addEventListener('click', () => {
    clearAllSequences();
    gameSession.nextQuestion();
    if (gameSession.isGameOver) {
      showGameOver();
    } else {
      loadCurrentRound();
    }
  });

  // Game Over actions
  btnGoHome.addEventListener('click', () => {
    gameoverModal.classList.remove('active');
    showHome();
  });

  btnGoReplay.addEventListener('click', () => {
    gameoverModal.classList.remove('active');
    startGame();
  });

  // Custom Lab Base64 File Uploader & Link Auto-Encoder
  if (labAudioFile) {
    labAudioFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (labBase64Badge) {
          labBase64Badge.style.display = 'inline-flex';
          labBase64Badge.textContent = '⏳ Encoding File to Base64...';
        }
        labBase64AudioData = await convertFileToBase64(file);
        if (labBase64Badge) {
          labBase64Badge.textContent = `⚡ ${file.name} (${Math.round(file.size / 1024)} KB Base64)`;
        }
        soundEngine.playClick();
      } catch (err) {
        alert('Failed to read audio file: ' + err.message);
        if (labBase64Badge) labBase64Badge.style.display = 'none';
      }
    });
  }

  if (labAudioUrl) {
    labAudioUrl.addEventListener('change', async () => {
      const url = labAudioUrl.value.trim();
      if (!url) {
        if (!labAudioFile?.files?.length) labBase64AudioData = null;
        return;
      }
      try {
        if (labBase64Badge) {
          labBase64Badge.style.display = 'inline-flex';
          labBase64Badge.textContent = '⏳ Fetching & Encoding URL to Base64...';
        }
        labBase64AudioData = await convertAudioUrlToBase64(url);
        if (labBase64Badge) {
          labBase64Badge.textContent = '⚡ Web Audio Base64 Encoded';
        }
      } catch (err) {
        if (labBase64Badge) labBase64Badge.style.display = 'none';
      }
    });
  }

  if (btnLabTestAudio) {
    btnLabTestAudio.addEventListener('click', () => {
      const soundItem = getCustomFormData();
      if (!soundItem) return;
      soundEngine.playSoundForQuestion(soundItem);
    });
  }

  // Custom Lab Save to Pack
  btnSavePackSound.addEventListener('click', () => {
    const targetPackId = labTargetPack.value;
    const soundItem = getCustomFormData();
    if (!soundItem) return;

    soundPackManager.addSoundToPack(targetPackId, soundItem);
    soundEngine.playCorrect();
    alert(`Sound riddle "${soundItem.title}" saved to sound pack with Base64 audio!`);
  });

  // Custom Lab Play Test
  customForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const soundItem = getCustomFormData();
    if (!soundItem) return;

    labModal.classList.remove('active');
    startCustomGame([soundItem]);
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (!gameSession || gameSession.isRevealed || !gameHud.classList.contains('active')) return;
    const key = e.key.toUpperCase();
    if (['A', '1'].includes(key)) handleSelectOption(0);
    if (['B', '2'].includes(key)) handleSelectOption(1);
    if (['C', '3'].includes(key)) handleSelectOption(2);
    if (['D', '4'].includes(key)) handleSelectOption(3);
    if (key === ' ' && gameSession.isListeningPhase) unlockOptionsAndStartTimer();
  });
}

function getCustomFormData() {
  const correctVal = parseInt(
    document.querySelector('input[name="lab-correct"]:checked').value,
    10
  );

  const audioUrlVal = document.getElementById('lab-audio-url').value.trim();
  const timerVal = parseInt(labTimerInput.value, 10) || 15;

  // Use either the direct Base64 encoded payload, or the entered URL
  const finalAudio = labBase64AudioData || (audioUrlVal.length > 0 ? audioUrlVal : null);

  return {
    id: `custom_${Date.now()}`,
    title: document.getElementById('lab-title').value,
    soundHint: document.getElementById('lab-hint').value,
    category: document.getElementById('lab-category').value,
    synthPreset: document.getElementById('lab-synth').value,
    audioUrl: finalAudio,
    timerSeconds: timerVal,
    options: [
      document.getElementById('lab-opt-0').value,
      document.getElementById('lab-opt-1').value,
      document.getElementById('lab-opt-2').value,
      document.getElementById('lab-opt-3').value,
    ],
    correctIndex: correctVal,
    revealTitle: document.getElementById('lab-rev-title').value,
    revealExplanation: document.getElementById('lab-rev-desc').value,
    funFact: document.getElementById('lab-rev-fact').value,
    sceneModel: document.getElementById('lab-scene').value,
    difficulty: 2,
  };
}

function setupLobbyEventListeners() {
  const openLobby = () => {
    requireAuth(() => {
      populateLobbyPackOptions();
      lobbyModal.classList.add('active');
      soundEngine.playClick();
    });
  };

  const btnLobbyNav = document.getElementById('btn-lobby-nav');
  if (btnLobbyNav) btnLobbyNav.addEventListener('click', openLobby);
  if (btnOpenLobbyHero) btnOpenLobbyHero.addEventListener('click', openLobby);
  if (btnCloseLobby) {
    btnCloseLobby.addEventListener('click', () => {
      lobbyModal.classList.remove('active');
    });
  }

  if (tabBtnCreateLobby && tabBtnJoinLobby) {
    tabBtnCreateLobby.addEventListener('click', () => {
      tabBtnCreateLobby.classList.add('active');
      tabBtnJoinLobby.classList.remove('active');
      lobbyTabCreate.classList.add('active');
      lobbyTabJoin.classList.remove('active');
      soundEngine.playClick();
    });

    tabBtnJoinLobby.addEventListener('click', () => {
      tabBtnJoinLobby.classList.add('active');
      tabBtnCreateLobby.classList.remove('active');
      lobbyTabJoin.classList.add('active');
      lobbyTabCreate.classList.remove('active');
      soundEngine.playClick();
    });
  }

  // Team Count Selector in Lobby Create
  let selectedLobbyTeamCount = 2;
  if (lobbyTeamCountSelector) {
    lobbyTeamCountSelector.querySelectorAll('.team-count-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        lobbyTeamCountSelector.querySelectorAll('.team-count-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        selectedLobbyTeamCount = parseInt(chip.dataset.count, 10) || 2;
        soundEngine.playClick();
      });
    });
  }

  if (btnCreateLobbySubmit) {
    btnCreateLobbySubmit.addEventListener('click', async () => {
      const user = googleAuth.getUser();
      if (!user) return;

      const packId = lobbyCreatePack.value;
      const pack = soundPackManager.getAllPacks().find((p) => p.id === packId) || soundPackManager.getActivePack();

      btnCreateLobbySubmit.disabled = true;
      btnCreateLobbySubmit.innerHTML = '<span>⏳ Initializing Serverless P2P Room...</span>';

      try {
        await lobbyClient.createLobby(user, pack, teamRoster.slice(0, selectedLobbyTeamCount), selectedMode);
        soundEngine.playCorrect();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      } catch (err) {
        alert('Could not create P2P room: ' + err.message);
      } finally {
        btnCreateLobbySubmit.disabled = false;
        btnCreateLobbySubmit.innerHTML = '<span>⚡ CREATE SERVERLESS P2P ROOM</span>';
      }
    });
  }

  if (btnJoinLobbySubmit) {
    btnJoinLobbySubmit.addEventListener('click', async () => {
      const code = joinLobbyInput.value.trim();
      if (!code) {
        alert('Please enter a 6-character room code (e.g. STEAM-4821)');
        return;
      }

      const user = googleAuth.getUser();
      btnJoinLobbySubmit.disabled = true;
      btnJoinLobbySubmit.innerHTML = '<span>⏳ Connecting to P2P Room...</span>';

      try {
        await lobbyClient.joinLobby(code, user);
        soundEngine.playCorrect();
      } catch (err) {
        alert('Join failed: ' + err.message);
      } finally {
        btnJoinLobbySubmit.disabled = false;
        btnJoinLobbySubmit.innerHTML = '<span>🚪 JOIN P2P WEBRTC ROOM</span>';
      }
    });
  }

  if (btnCopyLobbyId) {
    btnCopyLobbyId.addEventListener('click', () => {
      if (!lobbyClient.currentLobbyId) return;
      const shareUrl = `${window.location.origin}${window.location.pathname}?lobby=${lobbyClient.currentLobbyId}`;
      navigator.clipboard?.writeText(shareUrl).then(() => {
        alert(`Room link copied to clipboard!\n${shareUrl}`);
      }).catch(() => {
        alert(`Room ID: ${lobbyClient.currentLobbyId}`);
      });
    });
  }

  if (btnLeaveLobby) {
    btnLeaveLobby.addEventListener('click', () => {
      lobbyClient.leaveLobby();
      lobbyActiveRoom.style.display = 'none';
      lobbyTabsHeader.style.display = 'flex';
      lobbyTabCreate.classList.add('active');
      soundEngine.playClick();
    });
  }

  if (btnLaunchMultiplayerGame) {
    btnLaunchMultiplayerGame.addEventListener('click', () => {
      if (!lobbyClient.currentLobby) return;
      lobbyClient.sendAction('START_GAME', {});
      lobbyModal.classList.remove('active');
      startGame();
    });
  }
}

function populateLobbyPackOptions() {
  if (!lobbyCreatePack) return;
  lobbyCreatePack.innerHTML = '';
  const packs = soundPackManager.getAllPacks();
  const active = soundPackManager.getActivePack();

  packs.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.sounds.length} sound riddles)`;
    if (p.id === active.id) opt.selected = true;
    lobbyCreatePack.appendChild(opt);
  });
}

function onLobbyUpdated(lobby) {
  if (!lobby) {
    if (lobbyActiveRoom) lobbyActiveRoom.style.display = 'none';
    if (lobbyTabsHeader) lobbyTabsHeader.style.display = 'flex';
    return;
  }

  if (lobbyActiveRoom) lobbyActiveRoom.style.display = 'block';
  if (lobbyTabsHeader) lobbyTabsHeader.style.display = 'none';
  if (lobbyTabCreate) lobbyTabCreate.classList.remove('active');
  if (lobbyTabJoin) lobbyTabJoin.classList.remove('active');

  if (activeLobbyId) activeLobbyId.textContent = lobby.id;
  if (activeLobbyPack) activeLobbyPack.textContent = `📦 ${lobby.packName}`;

  // Render Players
  if (lobbyPlayersGrid) {
    lobbyPlayersGrid.innerHTML = '';
    const players = Object.values(lobby.players || {});

    players.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'lobby-player-card';
      const team = lobby.teams[p.teamId] || { name: `Team ${p.teamId + 1}`, color: '#d4af37' };
      card.style.setProperty('--team-color', team.color);

      let avatarSrc = p.user.picture || '';
      let avatarEl = avatarSrc
        ? `<img class="lobby-player-avatar" src="${avatarSrc}" alt="${p.user.name}">`
        : `<span style="font-size:1.4rem;">🧑‍✈️</span>`;

      let teamOptions = lobby.teams
        .map((t, idx) => `<option value="${idx}" ${idx === p.teamId ? 'selected' : ''}>${t.name}</option>`)
        .join('');

      card.innerHTML = `
        ${avatarEl}
        <div class="lobby-player-info">
          <div class="lobby-player-name">${p.user.name} ${p.isHost ? '👑 (Host)' : ''}</div>
          <div class="lobby-player-email">${p.user.email || 'Google Account'}</div>
        </div>
        <select class="lobby-team-select">
          ${teamOptions}
        </select>
      `;

      const select = card.querySelector('.lobby-team-select');
      select.addEventListener('change', (e) => {
        const newTeamId = parseInt(e.target.value, 10);
        lobbyClient.sendAction('ASSIGN_TEAM', { playerId: p.user.id, teamId: newTeamId });
      });

      lobbyPlayersGrid.appendChild(card);
    });
  }

  const isHost = lobby.hostId === googleAuth.getUser()?.id;
  if (btnLaunchMultiplayerGame) {
    btnLaunchMultiplayerGame.style.display = isHost ? 'inline-flex' : 'none';
  }

  // If lobby status changed to BROADCASTING, launch multiplayer game
  if (lobby.game && lobby.game.status === 'BROADCASTING' && homeView.classList.contains('active')) {
    lobbyModal.classList.remove('active');
    startGame();
  }
}

function clearAllSequences() {
  if (gameTimerId) {
    clearInterval(gameTimerId);
    gameTimerId = null;
  }
  sequenceTimers.forEach((t) => clearTimeout(t));
  sequenceTimers = [];
  lastTickSecond = -1;
  soundEngine.stopQuestionAudio();
}

function showHome() {
  clearAllSequences();
  const viewerHud = document.getElementById('scene-viewer-hud');
  if (viewerHud) {
    viewerHud.classList.remove('active');
    viewerHud.style.display = 'none';
  }

  gameoverModal.classList.remove('active');
  gameHud.classList.remove('active');
  homeView.classList.add('active');

  const activePack = soundPackManager.getActivePack();
  sceneManager.loadThemeScene(activePack.sounds[0] || activePack, activePack);
  sceneManager.setRevealed(true);
}

const GUIDE_SEEN_KEY = 'sexercise_first_session_guide_seen';

function checkFirstSessionGuide(onProceed) {
  const seen = localStorage.getItem(GUIDE_SEEN_KEY);
  if (!seen) {
    localStorage.setItem(GUIDE_SEEN_KEY, 'true');
    guideModal.classList.add('active');

    const handleClose = () => {
      guideModal.classList.remove('active');
      btnCloseGuide.removeEventListener('click', handleClose);
      const btnGuideStart = document.getElementById('btn-guide-start-game');
      if (btnGuideStart) btnGuideStart.removeEventListener('click', handleClose);
      onProceed();
    };

    btnCloseGuide.addEventListener('click', handleClose, { once: true });
    const btnGuideStart = document.getElementById('btn-guide-start-game');
    if (btnGuideStart) btnGuideStart.addEventListener('click', handleClose, { once: true });
  } else {
    onProceed();
  }
}

function startGame(category = null) {
  checkFirstSessionGuide(() => {
    clearAllSequences();
    const roundCount = Math.max(6, teamRoster.length * 3);
    const questions = soundPackManager.getRandomQuestionsFromActive(roundCount, category);
    if (questions.length === 0) {
      alert('No questions found in this pack/category. Please select another.');
      return;
    }

    gameSession = new GameSession(questions, selectedMode, teamRoster);

    renderHudScoreboard();

    homeView.classList.remove('active');
    gameHud.classList.add('active');

    soundEngine.playGearSpin();
    loadCurrentRound();
  });
}

function startCustomGame(questions) {
  checkFirstSessionGuide(() => {
    clearAllSequences();
    gameSession = new GameSession(questions, selectedMode, teamRoster);

    renderHudScoreboard();

    homeView.classList.remove('active');
    gameHud.classList.add('active');

    soundEngine.playGearSpin();
    loadCurrentRound();
  });
}

function renderHudScoreboard() {
  if (!hudTeamScoreboard || !gameSession) return;
  hudTeamScoreboard.innerHTML = '';

  gameSession.teams.forEach((team, idx) => {
    const badge = document.createElement('div');
    badge.className = `hud-team-score-badge ${idx === gameSession.activeTeamIndex ? 'active-turn' : ''}`;
    badge.id = `hud-team-badge-${idx}`;
    badge.style.setProperty('--team-color', team.color);

    let avatarHtml = '';
    if (team.avatar) {
      avatarHtml = `<img class="hud-team-avatar" src="${team.avatar}" alt="${team.name}">`;
    } else {
      const emojis = ['⚙️', '⚡', '🦊', '🎈', '🧪', '📻', '🕵️', '🚀', '🏆', '🔧'];
      avatarHtml = `<span style="font-size:0.95rem;">${emojis[idx % emojis.length]}</span>`;
    }

    badge.innerHTML = `
      ${avatarHtml}
      <span class="hud-team-score-name" id="hud-name-${idx}">${team.name}</span>
      <span class="hud-team-score-pts" id="hud-score-${idx}">${team.score} PTS</span>
    `;

    hudTeamScoreboard.appendChild(badge);
  });
}

function updateScoreboardUI() {
  if (!gameSession) return;
  const active = gameSession.activeTeam;

  gameSession.teams.forEach((team, idx) => {
    const badge = document.getElementById(`hud-team-badge-${idx}`);
    const scoreEl = document.getElementById(`hud-score-${idx}`);
    const nameEl = document.getElementById(`hud-name-${idx}`);
    if (scoreEl) scoreEl.textContent = `${team.score} PTS`;
    if (nameEl) nameEl.textContent = team.name;
    if (badge) {
      if (idx === gameSession.activeTeamIndex) {
        badge.classList.add('active-turn');
      } else {
        badge.classList.remove('active-turn');
      }
    }
  });

  hudRound.textContent = `ROUND ${gameSession.currentIndex + 1}/${gameSession.totalQuestions}`;

  // Update Turn Banner with Active Team's Contrasting Color
  turnText.textContent = `👉 NOW PLAYING: ${active.name.toUpperCase()}`;
  turnAnnouncementBar.style.borderColor = active.color;
  turnAnnouncementBar.style.boxShadow = `0 0 20px ${active.color}66`;
  hudStreak.textContent = `🔥 ${active.streak} STREAK (${gameSession.comboMultiplier.toFixed(1)}x)`;

  // Update 3D Lighting Tint for active team
  sceneManager.setTeamColor(active.color);
}

function loadCurrentRound() {
  clearAllSequences();

  const q = gameSession.currentQuestion;
  if (!q) return;

  updateScoreboardUI();

  // Reset UI components for 3-Listen Broadcast Phase
  listenPhaseCard.style.display = 'block';
  optionsContainer.style.display = 'none';
  revealCard.classList.remove('active');

  // Reset 50/50 Button
  btnHint5050.disabled = false;
  btnHint5050.style.opacity = '1';

  // Pack-Defined Timer Initialization
  const initialTime = gameSession.getInitialRoundTime();
  timerBar.style.width = '100%';
  timerBar.style.backgroundColor = gameSession.activeTeam.color;
  timerSecPill.textContent = `⏳ ${Math.ceil(initialTime)}s`;
  timerSecPill.style.color = 'var(--primary)';
  timerSecPill.style.borderColor = 'var(--primary)';

  // Update Acoustic Prompt
  hudHint.textContent = q.soundHint;
  hudQuestionTitle.textContent = 'What is making this sound?';

  // Render Options (hidden initially behind listen phase)
  optionsGrid.innerHTML = '';
  q.options.forEach((optText, idx) => {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.innerHTML = `
      <div class="opt-letter">${String.fromCharCode(65 + idx)}</div>
      <div class="opt-text">${optText}</div>
    `;
    card.addEventListener('click', () => handleSelectOption(idx));
    optionsGrid.appendChild(card);
  });

  // 3D Scene Update (Theme / Riddle Script Driven)
  const activePack = soundPackManager.getActivePack();
  sceneManager.loadThemeScene(q, activePack);
  sceneManager.setRevealed(false);
  sceneManager.setMediaForTheme(q);

  // START AUTOMATED 3-LISTEN BROADCAST SEQUENCE
  executeThreeListenSequence(q);
}

function executeThreeListenSequence(question) {
  // Stage 1: Broadcast 1 of 3
  updateListenStageUI(1);
  sceneManager.triggerEvent('BROADCAST_PULSE', { stage: 1, question });
  soundEngine.playSoundForQuestion(question);

  // Stage 2: Broadcast 2 of 3 (after 1.8s)
  const t2 = setTimeout(() => {
    updateListenStageUI(2);
    sceneManager.triggerEvent('BROADCAST_PULSE', { stage: 2, question });
    soundEngine.playSoundForQuestion(question);
  }, 1800);
  sequenceTimers.push(t2);

  // Stage 3: Broadcast 3 of 3 (after 3.6s)
  const t3 = setTimeout(() => {
    updateListenStageUI(3);
    sceneManager.triggerEvent('BROADCAST_PULSE', { stage: 3, question });
    soundEngine.playSoundForQuestion(question);
  }, 3600);
  sequenceTimers.push(t3);

  // Stage 4: 3 Listens Completed -> UNLOCK OPTIONS & START PACK TIMER (after 5.4s)
  const tUnlock = setTimeout(() => {
    unlockOptionsAndStartTimer();
  }, 5400);
  sequenceTimers.push(tUnlock);
}

function updateListenStageUI(stage) {
  listenStageTitle.textContent = `HEARING SOUND (BROADCAST ${stage} OF 3)...`;
  listenMeterFill.style.width = `${stage * 33.33}%`;

  let dots = '';
  for (let i = 0; i < 3; i++) {
    dots += i < stage ? '● ' : '○ ';
  }
  listenDots.textContent = dots.trim();
  listenCountLabel.textContent = `(${stage} of 3)`;
}

function unlockOptionsAndStartTimer() {
  if (!gameSession || gameSession.isRevealed) return;

  // Clear any pending broadcast timeouts
  sequenceTimers.forEach((t) => clearTimeout(t));
  sequenceTimers = [];

  gameSession.unlockChoosingPhase();

  listenPhaseCard.style.display = 'none';
  optionsContainer.style.display = 'block';

  // Sound effect for console unlock
  soundEngine.playClick();

  // START PACK-DEFINED TIMER
  if (gameSession.mode !== 'zen' && !gameTimerId) {
    const roundTime = gameSession.getInitialRoundTime();
    gameSession.timeRemaining = roundTime;

    gameTimerId = setInterval(() => {
      const expired = gameSession.decrementTimer(0.1);
      const pct = (gameSession.timeRemaining / roundTime) * 100;
      timerBar.style.width = `${pct}%`;
      const curSec = Math.ceil(gameSession.timeRemaining);
      timerSecPill.textContent = `⏳ ${curSec}s`;

      // Tick audio countdown under 5 seconds!
      if (curSec <= 5 && curSec !== lastTickSecond && curSec > 0) {
        lastTickSecond = curSec;
        soundEngine.playTimerTick();
      }

      if (gameSession.timeRemaining < 4) {
        timerBar.style.backgroundColor = 'var(--error)';
        timerSecPill.style.color = 'var(--error)';
        timerSecPill.style.borderColor = 'var(--error)';
      }

      if (expired) {
        handleRoundReveal(false, -1);
      }
    }, 100);
  } else if (gameSession.mode === 'zen') {
    timerBar.style.width = '100%';
    timerSecPill.textContent = '⏳ UNTIMED';
  }
}

function handleSelectOption(index) {
  if (!gameSession || gameSession.isRevealed) return;
  if (gameSession.eliminatedIndices.has(index)) return;

  const isCorrect = gameSession.submitAnswer(index);
  sceneManager.triggerEvent('ANSWER_SUBMIT', { index, isCorrect, team: gameSession.activeTeam });
  handleRoundReveal(isCorrect, index);
}

function handleRoundReveal(isCorrect, selectedIndex) {
  clearAllSequences();
  const q = gameSession.currentQuestion;
  const activeTeam = gameSession.activeTeam;

  // Unseal 3D Steampunk Shutter and trigger 3D scene reveal events
  sceneManager.setRevealed(true);
  sceneManager.triggerEvent('ROUND_REVEAL', { isCorrect, selectedIndex, question: q, team: activeTeam });
  soundEngine.playShatter();

  // Audio & Visual feedback
  if (isCorrect) {
    soundEngine.playCorrect();
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.6 },
      colors: [activeTeam.color, '#ffbe0b', '#d4af37', '#ffffff'],
    });
  } else {
    soundEngine.playWrong();
  }

  // Update Option Card Styles
  Array.from(optionsGrid.children).forEach((card, idx) => {
    if (idx === q.correctIndex) {
      card.classList.add('correct');
    } else if (idx === selectedIndex) {
      card.classList.add('wrong');
    }
  });

  // Hide Options Console & Show Reveal Card
  optionsContainer.style.display = 'none';
  hudQuestionTitle.textContent = q.revealTitle;

  const lastResult = gameSession.history[gameSession.history.length - 1];
  const pts = lastResult ? lastResult.pointsEarned : 0;

  if (isCorrect) {
    revealStatus.className = 'reveal-status success';
    revealIcon.textContent = '🎉';
    revealMsg.textContent = `${activeTeam.name} NAILED IT! (+${pts} PTS)`;
  } else {
    revealStatus.className = 'reveal-status fail';
    revealIcon.textContent = '❌';
    revealMsg.textContent = `${activeTeam.name} MISSED! (Actual: ${q.options[q.correctIndex]})`;
  }

  revealSourceTitle.textContent = q.revealTitle;
  revealExplanation.textContent = q.revealExplanation;
  revealTrivia.textContent = q.funFact;

  btnNextRound.textContent =
    gameSession.currentIndex < gameSession.totalQuestions - 1
      ? 'NEXT TEAM TURN ➡️'
      : 'VIEW FINAL WINNER 🏆';

  revealCard.classList.add('active');

  updateScoreboardUI();
}

function showGameOver() {
  clearAllSequences();

  const { winner, leaderboard, isTie } = gameSession.getWinner();

  if (isTie) {
    goWinnerTitle.textContent = `🤝 IT'S A TIE SHOWDOWN!`;
  } else {
    goWinnerTitle.textContent = `🏆 ${winner.name.toUpperCase()} WINS!`;
    soundEngine.playVictoryFanfare();
    confetti({ particleCount: 180, spread: 120, origin: { y: 0.5 }, colors: [winner.color, '#ffd700', '#ffffff'] });
  }

  goScore.textContent = `FINAL SHOWDOWN LEADERBOARD`;

  // Render N-Team Leaderboard & Podium Cards
  if (goTeamResultsGrid) {
    goTeamResultsGrid.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️', '🎖️', '🎖️', '🎖️'];

    leaderboard.forEach((team, rankIdx) => {
      const box = document.createElement('div');
      box.className = `team-result-box ${rankIdx === 0 && !isTie ? 'winner-box' : ''}`;
      box.style.setProperty('--team-color', team.color);

      box.innerHTML = `
        <span class="team-rank-badge">${medals[rankIdx] || '🎖️'}</span>
        <div class="team-res-header" style="color:${team.color}; font-weight:900;">${team.name}</div>
        <div class="team-res-score" style="color:${team.color}; font-size:1.6rem; font-weight:900; margin:6px 0;">${team.score} PTS</div>
        <div class="team-res-meta" style="font-size:0.75rem; color:var(--text-muted);">${team.correctCount} Correct • Max Streak ${team.maxStreak} 🔥</div>
      `;
      goTeamResultsGrid.appendChild(box);
    });
  }

  // Render Round-by-Round Breakdown
  goRecapList.innerHTML = '';
  gameSession.history.forEach((res) => {
    const item = document.createElement('div');
    item.className = 'recap-item';
    item.innerHTML = `
      <span>${res.isCorrect ? '✅' : '❌'}</span>
      <div style="flex:1;">
        <strong style="color:${res.teamColor};">[${res.teamName}]</strong> <strong>${res.question.revealTitle}</strong>
        <p style="font-size:0.75rem; color:#d4a373;">
          ${res.isCorrect ? `+${res.pointsEarned} pts in ${res.timeTaken.toFixed(1)}s` : `Actual: ${res.question.options[res.question.correctIndex]}`}
        </p>
      </div>
    `;
    goRecapList.appendChild(item);
  });

  gameoverModal.classList.add('active');
}

window.addEventListener('DOMContentLoaded', init);
