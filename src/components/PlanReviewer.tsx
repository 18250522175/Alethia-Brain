import React, { useState } from 'react';

type StepStatus = 'done' | 'pending' | 'warning';

interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  isReviewNode?: boolean;
  reviewSummary?: string;
}

interface PlanReviewerProps {
  steps: PlanStep[];
  onReviewApprove: (stepId: string) => void;
  onReviewReject: (stepId: string) => void;
}

const PlanReviewer: React.FC<PlanReviewerProps> = ({
  steps,
  onReviewApprove,
  onReviewReject,
}) => {
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(
    new Set()
  );

  const toggleReview = (stepId: string) => {
    setExpandedReviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <div className="plan-reviewer">
      {steps.map((step) => {
        const isExpanded = expandedReviewIds.has(step.id);

        const contentClassName = [
          'plan-step__content',
          step.isReviewNode ? 'plan-step__content--review' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={step.id} className="plan-step">
            <div
              className={`plan-step__node plan-step__node--${step.status}`}
            />
            <div className={contentClassName}>
              <h3 className="plan-step__title">{step.title}</h3>
              <p className="plan-step__description">{step.description}</p>
              {step.isReviewNode && (
                <>
                  <div
                    className="plan-step__review-icon"
                    onClick={() => toggleReview(step.id)}
                  >
                    人工审核
                  </div>
                  {isExpanded && (
                    <div className="plan-step__review-actions">
                      {step.reviewSummary && (
                        <p className="plan-step__review-summary">
                          {step.reviewSummary}
                        </p>
                      )}
                      <div className="plan-step__review-buttons">
                        <button
                          className="plan-step__review-btn plan-step__review-btn--approve"
                          onClick={() => onReviewApprove(step.id)}
                        >
                          通过
                        </button>
                        <button
                          className="plan-step__review-btn plan-step__review-btn--reject"
                          onClick={() => onReviewReject(step.id)}
                        >
                          驳回
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanReviewer;