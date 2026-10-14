export interface KeywordData {
  keyword1: string;
  keyword2: string;
  keyword3: string;
  keyword4: string;
}

export interface StoredKeywordData {
  moduleId: string;
  keywords: KeywordData;
  timestamp: number;
  expiresAt?: number;
}

export interface ValidationState {
  keyword1Error?: string;
  keyword2Error?: string;
  keyword3Error?: string;
  keyword4Error?: string;
  generalError?: string;
  isValid: boolean;
}

export interface KeywordInputFormProps {
  onSubmit: (keywords: KeywordData) => void | Promise<void>;
  initialKeywords?: KeywordData | null;
  isLoading?: boolean;
}

export interface ModuleStep {
  id: string;
  title: string;
  description: string;
  content: string;
  detailContainers?: Array<{
    id: string;
    title: string;
    description?: string;
    content: string;
  }>;
  editableContent?: boolean;
  isKeywordInput?: boolean;
  useKeywordTemplate?: boolean;
  templateContent?: string;
  fixedTemplateContent?: string;
  showEmbeddedPadlet?: boolean;
  padletUrl?: string;
  showEastSeaSongThemeLearning?: boolean;
  externalLinks?: Array<{
    url: string;
    label: string;
    openInNewTab: boolean;
  }>;
  externalLink?: {
    url: string;
    label: string;
    openInNewTab: boolean;
  };
}

export interface ModuleData {
  id: string;
  topic: string;
  title: string;
  description: string;
  steps: ModuleStep[];
}

export interface ModuleKeywordConfig {
  moduleId: string;
  hasKeywordFeature: boolean;
  keywordInputStepId: string;
  templateSteps: string[];
  template: {
    template: string;
    placeholders: string[];
  };
}

export interface TabNavigationProps {
  steps: ModuleStep[];
  activeStep: string;
  onStepChange: (stepId: string) => void;
}
