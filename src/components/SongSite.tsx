import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MODULE_3_DATA } from '../data/modules/songModule';
import { KeywordData } from '../types';
import { KeywordController } from '../services/keywordController';
import TabNavigation from './TabNavigation';
import SongStepContent from './SongStepContent';

const STORAGE_ID = 'eastsea-song-only';

const getStepFromHash = (stepIds: string[], hash = window.location.hash): string => {
  const stepId = hash.replace(/^#/, '');
  return stepIds.includes(stepId) ? stepId : stepIds[0];
};

const SongSite: React.FC = () => {
  const steps = MODULE_3_DATA.steps;
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps]);
  const [activeStepId, setActiveStepId] = useState(() => getStepFromHash(stepIds));
  const [keywords, setKeywords] = useState<KeywordData | null>(() => KeywordController.getKeywords(STORAGE_ID));
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];
  const activeStepIndex = steps.findIndex((step) => step.id === activeStep.id);

  const navigateToStep = useCallback((stepId: string) => {
    if (!stepIds.includes(stepId)) return;
    setActiveStepId(stepId);
    if (window.location.hash !== `#${stepId}`) window.location.hash = stepId;
  }, [stepIds]);

  useEffect(() => {
    const syncStepFromHash = () => setActiveStepId(getStepFromHash(stepIds));
    window.addEventListener('hashchange', syncStepFromHash);
    return () => window.removeEventListener('hashchange', syncStepFromHash);
  }, [stepIds]);

  useEffect(() => {
    const goToKeywordStep = () => navigateToStep('step-2');
    window.addEventListener('navigateToKeywordInput', goToKeywordStep);
    return () => window.removeEventListener('navigateToKeywordInput', goToKeywordStep);
  }, [navigateToStep]);

  const handleKeywordSubmit = async (submittedKeywords: KeywordData) => {
    KeywordController.storeKeywords(STORAGE_ID, submittedKeywords);
    setKeywords(submittedKeywords);
    window.setTimeout(() => navigateToStep('step-3'), 350);
  };

  const openExternalLink = (url: string) => {
    try {
      const target = new URL(url);
      if (!['https:', 'http:'].includes(target.protocol)) return;
      const anchor = document.createElement('a');
      anchor.href = target.toString();
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch {
      window.alert('링크 주소를 확인할 수 없습니다.');
    }
  };

  return (
    <div className="module-shell flex min-h-screen flex-col">
      <header className="module-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-sky-700">EAST SEA SONG STUDIO</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{MODULE_3_DATA.title}</h1>
            <p className="mt-1 hidden max-w-3xl text-sm leading-6 text-slate-600 sm:block">{MODULE_3_DATA.description}</p>
          </div>
          <div className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
            {activeStepIndex + 1} / {steps.length}
          </div>
        </div>
      </header>

      <TabNavigation steps={steps} activeStep={activeStep.id} onStepChange={navigateToStep} />

      <div key={activeStep.id} className="step-transition flex-1">
        <SongStepContent
          step={activeStep}
          keywords={keywords}
          onKeywordSubmit={handleKeywordSubmit}
          onExternalLinkClick={openExternalLink}
        />
      </div>

      <div className="fixed bottom-4 right-4 z-20 rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-[0_12px_30px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl" aria-live="polite">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">진행률</span>
          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-territory-primary to-cyan-400 transition-all duration-500" style={{ width: `${((activeStepIndex + 1) / steps.length) * 100}%` }} />
          </div>
          <span className="font-medium text-territory-primary">{activeStepIndex + 1}/{steps.length}</span>
        </div>
      </div>

      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 px-4 py-5 pb-24 text-center sm:px-6 sm:pb-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-xs leading-6 text-slate-500 sm:text-sm">
          © {new Date().getFullYear()} 섬 지역의 미래 탐구: 서울대학교 지리교육과
        </p>
      </footer>
    </div>
  );
};

export default SongSite;
