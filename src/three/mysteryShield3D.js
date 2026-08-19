import * as THREE from 'three';

export class MysteryShield3D {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'steampunkMysteryShield';
    this.isRevealed = false;
    this.revealProgress = 0; // 0 = shielded, 1 = revealed

    this.irisBlades = [];
    this._buildSteampunkShutter();
    this.scene.add(this.group);
  }

  _buildSteampunkShutter() {
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      metalness: 0.9,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xaa5010,
      metalness: 0.85,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });

    // 1. Heavy Riveted Brass Outer Rim
    const rimGeo = new THREE.TorusGeometry(3.0, 0.28, 16, 48);
    const rimMesh = new THREE.Mesh(rimGeo, brassMat);
    rimMesh.position.z = 0.1;
    this.group.add(rimMesh);

    // Rim Rivets
    const rivetGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const rivetMat = new THREE.MeshStandardMaterial({ color: 0xffeeaa, metalness: 0.95 });
    for (let r = 0; r < 16; r++) {
      const angle = (r / 16) * Math.PI * 2;
      const rivet = new THREE.Mesh(rivetGeo, rivetMat);
      rivet.position.set(Math.cos(angle) * 3.0, Math.sin(angle) * 3.0, 0.35);
      this.group.add(rivet);
    }

    // 2. Eight Interlocking Brass Iris Aperture Shutter Blades
    const bladeCount = 8;
    for (let b = 0; b < bladeCount; b++) {
      const angle = (b / bladeCount) * Math.PI * 2;
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(2.4, 1.2);
      bladeShape.lineTo(2.9, 0);
      bladeShape.lineTo(1.8, -1.6);
      bladeShape.closePath();

      const bladeGeo = new THREE.ShapeGeometry(bladeShape);
      const bladeMat = b % 2 === 0 ? brassMat : copperMat;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);

      const pivot = new THREE.Group();
      pivot.position.set(Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, 0);
      blade.position.set(-Math.cos(angle) * 1.6, -Math.sin(angle) * 1.6, 0.05 * (b / bladeCount));
      pivot.add(blade);

      pivot.rotation.z = angle;
      this.group.add(pivot);
      this.irisBlades.push({ pivot, baseAngle: angle });
    }

    // 3. Central Glowing Amber Vacuum Tube & Mystery Dial
    const centerGroup = new THREE.Group();
    const tubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffaa00,
      emissive: 0xff7700,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    this.centerTube = new THREE.Mesh(tubeGeo, tubeMat);
    this.centerTube.rotation.x = Math.PI / 2;
    centerGroup.add(this.centerTube);

    // Glowing Filament Coil inside Tube
    const coilGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 24);
    const coilMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.position.z = 0.1;
    centerGroup.add(coil);

    this.group.add(centerGroup);
    this.centerGroup = centerGroup;

    // 4. Steam Mist Particle Cloud
    const mistGeo = new THREE.BufferGeometry();
    const mistCount = 60;
    const mistPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount * 3; i += 3) {
      mistPos[i] = (Math.random() - 0.5) * 4.5;
      mistPos[i + 1] = (Math.random() - 0.5) * 4.5;
      mistPos[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    this.mistMat = new THREE.PointsMaterial({
      size: 0.45,
      color: 0xffeecc,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    this.mistParticles = new THREE.Points(mistGeo, this.mistMat);
    this.group.add(this.mistParticles);
  }

  setRevealed(revealed) {
    this.isRevealed = revealed;
  }

  update(delta, time, audioVol) {
    if (this.isRevealed) {
      if (this.revealProgress < 1.0) {
        this.revealProgress = Math.min(1.0, this.revealProgress + delta * 2.2);
      }
    } else {
      if (this.revealProgress > 0.0) {
        this.revealProgress = Math.max(0.0, this.revealProgress - delta * 3.0);
      }
    }

    const openAngle = this.revealProgress * (Math.PI / 1.8);
    const scale = 1.0 + this.revealProgress * 1.5;
    const opacity = Math.max(0.0, 1.0 - this.revealProgress);

    this.group.scale.setScalar(scale);
    this.group.visible = opacity > 0.02;

    // Mechanically rotate iris shutter blades outward
    this.irisBlades.forEach((b) => {
      b.pivot.rotation.z = b.baseAngle + openAngle;
    });

    // Pulse vacuum tube and mist
    this.centerTube.material.emissiveIntensity = (0.6 + audioVol * 1.2) * opacity;
    this.mistMat.opacity = 0.55 * opacity;
    this.centerGroup.scale.setScalar(1.0 + Math.sin(time * 6) * 0.08 + audioVol * 0.2);

    // Subtle breathing rotation
    this.group.rotation.z = Math.sin(time * 1.5) * 0.05;
  }

  triggerEvent(eventName, payload = {}) {
    if (eventName === 'BROADCAST_PULSE') {
      if (this.centerTube && this.centerTube.material) {
        this.centerTube.material.emissiveIntensity = 2.4;
      }
    } else if (eventName === 'ROUND_REVEAL') {
      this.setRevealed(true);
    }
  }
}
