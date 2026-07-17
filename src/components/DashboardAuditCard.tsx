import React, { useCallback } from 'react';

export type RiskDistribution = {
  low: number;
  medium: number;
  high: number;
};

export type AuditSummary = {
  total: number;
  distribution: RiskDistribution;
  latestSummary: string;
};

export type DashboardAuditCardProps = {
  summary: AuditSummary;
  onClick: () => void;
};

const DashboardAuditCard: React.FC<DashboardAuditCardProps> = ({ summary, onClick }) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  return (
    <div
      className="dashboard-audit-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`审计概览：共 ${summary.total} 项，高风险 ${summary.distribution.high}，中风险 ${summary.distribution.medium}，低风险 ${summary.distribution.low}`}
    >
      <div className="dashboard-audit-card__header">
        <span className="dashboard-audit-card__count">{summary.total}</span>
        <div className="dashboard-audit-card__risk-dots">
          <span
            className="dashboard-audit-card__risk-dot dashboard-audit-card__risk-dot--high"
            aria-label={`高风险：${summary.distribution.high}`}
          />
          <span
            className="dashboard-audit-card__risk-dot dashboard-audit-card__risk-dot--medium"
            aria-label={`中风险：${summary.distribution.medium}`}
          />
          <span
            className="dashboard-audit-card__risk-dot dashboard-audit-card__risk-dot--low"
            aria-label={`低风险：${summary.distribution.low}`}
          />
        </div>
      </div>
      <p className="dashboard-audit-card__summary">{summary.latestSummary}</p>
      <div className="dashboard-audit-card__arrow">
        <span>查看详情</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  );
};

export default DashboardAuditCard;