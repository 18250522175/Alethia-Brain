import React, { useState, useCallback, useRef } from 'react';
import '../styles/audit-theme.css';

/* ============================================================
   Type Definitions
   ============================================================ */

export type RiskLevel = 'low' | 'medium' | 'high';

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}

export interface AuditChange {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  source: string;
  diff: DiffLine[];
  accepted?: boolean;
  rejected?: boolean;
}

export interface AuditCardProps {
  changes: AuditChange[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

/* ============================================================
   Constants
   ============================================================ */

const ACCEPT_ANIMATION_MS = 400;
const REJECT_ANIMATION_MS = 700;

/* ============================================================
   Helpers
   ============================================================ */

const riskLabel: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

/* ============================================================
   AuditCard Component
   ============================================================ */

const AuditCard: React.FC<AuditCardProps> = ({
  changes,
  onAccept,
  onReject,
  onAcceptAll,
  onRejectAll,
}) => {
  const [animatingCards, setAnimatingCards] = useState<
    Record<string, 'accept' | 'reject'>
  >({});
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const pendingChanges = changes.filter(
    (c) => !processedIds.has(c.id) && !(c.accepted || c.rejected)
  );

  const pendingCount = pendingChanges.length;

  /* ---- Individual card actions ---- */

  const handleAccept = useCallback(
    (id: string) => {
      if (animatingCards[id]) return;

      setAnimatingCards((prev) => ({ ...prev, [id]: 'accept' }));

      window.setTimeout(() => {
        onAccept(id);
        setProcessedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        setAnimatingCards((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, ACCEPT_ANIMATION_MS);
    },
    [animatingCards, onAccept]
  );

  const handleReject = useCallback(
    (id: string) => {
      if (animatingCards[id]) return;

      setAnimatingCards((prev) => ({ ...prev, [id]: 'reject' }));

      window.setTimeout(() => {
        onReject(id);
        setProcessedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });
        setAnimatingCards((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, REJECT_ANIMATION_MS);
    },
    [animatingCards, onReject]
  );

  /* ---- Bulk actions ---- */

  const handleAcceptAll = useCallback(() => {
    onAcceptAll();
    setProcessedIds((prev) => {
      const next = new Set(prev);
      pendingChanges.forEach((c) => next.add(c.id));
      return next;
    });
  }, [onAcceptAll, pendingChanges]);

  const handleRejectAll = useCallback(() => {
    onRejectAll();
    setProcessedIds((prev) => {
      const next = new Set(prev);
      pendingChanges.forEach((c) => next.add(c.id));
      return next;
    });
  }, [onRejectAll, pendingChanges]);

  /* ---- Keyboard navigation ---- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAccept(id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleReject(id);
      }
    },
    [handleAccept, handleReject]
  );

  /* ---- Render ---- */

  if (pendingCount === 0 && changes.length > 0) {
    return (
      <div className="glass-toolbar">
        <span className="audit-toolbar__count">All changes reviewed</span>
      </div>
    );
  }

  if (changes.length === 0) {
    return null;
  }

  return (
    <div role="region" aria-label="Audit changes panel">
      {/* ---- Glass Toolbar ---- */}
      <div className="glass-toolbar">
        <span className="audit-toolbar__count" aria-live="polite">
          {pendingCount} {pendingCount === 1 ? 'change' : 'changes'} pending
        </span>
        <div className="audit-toolbar">
          <button
            className="audit-btn audit-btn--primary"
            onClick={handleAcceptAll}
            disabled={pendingCount === 0}
          >
            Accept All
          </button>
          <button
            className="audit-btn audit-btn--danger"
            onClick={handleRejectAll}
            disabled={pendingCount === 0}
          >
            Reject All
          </button>
        </div>
      </div>

      {/* ---- Audit Cards ---- */}
      {pendingChanges.map((change) => {
        const animation = animatingCards[change.id];
        const cardClassName = [
          'audit-card',
          `audit-card--${change.riskLevel}`,
          animation === 'accept' ? 'audit-card--accepting' : '',
          animation === 'reject' ? 'audit-card--rejecting' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            key={change.id}
            ref={(el) => {
              cardRefs.current[change.id] = el;
            }}
            className={cardClassName}
            tabIndex={0}
            role="group"
            aria-label={`Audit: ${change.title}`}
            onKeyDown={(e) => handleKeyDown(e, change.id)}
          >
            {/* Header */}
            <div className="audit-card__header">
              <div className="audit-card__summary">
                <div className="audit-title">{change.title}</div>
                <div className="audit-caption">{change.source}</div>
              </div>
              <span
                className={`audit-card__risk-badge audit-card__risk-badge--${change.riskLevel}`}
              >
                {riskLabel[change.riskLevel]}
              </span>
            </div>

            {/* Description */}
            <p className="audit-body">{change.description}</p>

            {/* Diff View */}
            <div className="audit-card__diff" aria-label="Diff view">
              {change.diff.map((line, idx) => {
                const lineClass =
                  line.type === 'add'
                    ? 'diff-add'
                    : line.type === 'remove'
                      ? 'diff-remove'
                      : '';
                return (
                  <div key={idx} className={lineClass}>
                    {line.content}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="audit-card__actions">
              <button
                className="audit-btn audit-btn--primary"
                onClick={() => handleAccept(change.id)}
                disabled={!!animation}
                aria-label={`Accept ${change.title}`}
              >
                Accept
              </button>
              <button
                className="audit-btn audit-btn--danger"
                onClick={() => handleReject(change.id)}
                disabled={!!animation}
                aria-label={`Reject ${change.title}`}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuditCard;