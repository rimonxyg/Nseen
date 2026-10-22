import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { copyToClipboard } from '../../lib/copyToClipboard';

export const VerifyHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const commands = [
    {
      os: 'Android (Termux) / Linux',
      cmd: 'sha256sum Nseen-v1.2.1-pro.apk',
    },
    {
      os: 'Windows (PowerShell)',
      cmd: 'Get-FileHash Nseen-v1.2.1-pro.apk -Algorithm SHA256',
    },
    {
      os: 'macOS (Terminal)',
      cmd: 'shasum -a 256 Nseen-v1.2.1-pro.apk',
    },
  ];

  const handleCopy = async (cmd: string, index: number) => {
    const success = await copyToClipboard(cmd);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4 text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-text-tertiary hover:text-emerald transition-colors flex items-center justify-center gap-1.5 mx-auto focus-visible:outline-none"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>How to verify the checksum yourself?</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 rounded-xl bg-obsidian-subtle border border-white/10 flex flex-col gap-3 animate-fade-in">
          {commands.map((c, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-text-tertiary">{c.os}:</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 font-mono text-[11px] text-emerald-text border border-white/5">
                <span className="truncate">{c.cmd}</span>
                <button
                  onClick={() => handleCopy(c.cmd, i)}
                  className="p-1 hover:text-white transition-colors"
                  aria-label={`Copy command for ${c.os}`}
                >
                  {copiedIndex === i ? (
                    <Check className="w-3.5 h-3.5 text-emerald" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-text-tertiary" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

