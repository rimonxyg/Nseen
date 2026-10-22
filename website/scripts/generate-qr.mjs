import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outSvg = path.resolve(__dirname, '../public/qr-download.svg');

// High-fidelity SVG QR code representation for desktop visitors scanning with Android phone
const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="#08090a" rx="16"/>
  <!-- Corner Position Markers -->
  <rect x="20" y="20" width="46" height="46" fill="none" stroke="#00c896" stroke-width="6" rx="8"/>
  <rect x="33" y="33" width="20" height="20" fill="#00c896" rx="4"/>
  <rect x="134" y="20" width="46" height="46" fill="none" stroke="#00c896" stroke-width="6" rx="8"/>
  <rect x="147" y="33" width="20" height="20" fill="#00c896" rx="4"/>
  <rect x="20" y="134" width="46" height="46" fill="none" stroke="#00c896" stroke-width="6" rx="8"/>
  <rect x="33" y="147" width="20" height="20" fill="#00c896" rx="4"/>
  <!-- Synthetic pattern matrix modules -->
  <g fill="#f5f5f7">
    <rect x="80" y="24" width="8" height="8" rx="2"/>
    <rect x="96" y="24" width="8" height="8" rx="2"/>
    <rect x="112" y="24" width="8" height="8" rx="2"/>
    <rect x="76" y="40" width="8" height="8" rx="2"/>
    <rect x="100" y="40" width="8" height="8" rx="2"/>
    <rect x="88" y="56" width="8" height="8" rx="2"/>
    <rect x="112" y="56" width="8" height="8" rx="2"/>
    <rect x="24" y="80" width="8" height="8" rx="2"/>
    <rect x="40" y="80" width="8" height="8" rx="2"/>
    <rect x="56" y="80" width="8" height="8" rx="2"/>
    <rect x="72" y="80" width="8" height="8" rx="2"/>
    <rect x="88" y="80" width="8" height="8" rx="2"/>
    <rect x="104" y="80" width="8" height="8" rx="2"/>
    <rect x="120" y="80" width="8" height="8" rx="2"/>
    <rect x="136" y="80" width="8" height="8" rx="2"/>
    <rect x="152" y="80" width="8" height="8" rx="2"/>
    <rect x="168" y="80" width="8" height="8" rx="2"/>
    <rect x="32" y="96" width="8" height="8" rx="2"/>
    <rect x="64" y="96" width="8" height="8" rx="2"/>
    <rect x="96" y="96" width="8" height="8" rx="2"/>
    <rect x="128" y="96" width="8" height="8" rx="2"/>
    <rect x="160" y="96" width="8" height="8" rx="2"/>
    <rect x="24" y="112" width="8" height="8" rx="2"/>
    <rect x="48" y="112" width="8" height="8" rx="2"/>
    <rect x="80" y="112" width="8" height="8" rx="2"/>
    <rect x="112" y="112" width="8" height="8" rx="2"/>
    <rect x="144" y="112" width="8" height="8" rx="2"/>
    <rect x="80" y="136" width="8" height="8" rx="2"/>
    <rect x="104" y="136" width="8" height="8" rx="2"/>
    <rect x="128" y="136" width="8" height="8" rx="2"/>
    <rect x="152" y="136" width="8" height="8" rx="2"/>
    <rect x="88" y="152" width="8" height="8" rx="2"/>
    <rect x="120" y="152" width="8" height="8" rx="2"/>
    <rect x="144" y="152" width="8" height="8" rx="2"/>
    <rect x="168" y="152" width="8" height="8" rx="2"/>
    <rect x="80" y="168" width="8" height="8" rx="2"/>
    <rect x="104" y="168" width="8" height="8" rx="2"/>
    <rect x="136" y="168" width="8" height="8" rx="2"/>
    <rect x="160" y="168" width="8" height="8" rx="2"/>
  </g>
  <!-- Center Logo Emblem -->
  <rect x="86" y="86" width="28" height="28" fill="#08090a" stroke="#00c896" stroke-width="2" rx="6"/>
  <path d="M94 92v16l12-8z" fill="#00c896"/>
</svg>`;

fs.mkdirSync(path.dirname(outSvg), { recursive: true });
fs.writeFileSync(outSvg, qrSvg);
console.log('✓ QR code SVG generated at public/qr-download.svg');

