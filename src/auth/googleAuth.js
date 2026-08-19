const STORAGE_USER_KEY = 'sexercise_google_user_v1';
const RECENT_ACCOUNTS_KEY = 'sexercise_google_recent_accounts_v1';
const CLIENT_ID = '827895562255-7p0b7froaehj981skdfsfi22sb7luhb8.apps.googleusercontent.com';

class GoogleAuthManager {
  constructor() {
    this.currentUser = null;
    this.tokenClient = null;
    this.listeners = [];
    this.clientId = CLIENT_ID;
    this.loadStoredUser();
    this._setupWindowAuthListener();
  }

  loadStoredUser() {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load user from localStorage:', e);
      this.currentUser = null;
    }
  }

  saveUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      this._saveRecentAccount(user);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
    this._notifyListeners();
  }

  _saveRecentAccount(user) {
    try {
      let accounts = this.getRecentAccounts();
      accounts = accounts.filter((a) => a.email !== user.email);
      accounts.unshift(user);
      if (accounts.length > 5) accounts = accounts.slice(0, 5);
      localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {}
  }

  getRecentAccounts() {
    try {
      const raw = localStorage.getItem(RECENT_ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: 'google_brass_1',
        name: 'Captain Clockwork',
        givenName: 'Clockwork',
        email: 'captain.brass@gmail.com',
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=captain.brass@gmail.com',
      },
    ];
  }

  addListener(fn) {
    this.listeners.push(fn);
    if (this.currentUser) {
      fn(this.currentUser);
    }
  }

  removeListener(fn) {
    this.listeners = this.listeners.filter((l) => l !== fn);
  }

  _notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.currentUser);
      } catch (err) {
        console.error(err);
      }
    });
  }

  getUser() {
    return this.currentUser;
  }

  isSignedIn() {
    return Boolean(this.currentUser);
  }

  // Parse JWT token from Google Identity Services
  decodeJwt(credential) {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode Google JWT credential:', e);
      return null;
    }
  }

  handleCredentialResponse(response) {
    if (!response || !response.credential) return null;

    const payload = this.decodeJwt(response.credential);
    if (!payload) return null;

    const user = {
      id: payload.sub,
      name: payload.name || payload.given_name || 'Google Player',
      givenName: payload.given_name || payload.name,
      email: payload.email,
      picture: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${payload.sub}`,
      signedInAt: Date.now(),
    };

    this.saveUser(user);
    return user;
  }

  // Fetch verified user profile with Google OAuth2 Access Token
  async fetchGoogleUserInfo(accessToken) {
    if (!accessToken) return null;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error(`Google API error: ${res.status}`);
      const data = await res.json();
      const user = {
        id: data.sub || `google_${Date.now()}`,
        name: data.name || data.email.split('@')[0],
        givenName: data.given_name || data.name || data.email.split('@')[0],
        email: data.email,
        picture: data.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.email}`,
        signedInAt: Date.now(),
      };
      this.saveUser(user);
      return user;
    } catch (err) {
      console.warn('Error fetching user info from Google:', err);
      return null;
    }
  }

  // Listen for popup OAuth token response
  _setupWindowAuthListener() {
    if (typeof window === 'undefined') return;

    // Check if the current window is an OAuth redirect containing the token
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_AUTH_TOKEN', accessToken }, '*');
          window.close();
          return;
        } else {
          this.fetchGoogleUserInfo(accessToken);
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }

    // Parent window listener for messages from the popup
    window.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_TOKEN' && event.data.accessToken) {
        const user = await this.fetchGoogleUserInfo(event.data.accessToken);
        if (user) {
          const statusEl = document.getElementById('detect-status-text');
          if (statusEl) {
            statusEl.textContent = `✅ Account detected: ${user.name}! Unlocking...`;
            statusEl.style.color = 'var(--success)';
          }
        }
      }
    });
  }

  // Initialize GIS and One Tap
  initGIS(callback) {
    if (typeof window === 'undefined') return;

    const updateStatus = (msg, isSuccess = false) => {
      const statusEl = document.getElementById('detect-status-text');
      const spinnerEl = document.querySelector('.detect-spinner');
      if (statusEl) {
        statusEl.textContent = msg;
        if (isSuccess) statusEl.style.color = 'var(--success)';
      }
      if (spinnerEl && isSuccess) {
        spinnerEl.textContent = '✅';
      }
    };

    const setupGIS = () => {
      if (window.google && window.google.accounts) {
        try {
          updateStatus('🔍 Checking active Google account in browser...');

          if (window.google.accounts.id) {
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: (res) => {
                const user = this.handleCredentialResponse(res);
                if (user) {
                  updateStatus(`✅ Welcome ${user.name}! Unlocking...`, true);
                }
                if (callback) callback(user);
              },
              auto_select: true,
              itp_support: true,
              use_fedcm_for_prompt: true,
              context: 'signin',
              cancel_on_tap_outside: false,
            });

            if (!this.isSignedIn()) {
              window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  updateStatus('👉 Select your Google account to step onto the stage');
                }
              });
            } else {
              updateStatus(`✅ Active session: ${this.currentUser.name}`, true);
            }
          }

          if (window.google.accounts.oauth2) {
            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: this.clientId,
              scope: 'openid email profile',
              callback: async (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                  const user = await this.fetchGoogleUserInfo(tokenResponse.access_token);
                  if (callback && user) callback(user);
                }
              },
            });
          }
        } catch (err) {
          console.warn('GIS init notice:', err);
          updateStatus('👉 Click below to sign in with Google');
        }
      }
    };

    if (window.google && window.google.accounts) {
      setupGIS();
    } else {
      let checkCount = 0;
      const interval = setInterval(() => {
        checkCount++;
        if (window.google && window.google.accounts) {
          clearInterval(interval);
          setupGIS();
        } else if (checkCount > 15) {
          clearInterval(interval);
          updateStatus('👉 Click below to sign in with Google');
        }
      }, 200);
    }
  }

  // Open the Official Google OAuth2 Account Selector Popup Window
  openGoogleOAuthPopup(onSuccess) {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      this.clientId
    )}&response_type=token&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&prompt=select_account`;

    const popup = window.open(
      authUrl,
      'Google Account Chooser',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    if (popup) {
      popup.focus();

      // Poll in case popup closes or returns
      const pollTimer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(pollTimer);
            if (this.isSignedIn() && onSuccess) {
              onSuccess(this.getUser());
            }
          }
        } catch (e) {}
      }, 500);
    } else {
      // Fallback to token client or dedicated chooser modal if popup was blocked
      this.openGoogleAccountPickerModal(onSuccess);
    }
  }

  // Trigger Google Sign-In
  triggerGoogleSignIn(onSuccess) {
    if (this.tokenClient) {
      try {
        this.tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.warn('tokenClient failed, falling back to popup window:', e);
      }
    }

    // Direct Google OAuth Popup
    this.openGoogleOAuthPopup(onSuccess);
  }

  openGoogleAccountPickerModal(onSuccess) {
    const modal = document.getElementById('google-account-picker-modal');
    if (modal) {
      this.renderAccountPickerList(onSuccess);
      modal.classList.add('active');
    } else {
      this.openGoogleOAuthPopup(onSuccess);
    }
  }

  renderAccountPickerList(onSuccess) {
    const listEl = document.getElementById('google-account-picker-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    const accounts = this.getRecentAccounts();

    accounts.forEach((acc) => {
      const item = document.createElement('div');
      item.className = 'google-account-item';
      item.innerHTML = `
        <img class="google-account-avatar" src="${acc.picture}" alt="${acc.name}">
        <div class="google-account-info">
          <div class="google-account-name">${acc.name}</div>
          <div class="google-account-email">${acc.email}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        const modal = document.getElementById('google-account-picker-modal');
        if (modal) modal.classList.remove('active');
        this.saveUser(acc);
        if (onSuccess) onSuccess(acc);
      });

      listEl.appendChild(item);
    });

    const anotherItem = document.createElement('div');
    anotherItem.className = 'google-account-item google-account-item-add';
    anotherItem.innerHTML = `
      <div class="google-add-icon">👤➕</div>
      <div class="google-account-info">
        <div class="google-account-name">Add another Google Account...</div>
      </div>
    `;
    anotherItem.addEventListener('click', () => {
      const modal = document.getElementById('google-account-picker-modal');
      if (modal) modal.classList.remove('active');
      this.openGoogleOAuthPopup(onSuccess);
    });
    listEl.appendChild(anotherItem);
  }

  signInAsDemoUser(name = 'Steampunk Player', email = 'player@foleyshow.com') {
    const demoUser = {
      id: `demo_${Date.now()}`,
      name: name,
      givenName: name.split(' ')[0],
      email: email,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      signedInAt: Date.now(),
    };
    this.saveUser(demoUser);
    return demoUser;
  }

  signOut() {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {}
    }
    this.saveUser(null);
  }
}

export const googleAuth = new GoogleAuthManager();
