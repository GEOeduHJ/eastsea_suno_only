import React, { useEffect, useState } from 'react';
import { KeywordData, KeywordInputFormProps, ValidationState } from '../types';
import { KeywordController } from '../services/keywordController';

const EAST_SEA_THEMES = [
  '이름에 담긴 기억',
  '지도와 국제적 사용',
  '공유 바다와 표기 원칙',
  '이름의 공존과 미래'
];

export const KeywordInputForm: React.FC<KeywordInputFormProps> = ({
  onSubmit,
  initialKeywords,
  isLoading = false
}) => {
  const [keywords, setKeywords] = useState<KeywordData>(
    initialKeywords || KeywordController.createEmptyKeywords()
  );
  const [validation, setValidation] = useState<ValidationState>({ isValid: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialKeywords) setKeywords(initialKeywords);
  }, [initialKeywords]);

  const handleInputChange = (field: keyof KeywordData, value: string) => {
    setKeywords((current) => ({ ...current, [field]: value }));
    if (validation[`${field}Error` as keyof ValidationState]) {
      setValidation((current) => ({
        ...current,
        [`${field}Error`]: undefined,
        generalError: undefined
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);
    try {
      const sanitizedKeywords: KeywordData = {
        keyword1: KeywordController.sanitizeKeyword(keywords.keyword1).trim(),
        keyword2: KeywordController.sanitizeKeyword(keywords.keyword2).trim(),
        keyword3: KeywordController.sanitizeKeyword(keywords.keyword3).trim(),
        keyword4: KeywordController.sanitizeKeyword(keywords.keyword4).trim()
      };
      const result = KeywordController.validateKeywords(sanitizedKeywords);
      setValidation(result);
      if (!result.isValid) return;
      await onSubmit(sanitizedKeywords);
    } catch (error) {
      console.error('학습 내용 저장 실패:', error);
      setValidation((current) => ({
        ...current,
        generalError: '학습 내용 저장에 실패했습니다. 다시 시도해주세요.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isSubmitting || isLoading;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          🎤 동해 노래의 중심 주제를 정리해보세요
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          한 가지 테마를 선택하고 학습에서 확인한 사실, 작품에 사용할 이미지와 메시지를 작성하세요.
          입력한 내용은 가사와 앨범 커버 프롬프트에 함께 반영됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="keyword1" className="block text-sm font-semibold text-gray-700 mb-2">
            1. 중심 테마 선택 <span className="text-red-500">*</span>
          </label>
          <select
            id="keyword1"
            value={keywords.keyword1}
            onChange={(event) => handleInputChange('keyword1', event.target.value)}
            disabled={isFormDisabled}
            className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.keyword1Error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">테마를 선택하세요</option>
            {EAST_SEA_THEMES.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
          {validation.keyword1Error && (
            <p className="mt-1 text-sm text-red-600" role="alert">{validation.keyword1Error}</p>
          )}
        </div>

        <div>
          <label htmlFor="keyword2" className="block text-sm font-semibold text-gray-700 mb-2">
            2. 테마에서 확인한 핵심 사실 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">선택한 테마에서 중요한 사실을 2~3개 정리하세요.</p>
          <textarea
            id="keyword2"
            value={keywords.keyword2}
            onChange={(event) => handleInputChange('keyword2', event.target.value)}
            disabled={isFormDisabled}
            placeholder="예: 같은 바다에도 역사적 경험과 사용하는 언어에 따라 서로 다른 이름과 기억이 담길 수 있다."
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3 border rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.keyword2Error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validation.keyword2Error && (
            <p className="mt-1 text-sm text-red-600" role="alert">{validation.keyword2Error}</p>
          )}
        </div>

        <div>
          <label htmlFor="keyword3" className="block text-sm font-semibold text-gray-700 mb-2">
            3. 노래와 이미지에 활용할 단어·장면 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">색, 모양, 움직임, 소리와 분위기를 구체적으로 적으세요.</p>
          <textarea
            id="keyword3"
            value={keywords.keyword3}
            onChange={(event) => handleInputChange('keyword3', event.target.value)}
            disabled={isFormDisabled}
            placeholder="예: 푸른 파도, 오래된 지도 위의 여러 이름, 서로 마주 보는 해안, 이어지는 항로"
            rows={4}
            maxLength={300}
            className={`w-full px-4 py-3 border rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.keyword3Error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validation.keyword3Error && (
            <p className="mt-1 text-sm text-red-600" role="alert">{validation.keyword3Error}</p>
          )}
        </div>

        <div>
          <label htmlFor="keyword4" className="block text-sm font-semibold text-gray-700 mb-2">
            4. 작품으로 전달하고 싶은 메시지 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="keyword4"
            value={keywords.keyword4}
            onChange={(event) => handleInputChange('keyword4', event.target.value)}
            disabled={isFormDisabled}
            placeholder="예: 서로 다른 이름과 기억이 있다는 사실을 이해하고, 근거를 바탕으로 대화하자."
            rows={3}
            maxLength={300}
            className={`w-full px-4 py-3 border rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation.keyword4Error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {validation.keyword4Error && (
            <p className="mt-1 text-sm text-red-600" role="alert">{validation.keyword4Error}</p>
          )}
        </div>

        {validation.generalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-sm text-red-600">{validation.generalError}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isFormDisabled}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              isFormDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
            }`}
          >
            {isSubmitting ? '⏳ 적용 중...' : '✨ 가사·이미지 프롬프트에 적용하기'}
          </button>
          <button
            type="button"
            onClick={() => {
              setKeywords(KeywordController.createEmptyKeywords());
              setValidation({ isValid: true });
            }}
            disabled={isFormDisabled}
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  );
};
