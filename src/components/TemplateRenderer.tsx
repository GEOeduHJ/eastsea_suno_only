import React, { useState } from 'react';
import { ModuleStep, KeywordData } from '../types';
import { KeywordController } from '../services/keywordController';

/**
 * TemplateRenderer - 통합 템플릿 렌더러 컴포넌트
 *
 * 모드:
 * - 'dynamic': 키워드 기반 동적 템플릿 (Module 1)
 * - 'fixed': 고정 템플릿 (Module 3)
 */
interface TemplateRendererProps {
  step: ModuleStep;
  onExternalLinkClick: (url: string) => void;
  mode: 'dynamic' | 'fixed';
  keywords?: KeywordData;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ step, onExternalLinkClick, mode, keywords }) => {
  const [copySuccess, setCopySuccess] = useState<string>('');

  const getTemplateContent = (): string => {
    if (mode === 'fixed') return step.fixedTemplateContent || step.content || '';
    if (step.templateContent) {
      return keywords
        ? KeywordController.replaceTemplatePlaceholders(step.templateContent, keywords)
        : step.templateContent;
    }
    return step.content || '';
  };

  const templateContent = getTemplateContent();

  const hasAllKeywords = mode === 'dynamic'
    ? KeywordController.hasAllKeywords(keywords ?? null)
    : true;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateContent);
      setCopySuccess('복사되었습니다!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('복사에 실패했습니다.');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {mode === 'dynamic' && !hasAllKeywords && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">키워드를 입력해주세요</h3>
              <p className="mt-1 text-sm text-yellow-700">2단계에서 학습 내용을 먼저 정리하면 개인화된 프롬프트를 확인할 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h2>
          <p className="text-gray-600">{step.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{mode === 'dynamic' ? '생성된 프롬프트' : '🎯 프롬프트 템플릿'}</h3>
            <button onClick={copyToClipboard} className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors focus:ring-4 focus:ring-green-200">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              프롬프트 복사
            </button>
          </div>
          {copySuccess && <div className="mb-3 p-2 bg-green-100 border border-green-200 rounded text-green-800 text-sm">{copySuccess}</div>}

          {mode === 'fixed' && (
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{step.content}</p>
              </div>
            </div>
          )}

          <div className={mode === 'fixed' ? 'bg-blue-50 border border-blue-200 p-4 rounded-lg' : 'bg-gray-50 border-l-4 border-blue-500 p-4 rounded-r-lg'}>
            <div className="prose prose-sm max-w-none">
              <p className={`leading-relaxed whitespace-pre-wrap ${mode === 'fixed' ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>{templateContent}</p>
            </div>
          </div>
        </div>

        {mode === 'dynamic' && hasAllKeywords && keywords && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-3">🎯 적용된 키워드</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start"><span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2 shrink-0">📚 중심 테마</span><span className="text-sm text-blue-800">{keywords.keyword1}</span></div>
              <div className="flex items-start"><span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2 shrink-0">🔎 핵심 사실</span><span className="text-sm text-blue-800">{keywords.keyword2}</span></div>
              <div className="flex items-start"><span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2 shrink-0">🎨 단어·장면</span><span className="text-sm text-blue-800">{keywords.keyword3}</span></div>
              <div className="flex items-start"><span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2 shrink-0">💬 메시지</span><span className="text-sm text-blue-800">{keywords.keyword4}</span></div>
            </div>
          </div>
        )}

        {(step.externalLinks || step.externalLink) && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-800 mb-4">{mode === 'fixed' ? '🔗 다음 단계 진행하기' : '다음 단계 진행하기'}</h4>
            {step.externalLinks && step.externalLinks.length > 0 && (
              <div className="space-y-3">
                {step.externalLinks.map((link, index) => (
                  <button key={index} onClick={() => onExternalLinkClick(link.url)} className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg transition-colors focus:ring-4 ${index === 0 ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200' : link.url.includes('placeholder') ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-200 border border-gray-300'}`} disabled={link.url.includes('placeholder')}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    {link.label}
                    {link.openInNewTab && !link.url.includes('placeholder') && (<svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>) }
                  </button>
                ))}
              </div>
            )}
            {step.externalLink && !step.externalLinks && (
              <button onClick={() => onExternalLinkClick(step.externalLink!.url)} className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                {step.externalLink.label}
                {step.externalLink.openInNewTab && (<svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>) }
              </button>
            )}
          </div>
        )}
      </div>

      {mode === 'dynamic' ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">🔧 키워드 수정이 필요하신가요?</h4>
              <p className="text-xs text-gray-600 mt-1">2단계로 돌아가서 학습 내용을 수정할 수 있습니다.</p>
            </div>
            <button onClick={() => { const event = new CustomEvent('navigateToKeywordInput'); window.dispatchEvent(event); }} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors focus:ring-2 focus:ring-gray-200">✏️ 학습 내용 수정하기</button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">💡 사용 팁</h4>
              <p className="mt-1 text-sm text-yellow-700">프롬프트를 복사한 후 외부 사이트에 붙여넣기하여 사용하세요. 동해 표기 테마와 관련된 이미지를 함께 업로드하면 더 좋은 결과를 얻을 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
