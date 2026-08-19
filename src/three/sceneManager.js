import * as THREE from 'three';
import { SceneModelFactory } from './sceneModels.js';
import { ThemeSceneEngine } from './themeSceneEngine.js';
import { MysteryShield3D } from './mysteryShield3D.js';
import { AudioVisualizer3D } from './audioVisualizer3D.js';

import { SteampunkStage3D } from './steampunkStage3D.js';




export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a0f08); // Warm dark mahogany theater backdrop
    this.scene.fog = new THREE.FogExp2(0x1a0f08, 0.018);

    this.camera = new THREE.PerspectiveCamera(48, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 1.3, 6.6);
    this.targetCameraPos = new THREE.Vector3(0, 1.3, 6.6);
    this.targetCameraLookAt = new THREE.Vector3(0, 0.3, 0);

    this.cameraShakeIntensity = 0;
    this.isRevealedState = false;

    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.75 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.container.appendChild(this.renderer.domElement);

    // Mobile / Android WebGL Context Restoration
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('[SceneManager] WebGL Context Lost on mobile device.');
    });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      console.log('[SceneManager] WebGL Context Restored. Reinitializing scene...');
      this.onWindowResize();
    });

    this.clock = new THREE.Clock();
    this.currentModel = null;

    this._setupEnvironment();
    this.stage = new SteampunkStage3D(this.scene, 'default');
    this.shield = new MysteryShield3D(this.scene);
    this.visualizer = new AudioVisualizer3D(this.scene);

    this._setupInteraction();
    window.addEventListener('resize', () => this.onWindowResize());
  }

  _setupEnvironment() {
    // Warm Ambient Light
    const ambient = new THREE.AmbientLight(0xffeedd, 1.1);
    this.scene.add(ambient);

    // Main Stage Key Light
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.6);
    keyLight.position.set(0, 5, 6);
    this.scene.add(keyLight);

    // Warm Gold Stage Spotlight (Edison Incandescent)
    this.mainLight = new THREE.SpotLight(0xffbe0b, 5.0, 30, Math.PI / 3.2, 0.45, 1);
    this.mainLight.position.set(0, 8.5, 5);
    this.mainLight.target.position.set(0, 0, 0);
    this.scene.add(this.mainLight);
    this.scene.add(this.mainLight.target);

    // Dynamic Team Colored Rim Light
    this.rimLight = new THREE.DirectionalLight(0xd4af37, 2.8);
    this.rimLight.position.set(-6, 5, -4);
    this.scene.add(this.rimLight);

    // Dynamic TV Contrast Light
    this.tvFill = new THREE.DirectionalLight(0x00f0ff, 1.8);
    this.tvFill.position.set(6, 4, -3);
    this.scene.add(this.tvFill);

    // Stage Footlights
    this.footlight = new THREE.PointLight(0xff9900, 2.8, 10);
    this.footlight.position.set(0, -1.4, 3.5);
    this.scene.add(this.footlight);
  }

  setTeamColor(colorHex) {
    if (!colorHex) return;
    const col = new THREE.Color(colorHex);
    this.rimLight.color.copy(col);
    this.footlight.color.copy(col);
  }

  _setupInteraction() {
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotVelocity = { x: 0, y: 0 };

    const onStart = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.rotVelocity.y += deltaX * 0.0035;
      this.rotVelocity.x += deltaY * 0.0035;

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    // Pointer Events (Mouse + Stylus + Primary Touch)
    this.container.addEventListener('pointerdown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));

    // Touch Events for Android & Mobile Safari
    this.container.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          onStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (this.isDragging && e.touches.length === 1) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );

    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
  }

  loadThemeScene(questionOrTheme, packTheme = {}) {
    if (this.currentModel) {
      if (this.currentModel.userData && typeof this.currentModel.userData.dispose === 'function') {
        this.currentModel.userData.dispose();
      }
      this.scene.remove(this.currentModel);
      this.currentModel = null;
    }

    // Apply theme-level 3D environment overrides if defined
    if (packTheme.theme3D) {
      const t3d = packTheme.theme3D;
      if (t3d.background) this.scene.background = new THREE.Color(t3d.background);
      if (t3d.fogColor) this.scene.fog.color = new THREE.Color(t3d.fogColor);
      if (t3d.ambientLight && this.mainLight) this.mainLight.color = new THREE.Color(t3d.ambientLight);
    }

    this.currentModel = ThemeSceneEngine.buildScene(questionOrTheme, {
      packTheme,
      isRevealed: this.isRevealedState,
    });
    this.scene.add(this.currentModel);
  }

  loadModel(modelKey) {
    if (typeof modelKey === 'object' && modelKey !== null) {
      this.loadThemeScene(modelKey);
      return;
    }
    this.loadThemeScene({ sceneModel: modelKey });
  }

  /**
   * Triggers an update/lifecycle event across the active 3D model, stage, and shield.
   * @param {string} eventName Name of event ('BROADCAST_PULSE', 'ROUND_REVEAL', 'ANSWER_CORRECT', 'THEME_UPDATE', 'REVISION_UPDATED')
   * @param {Object} payload Event parameters
   */
  triggerEvent(eventName, payload = {}) {
    if (this.currentModel && this.currentModel.userData) {
      if (typeof this.currentModel.userData.onEvent === 'function') {
        try {
          this.currentModel.userData.onEvent(eventName, payload);
        } catch (err) {
          console.warn(`[SceneManager] Error in model onEvent("${eventName}"):`, err);
        }
      }
    }
    if (this.stage && typeof this.stage.triggerEvent === 'function') {
      this.stage.triggerEvent(eventName, payload);
    }
    if (this.shield && typeof this.shield.triggerEvent === 'function') {
      this.shield.triggerEvent(eventName, payload);
    }
  }

  /**
   * Hot-reloads and triggers updates on the active 3D scene without page reloads.
   * @param {Object} questionOrTheme Question or theme pack definition
   * @param {Object} updates Optional partial overrides to apply
   */
  hotReload3D(questionOrTheme, updates = {}) {
    const merged = { ...(questionOrTheme || {}), ...updates };
    this.loadThemeScene(merged, updates.packTheme || {});
    this.triggerEvent('REVISION_UPDATED', { target: merged });
  }

  setMediaForTheme(question) {
    if (this.stage) {
      this.stage.setMediaForTheme(question);
    }
  }

  setRevealed(revealed) {
    this.isRevealedState = Boolean(revealed);
    this.shield.setRevealed(revealed);
    if (this.stage) {
      this.stage.setRevealed(revealed);
    }
    if (revealed) {
      // Cinematic zoom into the unblurred reveal + camera impact shake
      this.targetCameraPos.set(0, 1.1, 4.6);
      this.cameraShakeIntensity = 0.15;
      if (this.currentModel && this.currentModel.userData && typeof this.currentModel.userData.onReveal === 'function') {
        this.currentModel.userData.onReveal();
      }
    } else {
      // Wide overview showing stage, pistons, and TVs
      this.targetCameraPos.set(0, 1.3, 6.6);
    }
  }

  onWindowResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  render(freqData, audioVolume) {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth camera interpolation
    this.camera.position.lerp(this.targetCameraPos, 0.06);

    // Camera shake effect on reveal
    if (this.cameraShakeIntensity > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShakeIntensity;
      this.cameraShakeIntensity *= 0.9;
    }

    // Subtle ambient camera sway
    const swayX = Math.sin(time * 0.5) * 0.15;
    const swayY = Math.cos(time * 0.4) * 0.08;

    // Apply drag rotation inertia to central 3D model
    if (this.currentModel) {
      this.currentModel.rotation.y += this.rotVelocity.y;
      this.currentModel.rotation.x += this.rotVelocity.x;
      this.rotVelocity.x *= 0.92;
      this.rotVelocity.y *= 0.92;

      this.currentModel.rotation.x = Math.max(-0.4, Math.min(0.4, this.currentModel.rotation.x));

      if (this.currentModel.userData && typeof this.currentModel.userData.update === 'function') {
        this.currentModel.userData.update(time, audioVolume, delta, freqData, this.isRevealedState);
      }
    }

    // Update Stage (Pistons, Gears, Marquee lights, Color CRT TVs, Geysers, Sparks)
    if (this.stage) {
      this.stage.update(delta, time, audioVolume, freqData);
    }

    // Update Shield & Visualizer
    this.shield.update(delta, time, audioVolume);
    this.visualizer.update(freqData);

    // Spotlight audio reaction
    this.mainLight.intensity = 4.0 + audioVolume * 4.2;

    this.camera.lookAt(this.targetCameraLookAt.x + swayX * 0.2, this.targetCameraLookAt.y + swayY * 0.2, this.targetCameraLookAt.z);
    this.renderer.render(this.scene, this.camera);
  }
}
