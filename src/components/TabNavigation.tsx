import React from 'react';
import { TabNavigationProps } from '../types';

const TabNavigation: React.FC<TabNavigationProps> = ({ steps, activeStep, onStepChange }) => {
  return (
    <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <nav className="flex gap-2 px-4 py-3 sm:px-6 lg:px-8 overflow-x-auto" aria-label="학습 단계" role="tablist">
          {steps.map((step, index) => {
            const isActive = step.id === activeStep;
            return (
              <button
                key={step.id}
                id={`tab-${step.id}`}
                onClick={() => onStepChange(step.id)}
                className={`
                  tab-button group
                  ${isActive ? 'tab-button-active' : 'tab-button-inactive'}
                  whitespace-nowrap
                `}
                role="tab"
                aria-selected={isActive}
                aria-label={`${index + 1}단계 ${step.title}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    const nextIndex = (index + 1) % steps.length;
                    onStepChange(steps[nextIndex].id);
                    requestAnimationFrame(() => document.getElementById(`tab-${steps[nextIndex].id}`)?.focus());
                  } else if (e.key === 'ArrowLeft') {
                    const prevIndex = (index - 1 + steps.length) % steps.length;
                    onStepChange(steps[prevIndex].id);
                    requestAnimationFrame(() => document.getElementById(`tab-${steps[prevIndex].id}`)?.focus());
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold transition-colors duration-200 ${
                    isActive ? 'bg-territory-primary text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-territory-primary'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
