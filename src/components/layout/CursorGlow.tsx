import React from 'react';
import { useCursorGlow } from '../../hooks/useCursorGlow';

export const CursorGlow: React.FC = () => {
  const { x, y, enabled } = useCursorGlow();

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(212, 175, 55, 0.07), transparent 80%)`,
      }}
    />
  );
};
