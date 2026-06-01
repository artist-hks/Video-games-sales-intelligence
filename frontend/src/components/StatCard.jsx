import React, { useEffect, useRef, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, color = '#7c3aed', trend, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const isNumeric = typeof value === 'number' || !isNaN(parseFloat(value));

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const end = numericValue;
    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;

      if (end >= 100) {
        setDisplayValue(Math.round(current));
      } else if (end >= 1) {
        setDisplayValue(parseFloat(current.toFixed(1)));
      } else {
        setDisplayValue(parseFloat(current.toFixed(2)));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [numericValue, isNumeric]);

  const formattedValue = isNumeric
    ? typeof displayValue === 'number'
      ? displayValue.toLocaleString()
      : displayValue
    : value;

  return (
    <div className="card card-accent-purple" ref={ref} style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {Icon && <Icon size={20} color={color} />}
        </div>
        {trend && (
          <span className="pill pill-green" style={{ fontSize: '0.6875rem' }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            color: color,
            lineHeight: 1.1,
          }}
        >
          {prefix}{formattedValue}{suffix}
        </div>
        <div
          style={{
            fontSize: '0.8125rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
