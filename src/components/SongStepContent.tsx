import React from 'react';
import { KeywordData, ModuleStep } from '../types';
import EastSeaSongThemeLearning from './EastSeaSongThemeLearning';
import { KeywordInputForm } from './KeywordInputForm';
import { TemplateRenderer } from './TemplateRenderer';

interface SongStepContentProps {
  step: ModuleStep;
  keywords: KeywordData | null;
  onKeywordSubmit: (keywords: KeywordData) => void | Promise<void>;
  onExternalLinkClick: (url: string) => void;
}

const StepHeading: React.FC<{ step: ModuleStep }> = ({ step }) => (
  <header className="mb-6">
    <h2 className="text-2xl font-bold text-slate-900">{step.title}</h2>
    <p className="mt-2 text-lg leading-7 text-slate-600">{step.description}</p>
  </header>
);

const SongStepContent: React.FC<SongStepContentProps> = ({
  step,
  keywords,
  onKeywordSubmit,
  onExternalLinkClick,
}) => {
  if (step.showEastSeaSongThemeLearning && step.detailContainers) {
    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
        <div className="mx-auto max-w-6xl">
          <StepHeading step={step} />
          <EastSeaSongThemeLearning intro={step.content} themes={step.detailContainers} />
        </div>
      </main>
    );
  }

  if (step.isKeywordInput) {
    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
        <div className="mx-auto max-w-5xl">
          <KeywordInputForm onSubmit={onKeywordSubmit} initialKeywords={keywords} />
        </div>
      </main>
    );
  }

  if (step.useKeywordTemplate) {
    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
        <TemplateRenderer
          step={step}
          keywords={keywords ?? undefined}
          onExternalLinkClick={onExternalLinkClick}
          mode="dynamic"
        />
      </main>
    );
  }

  if (step.externalLinks?.length) {
    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
        <div className="mx-auto max-w-4xl">
          <StepHeading step={step} />
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-slate-700">
              <h3 className="font-semibold text-sky-950">노래 만들기 순서</h3>
              <p className="mt-2 leading-7">3단계에서 다듬은 가사를 복사해 Suno에 붙여 넣으세요. 노래에 어울리는 장르와 분위기를 정해 생성한 뒤, 학습한 내용과 전달하고 싶은 메시지가 잘 담겼는지 들어보세요.</p>
            </div>
            <div className="grid gap-3">
              {step.externalLinks.map((link) => (
                <button
                  key={link.url}
                  type="button"
                  onClick={() => onExternalLinkClick(link.url)}
                  className="external-link-button w-full justify-center py-3"
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (step.showEmbeddedPadlet && step.padletUrl) {
    return (
      <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
        <div className="mx-auto max-w-6xl">
          <StepHeading step={step} />
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <h3 className="font-semibold text-slate-900">🎧 동해 노래와 앨범 커버 감상하기</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">작품을 올리고 다른 학습자의 노래와 앨범 커버를 감상해 보세요.</p>
            </div>
            <iframe
              src={step.padletUrl}
              title="동해 노래와 앨범 커버 공유 게시판"
              className="h-[620px] w-full border-0"
              loading="lazy"
            />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 px-4 py-6 sm:px-6 lg:px-8" role="tabpanel" id={`tabpanel-${step.id}`} aria-labelledby={`tab-${step.id}`}>
      <div className="mx-auto max-w-4xl">
        <StepHeading step={step} />
        <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-6 leading-7 text-slate-700">{step.content}</p>
      </div>
    </main>
  );
};

export default SongStepContent;
