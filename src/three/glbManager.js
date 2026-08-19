import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * GlbManager:
 * Enterprise glTF/GLB Binary loader, serializer, validator, and scene optimizer
 * for Guessound 3D game packs.
 */
export class GlbManager {
  static loader = new GLTFLoader();
  static exporter = new GLTFExporter();

  /**
   * Converts a Base64 string / Data URI to an ArrayBuffer.
   * @param {string} base64Data
   * @returns {ArrayBuffer}
   */
  static base64ToArrayBuffer(base64Data) {
    let raw = base64Data;
    if (raw.includes(',')) {
      raw = raw.split(',')[1];
    }
    const binaryStr = atob(raw);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Converts an ArrayBuffer to a Base64 Data URI.
   * @param {ArrayBuffer} buffer
   * @param {string} mimeType
   * @returns {string}
   */
  static arrayBufferToBase64DataUri(buffer, mimeType = 'model/gltf-binary') {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const chunkSize = 0x8000; // 32KB chunks to avoid call stack overflow
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
      binary += String.fromCharCode.apply(null, chunk);
    }
    return `data:${mimeType};base64,${btoa(binary)}`;
  }

  /**
   * Checks if a string or buffer represents valid GLB data.
   * @param {string|ArrayBuffer} data
   * @returns {boolean}
   */
  static isGlb(data) {
    if (!data) return false;
    if (typeof data === 'string') {
      if (data.startsWith('data:model/gltf-binary') || data.startsWith('data:application/octet-stream') || data.endsWith('.glb')) {
        return true;
      }
      if (data.length > 20 && data.includes(';base64,')) {
        try {
          const buf = this.base64ToArrayBuffer(data.slice(0, 64));
          const view = new DataView(buf);
          return view.getUint32(0, true) === 0x46546c67; // "glTF" in little-endian
        } catch {
          return false;
        }
      }
    } else if (data instanceof ArrayBuffer) {
      if (data.byteLength < 12) return false;
      const view = new DataView(data);
      return view.getUint32(0, true) === 0x46546c67;
    }
    return false;
  }

  /**
   * Asynchronously parses or loads a GLB/glTF source into a normalized Three.js Group.
   * @param {string|ArrayBuffer} glbSource Base64 string, Data URI, URL, or ArrayBuffer
   * @param {Object} options Configuration options
   * @returns {Promise<{group: THREE.Group, mixer: THREE.AnimationMixer|null, gltf: Object}>}
   */
  static async loadGlb(glbSource, options = {}) {
    return new Promise((resolve, reject) => {
      const targetSize = options.targetSize || 2.4;
      const onGltfParsed = (gltf) => {
        const root = gltf.scene || gltf.scenes[0];
        if (!root) {
          return reject(new Error('GLB contains no scene graph root'));
        }

        const wrapper = new THREE.Group();
        wrapper.name = options.name || 'glb_model_root';

        // 1. Calculate Bounding Box and Normalize Scale / Alignment
        const bbox = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const scaleFactor = targetSize / maxDim;
        root.scale.setScalar(scaleFactor);

        // Center on base so it rests on the steampunk turntable
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        root.position.set(
          -center.x * scaleFactor,
          -bbox.min.y * scaleFactor - (targetSize * 0.4),
          -center.z * scaleFactor
        );

        // 2. Enhance Materials (PBR setup, Shadow Casting)
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.side = THREE.DoubleSide;
              if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                child.material.envMapIntensity = 1.2;
                child.material.needsUpdate = true;
              }
            }
          }
        });

        wrapper.add(root);

        // 3. Animation Mixer if GLB contains embedded keyframe clips
        let mixer = null;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(root);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }

        // Attach lifecycle update handler
        wrapper.userData.update = (time, audioVol, delta, freqData, isRevealed) => {
          if (mixer) {
            mixer.update(delta || 0.016);
          }
          // Dynamic audio reaction
          if (audioVol && audioVol > 0.02) {
            const pulse = 1.0 + Math.sin(time * 8) * (audioVol * 0.25);
            wrapper.scale.setScalar(pulse);
          } else {
            wrapper.scale.setScalar(1.0);
          }
          // Ambient turntable sway if not revealed
          if (!isRevealed) {
            wrapper.rotation.y = time * 0.4;
          }
        };

        wrapper.userData.dispose = () => {
          if (mixer) mixer.stopAllAction();
          root.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m) => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        };

        resolve({ group: wrapper, mixer, gltf });
      };

      try {
        if (typeof glbSource === 'string') {
          if (glbSource.startsWith('data:') || (glbSource.length > 200 && !glbSource.startsWith('http') && !glbSource.startsWith('/'))) {
            // Base64 Data URI or raw base64 string
            const buffer = this.base64ToArrayBuffer(glbSource);
            this.loader.parse(buffer, '', onGltfParsed, (err) => reject(err));
          } else {
            // Standard URL / path
            this.loader.load(glbSource, onGltfParsed, undefined, (err) => reject(err));
          }
        } else if (glbSource instanceof ArrayBuffer) {
          this.loader.parse(glbSource, '', onGltfParsed, (err) => reject(err));
        } else {
          reject(new Error('Unsupported GLB source format'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Exports any Three.js Group into a binary GLB Base64 Data URI.
   * @param {THREE.Object3D} object3D
   * @returns {Promise<string>} Base64 Data URI ("data:model/gltf-binary;base64,...")
   */
  static async exportToGlbBase64(object3D) {
    return new Promise((resolve, reject) => {
      this.exporter.parse(
        object3D,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const dataUri = this.arrayBufferToBase64DataUri(result, 'model/gltf-binary');
            resolve(dataUri);
          } else {
            // If json returned
            const jsonStr = JSON.stringify(result);
            const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(jsonStr)))}`;
            resolve(dataUri);
          }
        },
        (error) => reject(error),
        { binary: true, embedImages: true }
      );
    });
  }

  /**
   * Reads a File object from an <input type="file"> into a Base64 Data URI.
   * @param {File} file
   * @returns {Promise<string>}
   */
  static async readFileToGlbBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
