import * as THREE from 'three';
import { SceneModelFactory } from './sceneModels.js';
import { GlbManager } from './glbManager.js';

/**
 * ThemeSceneEngine:
 * Dynamic 3D Scene Runtime that loads geometry, alignment, materials, and live animations
 * from standard GLB objects, theme definitions, JavaScript scripts, or procedural models.
 */
export class ThemeSceneEngine {
  /**
   * Builds and mounts a 3D scene from a Question or Theme specification.
   * @param {Object} questionOrTheme Question object or theme definition
   * @param {Object} context Runtime context { isRevealed, audioVol, freqData, packTheme }
   * @returns {THREE.Group} Renderable Three.js Group with userData.update lifecycle
   */
  static buildScene(questionOrTheme, context = {}) {
    let target = questionOrTheme;
    if (typeof target === 'string') {
      target = { sceneModel: target };
    } else if (!target || typeof target !== 'object') {
      target = {};
    }

    // If target is a pack with sounds, use the first sound's definition
    if (Array.isArray(target.sounds) && target.sounds.length > 0 && !target.sceneGlb && !target.sceneModel && !target.sceneScript && !target.scene3D) {
      target = target.sounds[0];
    }

    const group = new THREE.Group();
    const modelKey = target.sceneModel || 'pool_flamingo';
    group.name = `theme_scene_${target.id || modelKey}`;

    // 1. Check for Standard Portable Binary GLB Object (sceneGlb)
    if (target.sceneGlb && typeof target.sceneGlb === 'string' && target.sceneGlb.trim().length > 0) {
      const glbSource = target.sceneGlb.trim();
      let innerGroup = null;
      let mixer = null;

      GlbManager.loadGlb(glbSource, {
        targetSize: target.targetSize || 2.4,
        name: `glb_${target.id || modelKey}`,
      })
        .then((result) => {
          innerGroup = result.group;
          mixer = result.mixer;
          group.add(innerGroup);
        })
        .catch((err) => {
          console.warn(`[ThemeSceneEngine] Failed loading sceneGlb for "${target.id || modelKey}", falling back to procedural model:`, err);
          const fallback = SceneModelFactory.createModel(modelKey);
          group.add(fallback);
          group.userData.update = fallback.userData.update;
          group.userData.dispose = fallback.userData.dispose;
        });

      group.userData.update = (time, audioVol, delta, freqData, isRevealed) => {
        if (innerGroup && innerGroup.userData && typeof innerGroup.userData.update === 'function') {
          innerGroup.userData.update(time, audioVol, delta, freqData, isRevealed);
        }
      };
      group.userData.dispose = () => {
        if (innerGroup && innerGroup.userData && typeof innerGroup.userData.dispose === 'function') {
          innerGroup.userData.dispose();
        }
      };
      group.userData.onReveal = () => {
        if (innerGroup) {
          innerGroup.scale.setScalar(1.2);
          setTimeout(() => innerGroup && innerGroup.scale.setScalar(1.0), 300);
        }
      };
      group.userData.revision = target.revision || 1;
      return group;
    }

    // 2. Check for Direct Custom JavaScript Scene Script
    if (target.sceneScript && typeof target.sceneScript === 'string' && target.sceneScript.trim().length > 0) {
      try {
        const lifecycle = this.executeSceneScript(target.sceneScript, group, context);
        if (lifecycle) {
          group.userData.update = (time, audioVol, delta, freqData, isRevealed) => {
            if (typeof lifecycle.update === 'function') {
              lifecycle.update(time, delta, audioVol, freqData, isRevealed);
            }
          };
          group.userData.onEvent = (eventName, payload) => {
            if (typeof lifecycle.onEvent === 'function') {
              try {
                lifecycle.onEvent(eventName, payload);
              } catch (err) {
                console.warn(`[ThemeSceneEngine] Error in scene onEvent("${eventName}"):`, err);
              }
            }
          };
          group.userData.onUpdate = (params) => {
            if (typeof lifecycle.onUpdate === 'function') {
              lifecycle.onUpdate(params);
            }
          };
          group.userData.onReveal = lifecycle.onReveal;
          group.userData.dispose = lifecycle.dispose;
          group.userData.revision = target.revision || 1;
        }
        return group;
      } catch (err) {
        console.error('[ThemeSceneEngine] Error executing custom sceneScript:', err);
      }
    }

    // 2. Check for Declarative 3D Scene JSON Specification
    if (target.scene3D && typeof target.scene3D === 'object') {
      try {
        this.buildDeclarativeScene(target.scene3D, group, context);
        group.userData.revision = target.revision || 1;
        return group;
      } catch (err) {
        console.error('[ThemeSceneEngine] Error building declarative scene3D:', err);
      }
    }

    // 3. Fallback to Named Model Factory with Script-Driven Geometry
    const factoryModel = SceneModelFactory.createModel(modelKey);
    if (factoryModel) {
      factoryModel.userData.revision = target.revision || 1;
    }
    return factoryModel;
  }

