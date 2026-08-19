import { GlbManager } from './glbManager.js';

  setPackId(packId) {
    if (this.packId === packId) return;
    this.packId = packId;
    const primaryPath = `/maps/${packId}.glb`;
    const fallbackPath = `/public/models/${packId}.glb`;
    const load = (path) => GlbManager.loadGlb(path);
    load(primaryPath)
      .then(({ group }) => this._applyPackModel(group))
      .catch(() => {
        load(fallbackPath)
          .then(({ group }) => this._applyPackModel(group))
          .catch(() => {
            this._clearPackModel();
          });
      });
  }

  _applyPackModel(group) {
    if (this.packModel) {
      this.group.remove(this.packModel);
    }
    this.packModel = group;
    this.group.add(this.packModel);
    // Hide default stage geometry
    this.group.visible = false;
  }

  _clearPackModel() {
    if (this.packModel) {
      this.group.remove(this.packModel);
      this.packModel = null;
    }
    // Show default stage if no pack model
    this.group.visible = true;
  }
import { VintageTV3D } from './vintageTV3D.js';

export class SteampunkStage3D {
    constructor(scene, packId = 'default') {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'steampunkStage';

    this.pistons = [];
    this.gears = [];
    this.marqueeBulbs = [];
    this.gauges = [];
    this.steamParticles = null;
    this.geyserParticles = null;
    this.sparkParticles = null;
    this.isRevealed = false;
    this.stageTurntable = null;

    this._buildStageArchitecture();
    this._buildPistonBanks();
    this._buildClockworkGears();
    this._buildTelevisions();
    this._buildSteamVents();
    this._buildGeysersAndSparks();

    this.scene.add(this.group);
  }

  _buildStageArchitecture() {
    // 1. Polished Wood & Brass Inlaid Stage Turntable
    const stageGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.6, 36);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2314,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.stageTurntable = new THREE.Mesh(stageGeo, woodMat);
    this.stageTurntable.position.y = -1.6;
    this.group.add(this.stageTurntable);

