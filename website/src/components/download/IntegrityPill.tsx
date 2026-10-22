import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { copyToClipboard } from '../../lib/copyToClipboard';
import releaseInfo from '../../data/release.json';

export const IntegrityPill: React.FC<{ onCopySuccess: () => void }> = ({ onCopySuccess }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hash = releaseInfo.sha256;
  const truncatedHash = `${hash.slice(0, 8)}...${hash.slice(-8)}`;

  const handleCopy = async () => {
    const success = await copyToClipboard(hash);
    if (success) {
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto">
      <div className="inline-flex items-center gap-2 p-1.5 pl-3 rounded-full glass border border-white/10 text-xs font-mono text-text-secondary w-full justify-between">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />
          <span className="text-text-tertiary">SHA-256:</span>
          <span className="text-text-primary font-semibold">{truncatedHash}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 px-3 rounded-full bg-emerald/15 hover:bg-emerald/30 text-emerald font-sans font-medium text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald"
            aria-label="Copy SHA-256 Checksum"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-colors focus-visible:outline-none"
            aria-label="Toggle full hash view"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="w-full p-3 rounded-xl bg-obsidian-subtle border border-white/5 font-mono text-[11px] text-text-secondary break-all text-center animate-fade-in">
          {hash}
        </div>
      )}
    </div>
  );
};