  /**
   * Safely compiles and executes a 3D JavaScript scene script.
   */
  static executeSceneScript(scriptSource, group, context) {
    // Wrap script in execution harness providing THREE, group, context
    let sanitized = scriptSource.trim();

    // If script starts with 'function' or 'export default function', adapt to callable body
    if (sanitized.startsWith('export default function') || sanitized.startsWith('function')) {
      const bodyStartIndex = sanitized.indexOf('{');
      const bodyEndIndex = sanitized.lastIndexOf('}');
      if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
        sanitized = sanitized.substring(bodyStartIndex + 1, bodyEndIndex);
      }
    }

    const scriptFn = new Function('THREE', 'group', 'context', sanitized);
    const result = scriptFn(THREE, group, context);
    return result || {};
  }

  /**
   * Builds a scene from a declarative JSON specification.
   */
  static buildDeclarativeScene(spec, group, context) {
    if (spec.alignment) {
      const pos = spec.alignment.position || [0, 0, 0];
      const rot = spec.alignment.rotation || [0, 0, 0];
      const scale = spec.alignment.scale || [1, 1, 1];
      group.position.set(pos[0], pos[1], pos[2]);
      group.rotation.set(rot[0], rot[1], rot[2]);
      group.scale.set(scale[0], scale[1], scale[2]);
    }

    const animatedMeshes = [];

    if (Array.isArray(spec.elements)) {
      spec.elements.forEach((elem) => {
        let geo;
        switch (elem.type) {
          case 'box':
            geo = new THREE.BoxGeometry(...(elem.args || [1, 1, 1]));
            break;
          case 'sphere':
            geo = new THREE.SphereGeometry(...(elem.args || [0.8, 24, 24]));
            break;
          case 'cylinder':
            geo = new THREE.CylinderGeometry(...(elem.args || [0.5, 0.5, 1.5, 24]));
            break;
          case 'torus':
            geo = new THREE.TorusGeometry(...(elem.args || [1, 0.3, 16, 32]));
            break;
          case 'cone':
            geo = new THREE.ConeGeometry(...(elem.args || [0.6, 1.5, 24]));
            break;
          default:
            geo = new THREE.DodecahedronGeometry(0.8);
        }

        const matProps = elem.material || { color: 0xd4af37, roughness: 0.3, metalness: 0.7 };
        const mat = new THREE.MeshStandardMaterial({
          color: matProps.color !== undefined ? matProps.color : 0xd4af37,
          roughness: matProps.roughness !== undefined ? matProps.roughness : 0.3,
          metalness: matProps.metalness !== undefined ? matProps.metalness : 0.7,
          transparent: Boolean(matProps.transparent),
          opacity: matProps.opacity !== undefined ? matProps.opacity : 1.0,
          wireframe: Boolean(matProps.wireframe),
        });

        const mesh = new THREE.Mesh(geo, mat);
        if (elem.position) mesh.position.set(...elem.position);
        if (elem.rotation) mesh.rotation.set(...elem.rotation);
        if (elem.scale) mesh.scale.set(...elem.scale);

        group.add(mesh);

        if (elem.animation) {
          animatedMeshes.push({ mesh, anim: elem.animation });
        }
      });
    }

    group.userData.update = (time, audioVol) => {
      animatedMeshes.forEach(({ mesh, anim }) => {
        if (anim.spinY) mesh.rotation.y = time * anim.spinY;
        if (anim.spinX) mesh.rotation.x = time * anim.spinX;
        if (anim.floatY) mesh.position.y += Math.sin(time * (anim.floatSpeed || 2)) * (anim.floatAmount || 0.005);
        if (anim.pulseAudio) {
          const s = 1 + (audioVol || 0) * (anim.pulseScale || 0.5);
          mesh.scale.set(s, s, s);
        }
      });
    };
  }

  /**
   * Template code generator for custom theme 3D scripts in Sound Pack Forge Studio.
   */
  static getScriptTemplate(preset = 'kinetic_gear') {
    switch (preset) {
      case 'kinetic_gear':
        return `// Steampunk Kinetic Gear Assembly
const gearGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 12);
const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
const gear = new THREE.Mesh(gearGeo, goldMat);
group.add(gear);

const hubGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32);
const copperMat = new THREE.MeshStandardMaterial({ color: 0xb85d19, metalness: 0.9, roughness: 0.2 });
const hub = new THREE.Mesh(hubGeo, copperMat);
hub.position.y = 0.15;
group.add(hub);

group.position.set(0, 0, 0);

return {
  update: (time, delta, audioVol) => {
    gear.rotation.y = time * 1.5;
    hub.rotation.x = time * 2.0;
    gear.scale.setScalar(1 + (audioVol || 0) * 0.3);
  }
};`;

      case 'plasma_sphere':
        return `// Pulsing Acoustic Plasma Core
const coreGeo = new THREE.SphereGeometry(1.0, 32, 32);
const coreMat = new THREE.MeshStandardMaterial({ 
  color: 0x00f0ff, 
  emissive: 0x00a0cc, 
  emissiveIntensity: 0.6, 
  roughness: 0.1, 
  metalness: 0.9 
});
const core = new THREE.Mesh(coreGeo, coreMat);
group.add(core);

const ringGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 64);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xff007f, metalness: 0.8, roughness: 0.2 });
const ring = new THREE.Mesh(ringGeo, ringMat);
group.add(ring);

return {
  update: (time, delta, audioVol) => {
    core.rotation.y = time * 0.8;
    ring.rotation.x = time * 1.8;
    ring.rotation.y = time * 1.2;
    const pulse = 1 + (audioVol || 0) * 0.6;
    core.scale.set(pulse, pulse, pulse);
  }
};`;

      case 'crystal_prism':
        return `// Steampunk Refraction Crystal Prism
const prismGeo = new THREE.OctahedronGeometry(1.3, 0);
const prismMat = new THREE.MeshPhysicalMaterial({
  color: 0xffeedd,
  transmission: 0.85,
  opacity: 0.95,
  transparent: true,
  roughness: 0.1,
  ior: 1.6,
  metalness: 0.1
});
const prism = new THREE.Mesh(prismGeo, prismMat);
group.add(prism);

const baseGeo = new THREE.CylinderGeometry(0.8, 1.2, 0.3, 8);
const baseMat = new THREE.MeshStandardMaterial({ color: 0x2b1e16, roughness: 0.4, metalness: 0.8 });
const base = new THREE.Mesh(baseGeo, baseMat);
base.position.y = -1.2;
group.add(base);

return {
  update: (time, delta, audioVol) => {
    prism.rotation.y = time * 1.0;
    prism.rotation.z = Math.sin(time * 0.8) * 0.2;
    prism.position.y = Math.sin(time * 2.0) * 0.1;
  }
};`;

      default:
        return `// Custom Three.js 3D Foley Object
const geo = new THREE.TorusKnotGeometry(0.9, 0.3, 64, 16);
const mat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.7 });
const mesh = new THREE.Mesh(geo, mat);
group.add(mesh);

return {
  update: (time, delta, audioVol) => {
    mesh.rotation.x = time * 0.8;
    mesh.rotation.y = time * 1.2;
  }
};`;
    }
  }

  /**
   * Bakes any question or theme's 3D scene into a standalone Base64 GLB Data URI.
   * @param {Object} questionOrTheme
   * @returns {Promise<string>} Base64 GLB string
   */
  static async exportQuestionToGlb(questionOrTheme) {
    if (questionOrTheme && questionOrTheme.sceneGlb && typeof questionOrTheme.sceneGlb === 'string' && questionOrTheme.sceneGlb.length > 50) {
      return questionOrTheme.sceneGlb;
    }
    const tempGroup = new THREE.Group();
    const modelKey = (questionOrTheme && questionOrTheme.sceneModel) || 'pool_flamingo';
    const model = SceneModelFactory.createModel(modelKey);
    tempGroup.add(model);
    const glbDataUri = await GlbManager.exportToGlbBase64(tempGroup);
    return glbDataUri;
  }
}
