import * as THREE from 'three';

export class VintageTV3D {
  constructor(sceneOrOptions = {}, maybeOptions = {}) {
    let options = {};
    if (sceneOrOptions && (sceneOrOptions.isScene || sceneOrOptions.type === 'Scene')) {
      options = maybeOptions || {};
    } else {
      options = sceneOrOptions || {};
    }

    this.group = new THREE.Group();
    this.group.name = options.name || 'vintageTV';

    if (options.position) {
      this.x = options.position.x || 0;
      this.y = options.position.y || 0;
      this.z = options.position.z || 0;
    } else {
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.z = options.z || 0;
    }

    this.scale = typeof options.scale === 'number' ? options.scale : 1.0;

    if (options.rotation) {
      this.rotationY = options.rotation.y !== undefined ? options.rotation.y : (options.rotationY || 0);
    } else {
      this.rotationY = options.rotationY || 0;
    }

    this.videoElement = null;
    this.videoTexture = null;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 384;
    this.ctx = this.canvas.getContext('2d');
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.minFilter = THREE.LinearFilter;
    this.canvasTexture.magFilter = THREE.LinearFilter;

    this.currentThemeData = {
      title: 'GUESSOUND TV',
      category: 'FOLEY MYSTERY',
      icon: '🎙️',
      color: '#ffbe0b',
    };

    this.antennaAngle = 0;
    this.isRevealed = false;

    this._buildCabinet();
    this.group.position.set(this.x, this.y, this.z);
    this.group.scale.setScalar(this.scale);
    this.group.rotation.y = this.rotationY;
  }

