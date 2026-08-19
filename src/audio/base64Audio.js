/**
 * Base64 Audio Conversion and Management Utility
 * Converts local audio uploads (MP3, WAV, OGG, M4A) and remote audio URLs into
 * standardized, self-contained Base64 Data URIs (data:audio/...;base64,...).
 */

export async function convertFileToBase64(file) {
  if (!file) throw new Error('No file provided');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export async function convertAudioUrlToBase64(url) {
  if (!url || typeof url !== 'string') throw new Error('Invalid audio URL');

  // If already base64, return directly
  if (isBase64Audio(url)) {
    return url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status} fetching audio`);

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn(`Direct fetch failed for ${url}, fallback to raw link:`, err);
    // If CORS prevents fetch, return original URL as fallback
    return url;
  }
}

export function isBase64Audio(str) {
  return typeof str === 'string' && str.startsWith('data:audio/');
}

export function getAudioDurationFromBase64(base64Str) {
  return new Promise((resolve) => {
    try {
      const audio = new Audio();
      audio.src = base64Str;
      audio.onloadedmetadata = () => {
        resolve(audio.duration || 0);
      };
      audio.onerror = () => resolve(0);
    } catch (e) {
      resolve(0);
    }
  });
}
