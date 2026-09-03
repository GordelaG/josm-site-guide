'use client';

import React from 'react';
import { AirportCounts } from '../../types/airport';
import { CheckCircle2, Clock, Hourglass, Globe, TrendingUp } from 'lucide-react';

interface AdminStatsProps {
  counts: AirportCounts;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ counts }) => {
  const percentage = counts.total > 0 ? ((counts.done / counts.total) * 100).toFixed(1) : '0';

  const stats = [
    {
      label: 'Total Monitorado',
      value: counts.total,
      hint: 'aeródromos no projeto',
      icon: Globe,
      color: '#38bdf8',
      accentBorder: 'rgba(56, 189, 248, 0.4)',
    },
    {
      label: 'Concluídos',
      value: counts.done,
      hint: 'lançados (v1.0+)',
      icon: CheckCircle2,
      color: '#10b981',
      accentBorder: 'rgba(16, 185, 129, 0.4)',
    },
    {
      label: 'Em Andamento',
      value: counts.in_progress,
      hint: 'em edição no JOSM',
      icon: Clock,
      color: '#f59e0b',
      accentBorder: 'rgba(245, 158, 11, 0.4)',
    },
    {
      label: 'Na Fila',
      value: counts.pending,
      hint: 'aguardando início',
      icon: Hourglass,
      color: '#ef4444',
      accentBorder: 'rgba(239, 68, 68, 0.4)',
    },
    {
      label: 'Progresso Geral',
      value: `${percentage}%`,
      hint: `${counts.done} de ${counts.total} prontos`,
      icon: TrendingUp,
      color: '#38bdf8',
      accentBorder: 'rgba(0, 84, 219, 0.4)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass-card sheen"
            style={{
              padding: '1.25rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              borderLeft: `3px solid ${stat.color}`,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="label-technical" style={{ color: stat.color }}>
                {stat.label}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}
              >
                <Icon size={16} />
              </div>
            </div>

            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                {stat.hint}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
