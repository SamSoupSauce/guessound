import * as THREE from 'three';

export class AudioVisualizer3D {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'steampunkVacuumVisualizer';
    this.tubes = [];
    this.tubeCount = 20;
    this.radius = 4.7;

    this._buildVacuumTubes();
    this.scene.add(this.group);
  }

  _buildVacuumTubes() {
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe0a3,
      transmission: 0.85,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
    });

    for (let i = 0; i < this.tubeCount; i++) {
      const angle = (i / this.tubeCount) * Math.PI * 2;
      const x = Math.cos(angle) * this.radius;
      const z = Math.sin(angle) * this.radius;

      const tubeGroup = new THREE.Group();
      tubeGroup.position.set(x, -1.6, z);

      // Brass Socket Base
      const socketGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.3, 16);
      const socket = new THREE.Mesh(socketGeo, brassMat);
      socket.position.y = 0.15;
      tubeGroup.add(socket);

      // Glass Envelope
      const envGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16);
      const env = new THREE.Mesh(envGeo, glassMat);
      env.position.y = 0.8;
      tubeGroup.add(env);

      // Glowing Filament Core
      const filGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
      const filMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const filament = new THREE.Mesh(filGeo, filMat);
      filament.position.y = 0.8;
      tubeGroup.add(filament);

      this.group.add(tubeGroup);
      this.tubes.push({ filament, env, baseHeight: 0.9 });
    }
  }

  update(freqData) {
    if (!freqData || freqData.length === 0) return;

    for (let i = 0; i < this.tubes.length; i++) {
      const freqIndex = Math.floor((i / this.tubes.length) * (freqData.length / 2));
      const val = (freqData[freqIndex] || 0) / 255;

      const t = this.tubes[i];
      const scaleY = Math.max(0.2, val * 2.8);
      t.filament.scale.y = scaleY;

      // Color shifts from warm amber to intense incandescent yellow/orange
      if (val > 0.6) {
        t.filament.material.color.setHex(0xffeedd);
      } else if (val > 0.3) {
        t.filament.material.color.setHex(0xffaa00);
      } else {
        t.filament.material.color.setHex(0xff5500);
      }
    }

    this.group.rotation.y += 0.003;
  }
}
