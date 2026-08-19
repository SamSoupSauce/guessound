import * as THREE from 'three';

export class SceneModelFactory {
  static createModel(modelKey) {
    const group = new THREE.Group();
    group.name = `model_${modelKey}`;

    switch (modelKey) {
      case 'pool_flamingo':
        return this._buildFlamingo(group);
      case 'flip_flops':
        return this._buildFlipFlops(group);
      case 'stubbed_toe':
        return this._buildStubbedToe(group);
      case 'squeaky_dog':
        return this._buildSqueakyDuck(group);
      case 'sizzling_bacon':
        return this._buildSizzlingBacon(group);
      case 'massage_gun':
        return this._buildMassageGun(group);
      case 'bike_pump':
        return this._buildBikePump(group);
      case 'resistance_band':
        return this._buildResistanceBand(group);
      case 'mac_and_cheese':
        return this._buildMacAndCheese(group);
      case 'dog_tippytaps':
        return this._buildDogTippyTaps(group);
      case 'laser_blaster':
        return this._buildLaserBlaster(group);
      case 'chainsaw_engine':
        return this._buildChainsawEngine(group);
      case 'soda_can':
        return this._buildSodaCan(group);
      case 'cat_hiss':
        return this._buildCatHiss(group);
      case 'kettlebell_thud':
        return this._buildKettlebell(group);
      case 'woodpecker_tree':
        return this._buildWoodpecker(group);
      case 'water_slide':
        return this._buildWaterSlide(group);
      case 'warp_core':
        return this._buildWarpCore(group);
      case 'spring_pad':
        return this._buildSpringPad(group);
      default:
        return this._buildDefaultSonic(group);
    }
  }

