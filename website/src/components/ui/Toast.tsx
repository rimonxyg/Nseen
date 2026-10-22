import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-obsidian-card border border-emerald/40 text-text-primary rounded-xl shadow-2xl animate-fade-in backdrop-blur-xl"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
