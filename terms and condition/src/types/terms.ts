export interface DefinitionItem {
  term: string;
  definition: string;
}

export interface SectionItem {
  id: string;
  number: number;
  title: string;
  category: string;
  summary: string;
  content: string[];
  subsections?: {
    subtitle: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  definitions?: DefinitionItem[];
  placeholders?: string[];
}

export interface LegalCategory {
  id: string;
  title: string;
  sectionIds: number[];
}

export interface DocumentVersion {
  version: string;
  effectiveDate: string;
  releaseDate: string;
  summary: string;
  changes: string[];
  isCurrent?: boolean;
}

export interface LegalChecklistItem {
  id: string;
  sectionNumber: number;
  topic: string;
  status: 'pending_counsel' | 'ready' | 'verified';
  description: string;
  placeholderText: string;
  notes: string;
}

export interface RelatedLegalDoc {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  status: 'Published' | 'Pending Final Approval' | 'Available on Request';
  url: string;
  previewSummary: string;
}
