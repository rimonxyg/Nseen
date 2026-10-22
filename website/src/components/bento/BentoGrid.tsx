import React from 'react';
import { BentoTile } from './BentoTile';
import { copy } from '../../data/copy';
import {
  Zap,
  ShieldCheck,
  Languages,
  Fingerprint,
  Layers,
  CircleDollarSign,
} from 'lucide-react';

export const BentoGrid: React.FC<{ lang: 'en' | 'bn' }> = ({ lang }) => {
  const t = copy[lang].bento;

  const icons = [
    <Zap className="w-6 h-6" />,
    <ShieldCheck className="w-6 h-6" />,
    <Languages className="w-6 h-6" />,
    <Fingerprint className="w-6 h-6" />,
    <Layers className="w-6 h-6" />,
    <CircleDollarSign className="w-6 h-6" />,
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald uppercase mb-3 inline-block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-base text-text-secondary">
            {t.subtitle}
          </p>
        </div>

        {/* 6-Tile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.tiles.map((tile, index) => (
            <BentoTile
              key={tile.id}
              id={tile.id}
              title={tile.title}
              tag={tile.tag}
              summary={tile.summary}
              details={tile.details}
              icon={icons[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

