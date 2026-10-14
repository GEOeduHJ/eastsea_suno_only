import { KeywordData, StoredKeywordData, ValidationState } from '../types';

/**
 * KeywordController - 키워드 상태 관리 서비스
 * 
 * 키워드 입력, 저장, 검증, 템플릿 적용 등의 기능을 제공합니다.
 */
export class KeywordController {
  private static readonly STORAGE_KEY_PREFIX = 'east-sea-song-keywords-v1-module-';
  private static readonly EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24시간

  /**
   * 키워드를 localStorage에 저장
   */
  static storeKeywords(moduleId: string, keywords: KeywordData): void {
    try {
      const data: StoredKeywordData = {
        moduleId,
        keywords,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.EXPIRY_DURATION
      };
      
      const storageKey = `${this.STORAGE_KEY_PREFIX}${moduleId}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('키워드 저장 실패:', error);
      throw new Error('키워드 저장에 실패했습니다.');
    }
  }

  /**
   * localStorage에서 키워드를 가져옴
   */
  static getKeywords(moduleId: string): KeywordData | null {
    try {
      const storageKey = `${this.STORAGE_KEY_PREFIX}${moduleId}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;
      
      const data: StoredKeywordData = JSON.parse(stored);
      
      // 만료 확인
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.clearKeywords(moduleId);
        return null;
      }
      
      return data.keywords;
    } catch (error) {
      console.error('키워드 로딩 실패:', error);
      return null;
    }
  }

  

  /**
   * 특정 모듈의 키워드 삭제
   */
  static clearKeywords(moduleId: string): void {
    try {
      const storageKey = `${this.STORAGE_KEY_PREFIX}${moduleId}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('키워드 삭제 실패:', error);
    }
  }

  /**
   * 키워드 입력 검증
   */
  static validateKeywords(keywords: KeywordData): ValidationState {
    const state: ValidationState = {
      isValid: true
    };

    // 필수 필드 검증
    if (!keywords.keyword1?.trim()) {
      state.keyword1Error = '중심 테마를 선택해주세요';
      state.isValid = false;
    } else if (keywords.keyword1.length > 50) {
      state.keyword1Error = '50자 이내로 입력해주세요';
      state.isValid = false;
    }

    if (!keywords.keyword2?.trim()) {
      state.keyword2Error = '선택한 테마에서 확인한 핵심 사실을 입력해주세요';
      state.isValid = false;
    } else if (keywords.keyword2.length > 500) {
      state.keyword2Error = '500자 이내로 입력해주세요';
      state.isValid = false;
    }

    if (!keywords.keyword3?.trim()) {
      state.keyword3Error = '노래와 이미지에 활용할 단어·장면을 입력해주세요';
      state.isValid = false;
    } else if (keywords.keyword3.length > 300) {
      state.keyword3Error = '300자 이내로 입력해주세요';
      state.isValid = false;
    }

    if (!keywords.keyword4?.trim()) {
      state.keyword4Error = '작품으로 전달하고 싶은 메시지를 입력해주세요';
      state.isValid = false;
    } else if (keywords.keyword4.length > 300) {
      state.keyword4Error = '300자 이내로 입력해주세요';
      state.isValid = false;
    }

    return state;
  }

  

  /**
   * 콘텐츠 입력 정제 (공백 유지)
   */
  static sanitizeKeyword(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/<[^>]*>/g, '') // HTML 태그 제거
      .replace(/[<>&"']/g, match => { // 특수 문자 이스케이프
        const escapeMap: {[key: string]: string} = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escapeMap[match] || match;
      });
  }

  /**
   * 템플릿의 플레이스홀더를 키워드로 치환
   */
  static replaceTemplatePlaceholders(template: string, keywords: KeywordData): string {
    if (!template || !keywords) return template;

    let result = template;
    result = result.replace(/\[keyword1\]/g, keywords.keyword1 || '[키워드1]');
    result = result.replace(/\[keyword2\]/g, keywords.keyword2 || '[키워드2]');
    result = result.replace(/\[keyword3\]/g, keywords.keyword3 || '[키워드3]');
    result = result.replace(/\[keyword4\]/g, keywords.keyword4 || '[키워드4]');

    return result;
  }

  /**
   * 모든 키워드가 입력되었는지 확인
   */
  static hasAllKeywords(keywords: KeywordData | null): boolean {
    if (!keywords) return false;
    
    return !!(
      keywords.keyword1?.trim() &&
      keywords.keyword2?.trim() &&
      keywords.keyword3?.trim() &&
      keywords.keyword4?.trim()
    );
  }

  /**
   * 빈 키워드 객체 생성
   */
  static createEmptyKeywords(): KeywordData {
    return {
      keyword1: '',
      keyword2: '',
      keyword3: '',
      keyword4: ''
    };
  }
}