    // Riveted Brass Outer Rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.3,
    });
    const rimGeo = new THREE.TorusGeometry(4.9, 0.18, 12, 48);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -1.3;
    this.group.add(rim);

    // 2. Art Deco Sunburst Proscenium Archway (Backdrop)
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x85542b,
      metalness: 0.6,
      roughness: 0.4,
    });

    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0.8, -4.5);

    // Main Arch Curve
    const archCurve = new THREE.EllipseCurve(0, 0, 5.5, 4.5, 0, Math.PI, false, 0);
    const pts = archCurve.getPoints(32);
    const archShape = new THREE.Shape(pts);
    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    const archGeo = new THREE.ExtrudeGeometry(archShape, extrudeSettings);
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.z = -0.25;
    archGroup.add(archMesh);

    // Sunburst Art Deco Rays
    const rayMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
    for (let r = 0; r < 9; r++) {
      const angle = (r / 8) * Math.PI;
      const rayGeo = new THREE.BoxGeometry(0.18, 4.5, 0.12);
      const ray = new THREE.Mesh(rayGeo, rayMat);
      ray.position.set(0, 0, -0.1);
      ray.rotation.z = angle - Math.PI / 2;
      archGroup.add(ray);
    }

    // 3. Marquee Carnival Chase Light Bulbs
    const bulbMatOn = new THREE.MeshBasicMaterial({ color: 0xffe066 });
    const bulbGeo = new THREE.SphereGeometry(0.14, 12, 12);

    for (let b = 0; b < 24; b++) {
      const angle = (b / 23) * Math.PI;
      const bx = Math.cos(angle) * 5.2;
      const by = Math.sin(angle) * 4.2;
      const bulb = new THREE.Mesh(bulbGeo, bulbMatOn);
      bulb.position.set(bx, by, 0.35);
      archGroup.add(bulb);
      this.marqueeBulbs.push(bulb);
    }

    this.group.add(archGroup);

    // 4. Vintage 1920s Radio Announcer Microphone on Stage
    const micGroup = new THREE.Group();
    micGroup.position.set(2.4, -0.3, 2.5);

    const micStandMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const standGeo = new THREE.CylinderGeometry(0.04, 0.06, 2.2, 12);
    const stand = new THREE.Mesh(standGeo, micStandMat);
    stand.position.y = -0.2;
    micGroup.add(stand);

    const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 12, 24);
    const ring = new THREE.Mesh(ringGeo, micStandMat);
    ring.position.y = 0.9;
    micGroup.add(ring);

    const micHeadGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16);
    const micHeadMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.95, roughness: 0.1 });
    const micHead = new THREE.Mesh(micHeadGeo, micHeadMat);
    micHead.position.y = 0.9;
    micGroup.add(micHead);

    this.group.add(micGroup);
  }

  _buildPistonBanks() {
    const pistonMatBrass = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const pistonMatCopper = new THREE.MeshStandardMaterial({ color: 0xb85d19, metalness: 0.85, roughness: 0.3 });
    const pistonMatSteel = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.15 });

    const pistonConfigs = [
      { x: -3.8, z: -1.2, scale: 1.0, speed: 2.2, phase: 0 },
      { x: -4.4, z: 0.3, scale: 1.1, speed: 1.8, phase: Math.PI / 3 },
      { x: -3.5, z: 1.8, scale: 0.9, speed: 2.6, phase: Math.PI / 1.5 },
      { x: 3.8, z: -1.2, scale: 1.0, speed: 2.1, phase: Math.PI / 2 },
      { x: 4.4, z: 0.3, scale: 1.1, speed: 1.9, phase: Math.PI * 0.8 },
      { x: 3.5, z: 1.8, scale: 0.9, speed: 2.7, phase: Math.PI * 1.2 },
      { x: -1.8, z: -3.2, scale: 1.3, speed: 1.5, phase: Math.PI / 4 },
      { x: 1.8, z: -3.2, scale: 1.3, speed: 1.6, phase: Math.PI * 0.75 },
    ];

    pistonConfigs.forEach((cfg) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(cfg.x, -1.0, cfg.z);
      pGroup.scale.set(cfg.scale, cfg.scale, cfg.scale);

      // Outer Cylinder
      const cylGeo = new THREE.CylinderGeometry(0.35, 0.4, 1.8, 16);
      const cyl = new THREE.Mesh(cylGeo, pistonMatBrass);
      pGroup.add(cyl);

      // Copper Reinforcement Hoops
      const hoopGeo = new THREE.TorusGeometry(0.38, 0.05, 8, 16);
      const hoop1 = new THREE.Mesh(hoopGeo, pistonMatCopper);
      hoop1.position.y = 0.5;
      hoop1.rotation.x = Math.PI / 2;
      const hoop2 = hoop1.clone();
      hoop2.position.y = -0.5;
      pGroup.add(hoop1, hoop2);

      // Chrome Moving Piston Rod
      const rodGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6, 16);
      const rod = new THREE.Mesh(rodGeo, pistonMatSteel);
      rod.position.y = 0.8;
      pGroup.add(rod);

      // Top Piston Head
      const headGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 16);
      const head = new THREE.Mesh(headGeo, pistonMatCopper);
      head.position.y = 0.8;
      rod.add(head);

      // Pressure Gauge
      const gaugeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
      const gauge = new THREE.Mesh(gaugeGeo, pistonMatBrass);
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(0, 0.2, 0.42);

      const dialGeo = new THREE.CircleGeometry(0.14, 16);
      const dialMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const dial = new THREE.Mesh(dialGeo, dialMat);
      dial.position.z = 0.05;
      gauge.add(dial);

      const needleGeo = new THREE.BoxGeometry(0.02, 0.12, 0.01);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.set(0, 0.04, 0.06);
      gauge.add(needle);

      pGroup.add(gauge);
      this.group.add(pGroup);

      this.pistons.push({
        group: pGroup,
        rod,
        needle,
        speed: cfg.speed,
        phase: cfg.phase,
      });
    });
  }

  _buildClockworkGears() {
    const gearMatBrass = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.25 });
    const gearMatCopper = new THREE.MeshStandardMaterial({ color: 0xb85d19, metalness: 0.9, roughness: 0.3 });

    const createGearMesh = (radius, teeth, mat) => {
      const gearGroup = new THREE.Group();
      const bodyGeo = new THREE.CylinderGeometry(radius, radius, 0.12, 24);
      const body = new THREE.Mesh(bodyGeo, mat);
      gearGroup.add(body);

      const toothGeo = new THREE.BoxGeometry(0.12, 0.14, 0.25);
      for (let t = 0; t < teeth; t++) {
        const angle = (t / teeth) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo, mat);
        tooth.position.set(Math.cos(angle) * (radius + 0.08), 0, Math.sin(angle) * (radius + 0.08));
        tooth.rotation.y = -angle;
        gearGroup.add(tooth);
      }
      return gearGroup;
    };

    const g1 = createGearMesh(1.4, 18, gearMatBrass);
    g1.position.set(-2.6, 2.2, -4.2);
    g1.rotation.x = Math.PI / 2;
    this.group.add(g1);
    this.gears.push({ mesh: g1, speed: 0.8 });

    const g2 = createGearMesh(0.9, 12, gearMatCopper);
    g2.position.set(-0.6, 3.2, -4.2);
    g2.rotation.x = Math.PI / 2;
    this.group.add(g2);
    this.gears.push({ mesh: g2, speed: -1.2 });

    const g3 = createGearMesh(1.6, 20, gearMatBrass);
    g3.position.set(2.4, 2.0, -4.2);
    g3.rotation.x = Math.PI / 2;
    this.group.add(g3);
    this.gears.push({ mesh: g3, speed: -0.7 });
  }

  _buildTelevisions() {
    this.tvLeft = new VintageTV3D(this.scene, {
      position: new THREE.Vector3(-3.2, 0.8, -0.6),
      rotation: new THREE.Euler(0, 0.45, 0),
      scale: 1.1,
    });

    this.tvRight = new VintageTV3D(this.scene, {
      position: new THREE.Vector3(3.2, 0.8, -0.6),
      rotation: new THREE.Euler(0, -0.45, 0),
      scale: 1.1,
    });

    this.group.add(this.tvLeft.group, this.tvRight.group);
  }

  _buildSteamVents() {
    const particleCount = 120;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 9;
      pos[i + 1] = -1.2 + Math.random() * 5.0;
      pos[i + 2] = (Math.random() - 0.5) * 8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.45,
      color: 0xffeecc,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    this.steamParticles = new THREE.Points(geo, mat);
    this.group.add(this.steamParticles);
  }

  _buildGeysersAndSparks() {
    // 1. High Velocity Steam Geyser Plumes (Left & Right Vents)
    const geyserCount = 80;
    const gGeo = new THREE.BufferGeometry();
    const gPos = new Float32Array(geyserCount * 3);
    const gVels = new Float32Array(geyserCount * 3);

    for (let i = 0; i < geyserCount; i++) {
      const idx = i * 3;
      const isLeft = i % 2 === 0;
      gPos[idx] = isLeft ? -3.8 + (Math.random() - 0.5) * 0.4 : 3.8 + (Math.random() - 0.5) * 0.4;
      gPos[idx + 1] = -1.0 + Math.random() * 4.0;
      gPos[idx + 2] = -0.5 + (Math.random() - 0.5) * 0.4;

      gVels[idx] = (Math.random() - 0.5) * 0.3;
      gVels[idx + 1] = 2.5 + Math.random() * 3.5;
      gVels[idx + 2] = (Math.random() - 0.5) * 0.3;
    }

    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    this.geyserVelocities = gVels;

    const gMat = new THREE.PointsMaterial({
      size: 0.55,
      color: 0xffddaa,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    this.geyserParticles = new THREE.Points(gGeo, gMat);
    this.group.add(this.geyserParticles);

    // 2. Copper Electrical Sparks
    const sparkCount = 40;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount * 3; i += 3) {
      sPos[i] = (Math.random() - 0.5) * 6;
      sPos[i + 1] = -0.8 + Math.random() * 3.0;
      sPos[i + 2] = -1.0 + (Math.random() - 0.5) * 4;
    }

    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.sparkParticles = new THREE.Points(sGeo, sMat);
    this.group.add(this.sparkParticles);
  }

  setMediaForTheme(question) {
    if (!question) return;
    const mediaUrl = question.videoUrl || question.gifUrl || null;
    const isVideo = Boolean(question.videoUrl);

    this.tvLeft.setMedia(mediaUrl, isVideo);
    this.tvRight.setMedia(mediaUrl, isVideo);

    const themeData = {
      title: question.revealTitle || question.title,
      category: question.category,
      icon: '🎙️',
      color: '#ffbe0b',
      soundHint: question.soundHint,
    };

    this.tvLeft.setThemeInfo(themeData);
    this.tvRight.setThemeInfo(themeData);
  }

  setRevealed(revealed) {
    this.isRevealed = revealed;
    this.tvLeft.setRevealed(revealed);
    this.tvRight.setRevealed(revealed);
  }

  update(delta, time, audioVol, freqData) {
    // 1. Rotate stage turntable smoothly on reveal
    if (this.stageTurntable && this.isRevealed) {
      this.stageTurntable.rotation.y += delta * 0.35;
    }

    // 2. Animate Steam Pistons with variable mechanical strokes + audio response
    this.pistons.forEach((p) => {
      const stroke = Math.sin(time * p.speed + p.phase);
      p.rod.position.y = (stroke > 0 ? stroke * 0.9 : stroke * 0.3) + audioVol * 0.55;
      p.needle.rotation.z = stroke * 1.5 + (Math.random() - 0.5) * 0.35;
    });

    // 3. Animate Clockwork Gears
    this.gears.forEach((g) => {
      g.mesh.rotation.z = time * g.speed;
    });

    // 4. Marquee Chase Lightbulbs flashing
    const chaseIndex = Math.floor(time * 14) % this.marqueeBulbs.length;
    this.marqueeBulbs.forEach((bulb, idx) => {
      const isLit = (idx + chaseIndex) % 3 === 0;
      bulb.material.color.setHex(isLit ? 0xffe066 : 0x443311);
    });

    // 5. Update Televisions CRT video / animations
    this.tvLeft.update(time, audioVol, freqData);
    this.tvRight.update(time, audioVol, freqData);

    // 6. Ambient Steam Particles drift upwards
    if (this.steamParticles) {
      const pos = this.steamParticles.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * (0.8 + audioVol * 1.2);
        if (pos[i] > 4.5) {
          pos[i] = -1.2;
        }
      }
      this.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 7. High-Velocity Geyser Jets
    if (this.geyserParticles) {
      const gPos = this.geyserParticles.geometry.attributes.position.array;
      const gVels = this.geyserVelocities;
      const boost = 1.0 + audioVol * 3.5;

      for (let i = 0; i < gPos.length; i += 3) {
        gPos[i + 1] += gVels[i + 1] * delta * boost;
        gPos[i] += gVels[i] * delta;
        if (gPos[i + 1] > 4.2) {
          gPos[i + 1] = -1.0;
          const isLeft = (i / 3) % 2 === 0;
          gPos[i] = isLeft ? -3.8 + (Math.random() - 0.5) * 0.4 : 3.8 + (Math.random() - 0.5) * 0.4;
        }
      }
      this.geyserParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 8. Electrical Sparks Jitter
    if (this.sparkParticles) {
      const sPos = this.sparkParticles.geometry.attributes.position.array;
      for (let i = 0; i < sPos.length; i += 3) {
        if (Math.random() < 0.15) {
          sPos[i] += (Math.random() - 0.5) * 0.3;
          sPos[i + 1] += (Math.random() - 0.5) * 0.3;
          if (sPos[i + 1] > 3.0 || sPos[i + 1] < -0.8) sPos[i + 1] = 0.5;
        }
      }
      this.sparkParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  triggerEvent(eventName, payload = {}) {
    if (eventName === 'BROADCAST_PULSE') {
      this.gears.forEach((g) => {
        g.speed *= 1.6;
        setTimeout(() => { g.speed /= 1.6; }, 600);
      });
    } else if (eventName === 'ROUND_REVEAL') {
      this.setRevealed(true);
    }
  }
}