  _buildCabinet() {
    // 1. Rich Mahogany Wooden Cabinet
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4a2511,
      roughness: 0.4,
      metalness: 0.1,
    });
    const cabGeo = new THREE.BoxGeometry(2.4, 1.9, 1.4);
    const cabinet = new THREE.Mesh(cabGeo, woodMat);
    this.group.add(cabinet);

    // Brass Bezel Frame around Screen
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bezelGeo = new THREE.BoxGeometry(1.7, 1.3, 0.1);
    const bezel = new THREE.Mesh(bezelGeo, brassMat);
    bezel.position.set(-0.25, 0.1, 0.72);
    this.group.add(bezel);

    // 2. Curved CRT Glass Screen
    const crtGeo = new THREE.PlaneGeometry(1.5, 1.1, 8, 8);
    // Slightly curve vertices
    const pos = crtGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const dist = Math.sqrt(px * px + py * py);
      pos.setZ(i, -Math.pow(dist * 0.25, 2));
    }
    crtGeo.computeVertexNormals();

    this.screenMat = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      toneMapped: false,
    });
    this.screenMesh = new THREE.Mesh(crtGeo, this.screenMat);
    this.screenMesh.position.set(-0.25, 0.1, 0.78);
    this.group.add(this.screenMesh);

    // CRT Screen Glass Bulb Glow Overlay
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.35,
    });
    const glassMesh = new THREE.Mesh(crtGeo, glassMat);
    glassMesh.position.set(-0.25, 0.1, 0.79);
    this.group.add(glassMesh);

    // 3. Right Control Panel (Knobs, Speaker Grille, Dials)
    const dialMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
    const knob1Geo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16);
    this.knob1 = new THREE.Mesh(knob1Geo, dialMat);
    this.knob1.rotation.x = Math.PI / 2;
    this.knob1.position.set(0.8, 0.45, 0.75);

    const knob2Geo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16);
    this.knob2 = new THREE.Mesh(knob2Geo, dialMat);
    this.knob2.rotation.x = Math.PI / 2;
    this.knob2.position.set(0.8, 0.1, 0.75);
    this.group.add(this.knob1, this.knob2);

    // Speaker Slits
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x1a110a, roughness: 0.8 });
    const speakerGeo = new THREE.BoxGeometry(0.35, 0.4, 0.05);
    const speaker = new THREE.Mesh(speakerGeo, speakerMat);
    speaker.position.set(0.8, -0.4, 0.72);
    this.group.add(speaker);

    // 4. Steampunk Brass Articulated Stand / Scissor Base
    const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.8, 12);
    const baseLeg = new THREE.Mesh(legGeo, brassMat);
    baseLeg.position.set(0, -1.5, 0);

    const basePlateGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.15, 24);
    const basePlate = new THREE.Mesh(basePlateGeo, brassMat);
    basePlate.position.set(0, -2.4, 0);
    this.group.add(baseLeg, basePlate);

    // 5. Rabbit-Ear Brass Antennae
    const antMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const antGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8);

    this.ant1 = new THREE.Mesh(antGeo, antMat);
    this.ant1.position.set(-0.3, 1.4, 0);
    this.ant1.rotation.z = 0.45;

    this.ant2 = new THREE.Mesh(antGeo, antMat);
    this.ant2.position.set(0.3, 1.4, 0);
    this.ant2.rotation.z = -0.45;

    this.group.add(this.ant1, this.ant2);

    // Vacuum Tube on top of TV
    const tubeGlass = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, transmission: 0.8, transparent: true, opacity: 0.7 });
    const tubeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12);
    const tube = new THREE.Mesh(tubeGeo, tubeGlass);
    tube.position.set(0.7, 1.1, -0.2);
    this.group.add(tube);
  }

  setMedia(url, isVideo = false) {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement.remove();
      this.videoElement = null;
    }

    if (url && (isVideo || url.endsWith('.mp4') || url.endsWith('.webm'))) {
      const vid = document.createElement('video');
      vid.src = url;
      vid.crossOrigin = 'anonymous';
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.play().catch((e) => console.warn('TV video play failed:', e));
      this.videoElement = vid;
      this.videoTexture = new THREE.VideoTexture(vid);
      this.screenMat.map = this.videoTexture;
      this.screenMat.needsUpdate = true;
    } else {
      this.screenMat.map = this.canvasTexture;
      this.screenMat.needsUpdate = true;
    }
  }

  setThemeInfo(themeData) {
    if (!themeData) return;
    this.currentThemeData = {
      title: themeData.title || themeData.revealTitle || 'FOLEY THEATER',
      category: themeData.category || '1920s NOISE MYSTERY',
      icon: themeData.icon || '📻',
      color: themeData.color || '#ffbe0b',
      soundHint: themeData.soundHint || 'Acoustic broadcast in progress...',
    };
  }

  setRevealed(revealed) {
    this.isRevealed = revealed;
  }

  update(time, audioVol, freqData) {
    // If no external video is active, draw our dynamic 1920s Color CRT broadcast
    if (!this.videoElement) {
      this._drawCRTBroadcast(time, audioVol, freqData);
    }

    // Antenna subtle wobble
    this.ant1.rotation.z = 0.45 + Math.sin(time * 3) * 0.05;
    this.ant2.rotation.z = -0.45 + Math.cos(time * 3) * 0.05;

    // Knob rotation
    this.knob1.rotation.y = time * 2;
    this.knob2.rotation.y = -time * 1.5;
  }

  _drawCRTBroadcast(time, audioVol, freqData) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Background vintage color palette
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#100b1e');
    bgGrad.addColorStop(0.5, '#20113a');
    bgGrad.addColorStop(1, '#080510');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 1. Vintage Color TV Test Bars Header
    const barColors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#ffbe0b', '#fb5607', '#ff006e'];
    const barWidth = w / barColors.length;
    for (let b = 0; b < barColors.length; b++) {
      ctx.fillStyle = barColors[b];
      ctx.globalAlpha = 0.35 + Math.sin(time * 4 + b) * 0.1;
      ctx.fillRect(b * barWidth, 10, barWidth, 18);
    }
    ctx.globalAlpha = 1.0;

    // 3. Central Animated Foley Oscilloscope & Graphic
    const centerY = h / 2 + 10;
    const radius = 60 + audioVol * 45;

    // Outer Glowing Pulsing Compass / Steampunk Dial
    ctx.strokeStyle = this.currentThemeData.color || '#ffbe0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Oscilloscope Audio Waveform Line
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    const slices = 32;
    for (let i = 0; i <= slices; i++) {
      const x = 40 + (i / slices) * (w - 80);
      const freqVal = freqData ? (freqData[i % freqData.length] || 0) / 255 : 0;
      const y = centerY + Math.sin(time * 8 + i * 0.6) * (20 + freqVal * 55);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Central Icon & Badge
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.currentThemeData.icon || '📻', w / 2, centerY);

    // 4. Steampunk 1920s Typography Overlay
    ctx.fillStyle = '#ffbe0b';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('• 1920s FOLEY BROADCAST •', w / 2, 52);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Outfit", sans-serif';
    const displayTitle = this.isRevealed
      ? `REVEAL: ${this.currentThemeData.title}`
      : `MYSTERY: ${this.currentThemeData.title}`;
    ctx.fillText(displayTitle.substring(0, 32), w / 2, h - 50);

    // Live On-Air Blinking Lamp
    const blink = Math.sin(time * 6) > 0;
    ctx.fillStyle = blink ? '#ff0055' : '#440015';
    ctx.beginPath();
    ctx.arc(42, 48, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff0055';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ON AIR', 56, 52);

    // 5. Retro Horizontal CRT Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Moving CRT Beam Scanline Bar
    const beamY = ((time * 80) % (h + 40)) - 20;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, beamY, w, 16);

    this.canvasTexture.needsUpdate = true;
  }
}
