import React from 'react';
import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 16,
  md: 24,
  lg: 36,
};

export default function LoadingSpinner({ size = 'md', color = '#7c3aed' }) {
  const px = sizes[size] || sizes.md;
  return (
    <Loader2
      size={px}
      color={color}
      className="spinner"
      style={{ display: 'inline-block' }}
    />
  );
}
