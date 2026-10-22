export interface PlatformInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  isInAppBrowser: boolean;
  detectedBrand: 'samsung' | 'stock' | 'xiaomi' | 'vivo';
  osName: string;
}

export function detectPlatform(customUa?: string): PlatformInfo {
  const ua = customUa || (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isWindows = /windows/i.test(ua);
  const isMacOS = /macintosh|mac os x/i.test(ua) && !isIOS;
  const isLinux = /linux/i.test(ua) && !isAndroid;

  // In-app browsers often restrict APK downloads (FB, Instagram, Messenger, TikTok, Line)
  const isInAppBrowser = /fban|fbav|instagram|messenger|musical_ly|bytedance|line/i.test(ua);

  let detectedBrand: 'samsung' | 'stock' | 'xiaomi' | 'vivo' = 'samsung';
  if (/samsung|sm-|gt-/i.test(ua)) {
    detectedBrand = 'samsung';
  } else if (/xiaomi|redmi|poco|miui|hyperos/i.test(ua)) {
    detectedBrand = 'xiaomi';
  } else if (/vivo|iqoo|oppo|realme|oneplus|cph|rmx/i.test(ua)) {
    detectedBrand = 'vivo';
  } else if (/nothing|pixel|nexus|motorola|moto/i.test(ua)) {
    detectedBrand = 'stock';
  }

  let osName = 'Unknown OS';
  if (isAndroid) osName = 'Android';
  else if (isIOS) osName = 'iOS';
  else if (isWindows) osName = 'Windows';
  else if (isMacOS) osName = 'macOS';
  else if (isLinux) osName = 'Linux';

  return {
    isAndroid,
    isIOS,
    isWindows,
    isMacOS,
    isLinux,
    isInAppBrowser,
    detectedBrand,
    osName,
  };
}
