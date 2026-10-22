import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apkPath = path.resolve(__dirname, '../public/downloads/Nseen-v1.2.1-pro.apk');
const outJson = path.resolve(__dirname, '../src/data/release.json');
const outSha = path.resolve(__dirname, '../public/downloads/Nseen-v1.2.1-pro.apk.sha256');

if (!fs.existsSync(apkPath)) {
  console.error(`Error: APK not found at ${apkPath}`);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(apkPath);
const hashSum = crypto.createHash('sha256');
hashSum.update(fileBuffer);
const sha256 = hashSum.digest('hex');
const stats = fs.statSync(apkPath);

const releaseData = {
  version: "1.2.1-pro",
  versionCode: 121,
  filename: "Nseen-v1.2.1-pro.apk",
  sha256: sha256,
  sizeBytes: stats.size,
  releaseDate: "2026-10-22",
  minAndroid: "Android 8.0 (Oreo) or higher (API 26+)",
  downloadUrl: "/downloads/Nseen-v1.2.1-pro.apk"
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(releaseData, null, 2));
fs.writeFileSync(outSha, `${sha256}  Nseen-v1.2.1-pro.apk\n`);

console.log(`✓ Release metadata generated successfully!`);
console.log(`  Version: ${releaseData.version}`);
console.log(`  SHA256:  ${sha256}`);
console.log(`  Size:    ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
