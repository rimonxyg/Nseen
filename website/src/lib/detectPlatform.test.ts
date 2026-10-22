import { describe, it, expect } from 'vitest';
import { detectPlatform } from './detectPlatform';

describe('detectPlatform', () => {
  it('detects Android user agent', () => {
    const androidUa = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    const result = detectPlatform(androidUa);
    expect(result.isAndroid).toBe(true);
    expect(result.osName).toBe('Android');
    expect(result.detectedBrand).toBe('samsung');
  });

  it('detects iPhone / iOS user agent', () => {
    const iphoneUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = detectPlatform(iphoneUa);
    expect(result.isIOS).toBe(true);
    expect(result.isAndroid).toBe(false);
    expect(result.osName).toBe('iOS');
  });

  it('detects Xiaomi / HyperOS user agent', () => {
    const xiaomiUa = 'Mozilla/5.0 (Linux; Android 14; 23117RK66C Build/UKQ1.230804.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.144 Mobile Safari/537.36 XiaoMi/MiuiBrowser/18.0.20';
    const result = detectPlatform(xiaomiUa);
    expect(result.isAndroid).toBe(true);
    expect(result.detectedBrand).toBe('xiaomi');
  });

  it('detects in-app browsers like Facebook', () => {
    const fbUa = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.28.115;]';
    const result = detectPlatform(fbUa);
    expect(result.isInAppBrowser).toBe(true);
  });
});