  static _buildFlamingo(group) {
    const waterGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,
      roughness: 0.1,
      metalness: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -1;
    group.add(water);

    const ringGeo = new THREE.TorusGeometry(1.4, 0.45, 16, 32);
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xff4081,
      roughness: 0.3,
      metalness: 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, pinkMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.3;
    group.add(ring);

    const neckCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.2, 1.2),
      new THREE.Vector3(0, 1.0, 1.6),
      new THREE.Vector3(0, 1.8, 1.1),
      new THREE.Vector3(0, 1.9, 0.7),
    ]);
    const neckGeo = new THREE.TubeGeometry(neckCurve, 20, 0.22, 12, false);
    const neck = new THREE.Mesh(neckGeo, pinkMat);
    group.add(neck);

    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const head = new THREE.Mesh(headGeo, pinkMat);
    head.position.set(0, 1.9, 0.6);
    group.add(head);

    const beakGeo = new THREE.ConeGeometry(0.2, 0.7, 16);
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.4 });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.x = -Math.PI / 2.5;
    beak.position.set(0, 1.75, 0.1);
    group.add(beak);

    const wingGeo = new THREE.SphereGeometry(0.5, 16, 16);
    wingGeo.scale(0.2, 0.6, 1.0);
    const leftWing = new THREE.Mesh(wingGeo, pinkMat);
    leftWing.position.set(1.4, 0, 0);
    const rightWing = new THREE.Mesh(wingGeo, pinkMat);
    rightWing.position.set(-1.4, 0, 0);
    group.add(leftWing, rightWing);

    group.userData.update = (time, audioVol) => {
      group.position.y = Math.sin(time * 3) * 0.15;
      ring.scale.setScalar(1.0 + Math.sin(time * 6) * 0.04 + audioVol * 0.1);
      head.rotation.x = Math.sin(time * 4) * 0.1;
      water.rotation.y = time * 0.2;
    };

    return group;
  }

  static _buildFlipFlops(group) {
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xff2e93, roughness: 0.4 });

    const createShoe = (xOffset) => {
      const shoeGroup = new THREE.Group();
      const soleGeo = new THREE.BoxGeometry(0.9, 0.18, 2.2);
      const sole = new THREE.Mesh(soleGeo, shoeMat);
      shoeGroup.add(sole);

      const strapGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 16, Math.PI);
      const strap = new THREE.Mesh(strapGeo, strapMat);
      strap.rotation.y = Math.PI / 2;
      strap.rotation.x = Math.PI / 6;
      strap.position.set(0, 0.25, 0.3);
      shoeGroup.add(strap);

      shoeGroup.position.x = xOffset;
      return shoeGroup;
    };

    const left = createShoe(-0.8);
    const right = createShoe(0.8);
    group.add(left, right);

    group.userData.update = (time, audioVol) => {
      left.position.y = Math.sin(time * 12) * 0.4;
      left.position.z = Math.cos(time * 12) * 0.5;
      right.position.y = Math.sin(time * 12 + Math.PI) * 0.4;
      right.position.z = Math.cos(time * 12 + Math.PI) * 0.5;
      left.rotation.x = Math.sin(time * 12) * 0.3;
      right.rotation.x = Math.sin(time * 12 + Math.PI) * 0.3;
    };

    return group;
  }

  static _buildStubbedToe(group) {
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    const legGeo = new THREE.BoxGeometry(0.6, 2.5, 0.6);
    const topGeo = new THREE.BoxGeometry(3.0, 0.3, 3.0);

    const leg = new THREE.Mesh(legGeo, tableMat);
    leg.position.set(-0.8, -0.2, -0.8);
    const top = new THREE.Mesh(topGeo, tableMat);
    top.position.set(-0.8, 1.1, -0.8);
    group.add(leg, top);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1a9, roughness: 0.5 });
    const footGeo = new THREE.CapsuleGeometry(0.45, 1.2, 8, 16);
    const foot = new THREE.Mesh(footGeo, skinMat);
    foot.rotation.x = Math.PI / 2;
    foot.position.set(0.6, -0.8, 0.8);
    group.add(foot);

    const shockMat = new THREE.MeshBasicMaterial({ color: 0xff1744, wireframe: true });
    const shockGeo = new THREE.RingGeometry(0.2, 0.8, 24);
    const shock = new THREE.Mesh(shockGeo, shockMat);
    shock.position.set(-0.5, -0.8, -0.5);
    shock.rotation.x = -Math.PI / 2;
    group.add(shock);

    group.userData.update = (time, audioVol) => {
      const kick = Math.sin(time * 4);
      foot.position.x = 0.6 - (kick > 0 ? kick * 0.8 : 0);
      foot.position.z = 0.8 - (kick > 0 ? kick * 0.8 : 0);
      const isImpact = kick > 0.7;
      shock.visible = isImpact;
      if (isImpact) {
        shock.scale.setScalar(1.0 + Math.sin(time * 20) * 0.8);
      }
    };

    return group;
  }

  static _buildSqueakyDuck(group) {
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffd60a, roughness: 0.3 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff7b00, roughness: 0.3 });

    const bodyGeo = new THREE.SphereGeometry(1.1, 24, 24);
    bodyGeo.scale(1.0, 0.8, 1.3);
    const body = new THREE.Mesh(bodyGeo, yellowMat);
    body.position.y = -0.2;
    group.add(body);

    const headGeo = new THREE.SphereGeometry(0.7, 20, 20);
    const head = new THREE.Mesh(headGeo, yellowMat);
    head.position.set(0, 0.8, 0.6);
    group.add(head);

    const beakGeo = new THREE.ConeGeometry(0.35, 0.6, 16);
    const beak = new THREE.Mesh(beakGeo, orangeMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.7, 1.3);
    group.add(beak);

    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.5 + i * 0.4, 0.04, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd60a, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0.7, 1.5 + i * 0.4);
      group.add(ring);
      rings.push(ring);
    }

    group.userData.update = (time, audioVol) => {
      const squish = Math.abs(Math.sin(time * 8)) * 0.35;
      body.scale.set(1.0 + squish * 0.3, 0.8 - squish * 0.4, 1.3 - squish * 0.2);
      rings.forEach((r, idx) => {
        r.scale.setScalar(1.0 + (time * 4 + idx * 0.5) % 1.5);
      });
    };

    return group;
  }

  static _buildSizzlingBacon(group) {
    const panMat = new THREE.MeshStandardMaterial({ color: 0x212529, metalness: 0.8, roughness: 0.4 });
    const panBaseGeo = new THREE.CylinderGeometry(2.2, 2.0, 0.4, 32);
    const panBase = new THREE.Mesh(panBaseGeo, panMat);
    panBase.position.y = -0.5;

    const handleGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
    const handle = new THREE.Mesh(handleGeo, panMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, -0.4, -3.0);
    group.add(panBase, handle);

    const baconStrips = [];
    const baconMat = new THREE.MeshStandardMaterial({ color: 0xc1121f, roughness: 0.3 });
    const fatMat = new THREE.MeshStandardMaterial({ color: 0xfdf0ed, roughness: 0.3 });

    for (let i = -1; i <= 1; i++) {
      const bGroup = new THREE.Group();
      const bGeo = new THREE.BoxGeometry(0.7, 0.08, 2.8);
      const bMesh = new THREE.Mesh(bGeo, baconMat);
      const fGeo = new THREE.BoxGeometry(0.2, 0.09, 2.7);
      const fMesh = new THREE.Mesh(fGeo, fatMat);
      bGroup.add(bMesh, fMesh);
      bGroup.position.set(i * 0.9, -0.25, 0);
      group.add(bGroup);
      baconStrips.push(bGroup);
    }

    group.userData.update = (time, audioVol) => {
      baconStrips.forEach((b, idx) => {
        b.rotation.z = Math.sin(time * 15 + idx) * 0.05;
        b.position.y = -0.25 + Math.sin(time * 20 + idx * 2) * 0.03;
      });
      panBase.rotation.y = Math.sin(time * 2) * 0.05;
    };

    return group;
  }

  static _buildMassageGun(group) {
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x3a0ca3, metalness: 0.5, roughness: 0.3 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x4361ee, roughness: 0.5 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf72585, roughness: 0.2 });

    const barrelGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.4, 24);
    const barrel = new THREE.Mesh(barrelGeo, gunMat);
    barrel.rotation.z = Math.PI / 2;
    group.add(barrel);

    const handleGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.0, 20);
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(-0.4, -1.1, 0);
    group.add(handle);

    const pistonGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const piston = new THREE.Mesh(pistonGeo, gunMat);
    piston.rotation.z = Math.PI / 2;

    const ballHeadGeo = new THREE.SphereGeometry(0.65, 24, 24);
    const ballHead = new THREE.Mesh(ballHeadGeo, headMat);
    ballHead.position.set(1.5, 0, 0);

    const headGroup = new THREE.Group();
    headGroup.add(piston, ballHead);
    group.add(headGroup);

    group.userData.update = (time, audioVol) => {
      const stroke = Math.sin(time * 50) * 0.25;
      headGroup.position.x = stroke;
      group.rotation.y = Math.sin(time * 3) * 0.15;
    };

    return group;
  }

  static _buildBikePump(group) {
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x4cc9f0, roughness: 0.3 });
    const plungerMat = new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.3 });

    const cylinderGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.0, 24);
    const cylinder = new THREE.Mesh(cylinderGeo, baseMat);
    cylinder.position.y = -0.3;

    const footplateGeo = new THREE.BoxGeometry(2.2, 0.2, 0.8);
    const footplate = new THREE.Mesh(footplateGeo, baseMat);
    footplate.position.y = -1.8;
    group.add(cylinder, footplate);

    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, plungerMat);

    const handleGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.0, 16);
    const tHandle = new THREE.Mesh(handleGeo, plungerMat);
    tHandle.rotation.z = Math.PI / 2;
    tHandle.position.y = 1.25;

    const plunger = new THREE.Group();
    plunger.add(shaft, tHandle);
    group.add(plunger);

    group.userData.update = (time, audioVol) => {
      const stroke = Math.sin(time * 6);
      plunger.position.y = (stroke > 0 ? stroke * 0.8 : 0);
    };

    return group;
  }

  static _buildResistanceBand(group) {
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xff2e93,
      roughness: 0.2,
      emissive: 0x550022,
    });

    const createCurve = (stretch) => {
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.2, 0.8, 0),
        new THREE.Vector3(0, -stretch, 0),
        new THREE.Vector3(2.2, 0.8, 0),
      ]);
    };

    let bandGeo = new THREE.TubeGeometry(createCurve(0.5), 32, 0.16, 12, false);
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    group.add(bandMesh);

    const handleMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
    const h1Geo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16);
    const h1 = new THREE.Mesh(h1Geo, handleMat);
    h1.position.set(-2.2, 0.8, 0);
    const h2 = new THREE.Mesh(h1Geo, handleMat);
    h2.position.set(2.2, 0.8, 0);
    group.add(h1, h2);

    group.userData.update = (time, audioVol) => {
      const stretch = Math.abs(Math.sin(time * 4)) * 1.8 + 0.2;
      bandMesh.geometry.dispose();
      bandMesh.geometry = new THREE.TubeGeometry(createCurve(stretch), 32, 0.16, 12, false);
    };

    return group;
  }

  static _buildMacAndCheese(group) {
    const potMat = new THREE.MeshStandardMaterial({ color: 0x343a40, metalness: 0.7, roughness: 0.3 });
    const potGeo = new THREE.CylinderGeometry(2.0, 1.8, 2.0, 32);
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = -0.5;

    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.2 });
    const cheeseGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
    cheese.position.y = 0.3;
    group.add(pot, cheese);

    const spoonMat = new THREE.MeshStandardMaterial({ color: 0xbc6c25, roughness: 0.5 });
    const spoonGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
    const spoon = new THREE.Mesh(spoonGeo, spoonMat);
    spoon.rotation.x = Math.PI / 4;
    group.add(spoon);

    group.userData.update = (time, audioVol) => {
      const angle = time * 5;
      spoon.position.x = Math.cos(angle) * 0.8;
      spoon.position.z = Math.sin(angle) * 0.8;
      spoon.position.y = 0.8 + Math.sin(angle * 2) * 0.15;
      spoon.rotation.z = Math.sin(angle) * 0.2;
    };

    return group;
  }

  static _buildDogTippyTaps(group) {
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.3 });
    const bowlGeo = new THREE.CylinderGeometry(1.8, 1.3, 0.8, 32);
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.set(0, -0.8, 0);

    const kibbleMat = new THREE.MeshStandardMaterial({ color: 0x7f4f24, roughness: 0.7 });
    const kibbleGeo = new THREE.SphereGeometry(1.4, 16, 16);
    kibbleGeo.scale(1.0, 0.3, 1.0);
    const kibble = new THREE.Mesh(kibbleGeo, kibbleMat);
    kibble.position.set(0, -0.45, 0);
    group.add(bowl, kibble);

    const pawMat = new THREE.MeshStandardMaterial({ color: 0xdda15e, roughness: 0.5 });
    const createPaw = (xPos) => {
      const paw = new THREE.Group();
      const pGeo = new THREE.SphereGeometry(0.5, 16, 16);
      pGeo.scale(1.0, 0.4, 1.2);
      const pMesh = new THREE.Mesh(pGeo, pawMat);
      paw.add(pMesh);
      paw.position.set(xPos, -0.8, 1.6);
      return paw;
    };

    const leftPaw = createPaw(-0.8);
    const rightPaw = createPaw(0.8);
    group.add(leftPaw, rightPaw);

    group.userData.update = (time, audioVol) => {
      leftPaw.position.y = -0.8 + Math.abs(Math.sin(time * 16)) * 0.4;
      rightPaw.position.y = -0.8 + Math.abs(Math.cos(time * 16)) * 0.4;
    };

    return group;
  }

  static _buildLaserBlaster(group) {
    const blasterMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.8, roughness: 0.2 });
    const neonMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.5 });

    const bodyGeo = new THREE.BoxGeometry(0.8, 0.8, 2.5);
    const body = new THREE.Mesh(bodyGeo, blasterMat);
    group.add(body);

    const barrelGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.8, 16);
    const barrel = new THREE.Mesh(barrelGeo, neonMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.1, 1.6);
    group.add(barrel);

    const gripGeo = new THREE.BoxGeometry(0.4, 1.5, 0.6);
    const grip = new THREE.Mesh(gripGeo, blasterMat);
    grip.position.set(0, -0.9, -0.4);
    grip.rotation.x = -0.3;
    group.add(grip);

    // Energy rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(0.4 + i * 0.1, 0.03, 8, 24);
      const ring = new THREE.Mesh(ringGeo, neonMat);
      ring.position.set(0, 0.1, 1.2 + i * 0.5);
      group.add(ring);
      rings.push(ring);
    }

    group.userData.update = (time, audioVol) => {
      group.rotation.y = Math.sin(time * 2) * 0.3;
      group.position.y = Math.sin(time * 4) * 0.1;
      rings.forEach((r, idx) => {
        r.scale.setScalar(1.0 + Math.sin(time * 10 + idx) * 0.2 + audioVol * 0.3);
      });
    };

    return group;
  }

  static _buildChainsawEngine(group) {
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xff8500, roughness: 0.3 });
    const barMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 });

    const motorGeo = new THREE.BoxGeometry(1.6, 1.2, 1.8);
    const motor = new THREE.Mesh(motorGeo, motorMat);
    group.add(motor);

    const bladeGeo = new THREE.BoxGeometry(0.1, 0.8, 3.2);
    const blade = new THREE.Mesh(bladeGeo, barMat);
    blade.position.set(0, 0, 2.0);
    group.add(blade);

    const handleGeo = new THREE.TorusGeometry(0.7, 0.08, 8, 24, Math.PI);
    const handle = new THREE.Mesh(handleGeo, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0, 0.6, -0.4);
    group.add(handle);

    group.userData.update = (time, audioVol) => {
      const vibe = (Math.random() - 0.5) * 0.1;
      group.position.x = vibe;
      group.position.y = vibe;
      group.rotation.z = Math.sin(time * 30) * 0.04;
    };

    return group;
  }

  static _buildSodaCan(group) {
    const canMat = new THREE.MeshStandardMaterial({ color: 0xe63946, metalness: 0.8, roughness: 0.2 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });

    const canGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.8, 32);
    const can = new THREE.Mesh(canGeo, canMat);
    group.add(can);

    const rimGeo = new THREE.TorusGeometry(0.9, 0.06, 8, 32);
    const rimTop = new THREE.Mesh(rimGeo, rimMat);
    rimTop.rotation.x = Math.PI / 2;
    rimTop.position.y = 1.4;
    group.add(rimTop);

    // Fizz bubbles
    const bubbles = [];
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 12; i++) {
      const bGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 8, 8);
      const b = new THREE.Mesh(bGeo, bubbleMat);
      b.position.set((Math.random() - 0.5) * 0.8, 1.4 + Math.random() * 1.5, (Math.random() - 0.5) * 0.8);
      group.add(b);
      bubbles.push(b);
    }

    group.userData.update = (time, audioVol) => {
      group.rotation.y = time * 0.8;
      bubbles.forEach((b, idx) => {
        b.position.y = 1.4 + ((time * 2 + idx * 0.2) % 1.5);
      });
    };

    return group;
  }

  static _buildCatHiss(group) {
    const catMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });

    // Arching Body
    const bodyGeo = new THREE.SphereGeometry(1.0, 16, 16);
    bodyGeo.scale(0.8, 1.4, 1.2);
    const body = new THREE.Mesh(bodyGeo, catMat);
    body.position.y = 0.2;
    group.add(body);

    // Head & Ears
    const headGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const head = new THREE.Mesh(headGeo, catMat);
    head.position.set(0, 0.8, 1.0);
    group.add(head);

    const earGeo = new THREE.ConeGeometry(0.2, 0.4, 8);
    const leftEar = new THREE.Mesh(earGeo, catMat);
    leftEar.position.set(0.3, 1.3, 0.9);
    const rightEar = new THREE.Mesh(earGeo, catMat);
    rightEar.position.set(-0.3, 1.3, 0.9);
    group.add(leftEar, rightEar);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.2, 0.9, 1.45);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.2, 0.9, 1.45);
    group.add(leftEye, rightEye);

    group.userData.update = (time, audioVol) => {
      const arch = Math.sin(time * 6) * 0.15;
      body.scale.y = 1.4 + arch + audioVol * 0.3;
      head.rotation.y = Math.sin(time * 3) * 0.1;
    };

    return group;
  }

  static _buildKettlebell(group) {
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, metalness: 0.85, roughness: 0.3 });

    const sphereGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, kbMat);
    sphere.position.y = -0.3;
    group.add(sphere);

    const handleGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32, Math.PI);
    const handle = new THREE.Mesh(handleGeo, kbMat);
    handle.rotation.z = Math.PI;
    handle.position.set(0, 1.2, 0);
    group.add(handle);

    // Floor impact ring
    const impactGeo = new THREE.RingGeometry(0.4, 2.4, 32);
    const impactMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const impact = new THREE.Mesh(impactGeo, impactMat);
    impact.rotation.x = Math.PI / 2;
    impact.position.y = -1.6;
    group.add(impact);

    group.userData.update = (time, audioVol) => {
      const drop = Math.sin(time * 3);
      sphere.position.y = -0.3 + (drop > 0 ? drop * 0.8 : 0);
      handle.position.y = 1.2 + (drop > 0 ? drop * 0.8 : 0);
      impact.scale.setScalar(1.0 + Math.abs(Math.sin(time * 6)) * 0.4);
    };

    return group;
  }

  static _buildWoodpecker(group) {
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x582f0e, roughness: 0.8 });
    const birdMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.4 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.3 });

    // Tree Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.5, 24);
    const trunk = new THREE.Mesh(trunkGeo, treeMat);
    trunk.position.set(-1.0, 0, 0);
    group.add(trunk);

    // Bird Group
    const bird = new THREE.Group();
    const bodyGeo = new THREE.ConeGeometry(0.4, 1.2, 12);
    const body = new THREE.Mesh(bodyGeo, birdMat);
    body.rotation.z = -Math.PI / 4;
    bird.add(body);

    const beakGeo = new THREE.ConeGeometry(0.12, 0.8, 8);
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.z = Math.PI / 2;
    beak.position.set(-0.5, 0.3, 0);
    bird.add(beak);

    bird.position.set(0.2, 0.3, 0);
    group.add(bird);

    group.userData.update = (time, audioVol) => {
      const peck = Math.sin(time * 24) * 0.3;
      bird.rotation.z = peck;
      bird.position.x = 0.2 - Math.abs(peck) * 0.4;
    };

    return group;
  }

  static _buildWaterSlide(group) {
    const slideCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.0, 2.0, -2.0),
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(2.0, -0.5, 1.5),
    ]);
    const slideGeo = new THREE.TubeGeometry(slideCurve, 32, 0.6, 12, false);
    const slideMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75, roughness: 0.1 });
    const slide = new THREE.Mesh(slideGeo, slideMat);
    group.add(slide);

    const raftGeo = new THREE.TorusGeometry(0.4, 0.15, 8, 16);
    const raftMat = new THREE.MeshStandardMaterial({ color: 0xff2e93 });
    const raft = new THREE.Mesh(raftGeo, raftMat);
    raft.rotation.x = Math.PI / 2;
    group.add(raft);

    group.userData.update = (time, audioVol) => {
      const progress = (time * 0.5) % 1.0;
      const pt = slideCurve.getPointAt(progress);
      raft.position.copy(pt);
      raft.position.y += 0.2;
    };

    return group;
  }

  static _buildWarpCore(group) {
    // 1. Heavy Industrial Magnetic Containment Endcaps
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1d2d44,
      metalness: 0.85,
      roughness: 0.25,
    });
    const glowMatBlue = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00b4d8,
      emissiveIntensity: 1.5,
      metalness: 0.2,
      roughness: 0.1,
    });

    const baseGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.4, 32);
    const topBase = new THREE.Mesh(baseGeo, metalMat);
    topBase.position.y = 2.0;
    const botBase = new THREE.Mesh(baseGeo, metalMat);
    botBase.position.y = -2.0;
    group.add(topBase, botBase);

    // 2. Vertical Glass Warp Plasma Containment Chamber
    const glassGeo = new THREE.CylinderGeometry(1.0, 1.0, 3.8, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
    });
    const glassChamber = new THREE.Mesh(glassGeo, glassMat);
    group.add(glassChamber);

    // 3. Central Dilithium Reaction Crystal Core Chamber
    const centerChamberGeo = new THREE.TorusGeometry(1.25, 0.18, 16, 32);
    const centerRing = new THREE.Mesh(centerChamberGeo, glowMatBlue);
    centerRing.rotation.x = Math.PI / 2;
    group.add(centerRing);

    const crystalGeo = new THREE.OctahedronGeometry(0.5, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff007f,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    group.add(crystal);

    // 4. Stacking Pulsing Magnetic Acceleration Rings
    const ringCount = 6;
    const rings = [];
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(1.06, 0.08, 12, 32);
      const ringMesh = new THREE.Mesh(ringGeo, glowMatBlue.clone());
      ringMesh.rotation.x = Math.PI / 2;
      const yOffset = (i - (ringCount - 1) / 2) * 0.55;
      ringMesh.position.y = yOffset;
      group.add(ringMesh);
      rings.push({ mesh: ringMesh, baseY: yOffset, index: i });
    }

    // 5. Plasma Particle Cascade
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let p = 0; p < pCount * 3; p += 3) {
      const r = Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      pPos[p] = Math.cos(theta) * r;
      pPos[p + 1] = (Math.random() - 0.5) * 3.4;
      pPos[p + 2] = Math.sin(theta) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    // 6. External Support Conduits
    for (let s = 0; s < 4; s++) {
      const angle = (s / 4) * Math.PI * 2;
      const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.0, 12);
      const strut = new THREE.Mesh(strutGeo, metalMat);
      strut.position.set(Math.cos(angle) * 1.35, 0, Math.sin(angle) * 1.35);
      group.add(strut);
    }

    group.userData.update = (time, audioVol, delta) => {
      crystal.rotation.y = time * 2.5;
      crystal.rotation.x = Math.sin(time * 3) * 0.4;
      crystal.scale.setScalar(1.0 + Math.sin(time * 8) * 0.15 + (audioVol || 0) * 0.4);

      centerRing.rotation.z = time * 1.5;

      rings.forEach((r) => {
        const pulse = Math.sin(time * 10 - Math.abs(r.baseY) * 4);
        const glow = Math.max(0.4, (pulse + 1) * 0.8 + (audioVol || 0) * 1.2);
        r.mesh.material.emissiveIntensity = glow;
        r.mesh.scale.setScalar(1.0 + (pulse > 0.8 ? 0.08 : 0));
      });

      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        if (positions[i] > 0) {
          positions[i] -= (delta || 0.016) * (1.5 + (audioVol || 0) * 3.0);
          if (positions[i] < 0.1) positions[i] = 1.8;
        } else {
          positions[i] += (delta || 0.016) * (1.5 + (audioVol || 0) * 3.0);
          if (positions[i] > -0.1) positions[i] = -1.8;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      group.rotation.y = time * 0.4;
    };

    return group;
  }

  static _buildSpringPad(group) {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
    const springMat = new THREE.MeshStandardMaterial({ color: 0xffbe0b, metalness: 0.9, roughness: 0.2 });
    const padMat = new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.4, emissive: 0x330011 });

    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.4, 32);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -1.2;
    group.add(base);

    const springGeo = new THREE.TorusGeometry(0.7, 0.15, 12, 32);
    const coils = [];
    for (let c = 0; c < 5; c++) {
      const coil = new THREE.Mesh(springGeo, springMat);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = -0.9 + c * 0.35;
      group.add(coil);
      coils.push({ mesh: coil, base: -0.9 + c * 0.35, idx: c });
    }

    const topPadGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.3, 32);
    const topPad = new THREE.Mesh(topPadGeo, padMat);
    topPad.position.y = 0.8;
    group.add(topPad);

    group.userData.update = (time, audioVol) => {
      const bounce = Math.abs(Math.sin(time * 6));
      topPad.position.y = 0.2 + bounce * 0.9;
      coils.forEach((c) => {
        c.mesh.position.y = -0.9 + (c.idx / 4) * (1.1 + bounce * 0.8);
      });
      group.rotation.y = time * 0.5;
    };

    return group;
  }

  static _buildDefaultSonic(group) {
    const geo = new THREE.IcosahedronGeometry(1.4, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      emissive: 0x003366,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    group.userData.update = (time, audioVol) => {
      mesh.rotation.x = time * 0.5;
      mesh.rotation.y = time * 0.8;
      mesh.scale.setScalar(1.0 + audioVol * 0.5);
    };

    return group;
  }
}
