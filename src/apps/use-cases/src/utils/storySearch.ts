import { SuccessStory } from '../types';

export type SearchMatchField = 'industry' | 'company' | 'title' | 'module' | 'region' | 'keyword';

export interface StorySearchResult {
  story: SuccessStory;
  score: number;
  matchField: SearchMatchField;
  matchSnippet?: string;
}

/**
 * Checks whether a success story matches a free-text query across
 * industry, company/profile details, title, modules, region, and keywords.
 */
export function evaluateStoryMatch(story: SuccessStory, rawQuery: string): StorySearchResult | null {
  const query = rawQuery.toLowerCase().trim();
  if (!query) {
    return {
      story,
      score: story.featured ? 10 : 1,
      matchField: 'title',
    };
  }

  const terms = query.split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return { story, score: 1, matchField: 'title' };
  }

  const titleLower = story.title.toLowerCase();
  const taglineLower = story.tagline.toLowerCase();
  const industryLower = story.industry.toLowerCase();
  const categoryKeyLower = story.categoryKey.toLowerCase();
  const businessProfileLower = story.businessProfile.toLowerCase();
  const overviewTypeLower = story.customerOverview.type.toLowerCase();
  const overviewModelLower = story.customerOverview.model.toLowerCase();
  const overviewBgLower = story.customerOverview.background.toLowerCase();
  const companyLower = (story.testimonial?.company || '').toLowerCase();
  const authorLower = (story.testimonial?.author || '').toLowerCase();
  const regionLower = story.region.toLowerCase();
  const branchLower = story.branchCount.toLowerCase();
  const modulesJoined = story.modules.join(' ').toLowerCase();
  const challengeText = [story.challenge, ...story.challengeFull].join(' ').toLowerCase();
  const solutionText = [
    story.solution,
    ...story.solutionFull.map((s) => `${s.module} ${s.role} ${s.details} ${s.valueDelivered}`),
  ]
    .join(' ')
    .toLowerCase();
  const outcomeText = [
    story.outcome,
    ...story.outcomeMetrics.map((m) => `${m.label} ${m.metric} ${m.context}`),
    ...story.whyNeeded,
    ...story.lessonsLearned,
  ]
    .join(' ')
    .toLowerCase();

  const fullSearchCorpus = [
    titleLower,
    taglineLower,
    industryLower,
    categoryKeyLower,
    businessProfileLower,
    overviewTypeLower,
    overviewModelLower,
    overviewBgLower,
    companyLower,
    authorLower,
    regionLower,
    branchLower,
    modulesJoined,
    challengeText,
    solutionText,
    outcomeText,
  ].join(' ');

  // All space-separated terms must exist somewhere in the story
  const allTermsMatch = terms.every((term) => fullSearchCorpus.includes(term));
  if (!allTermsMatch) {
    return null;
  }

  // Compute relevance score & primary match category
  let score = 0;
  let matchField: SearchMatchField = 'keyword';
  let matchSnippet: string | undefined;

  if (industryLower.includes(query) || categoryKeyLower.includes(query)) {
    score += 100;
    matchField = 'industry';
    matchSnippet = story.industry;
  }

  if (
    companyLower.includes(query) ||
    authorLower.includes(query) ||
    businessProfileLower.includes(query) ||
    overviewTypeLower.includes(query)
  ) {
    score += 95;
    if (matchField === 'keyword') {
      matchField = 'company';
      matchSnippet = story.testimonial?.company || story.businessProfile;
    }
  }

  if (titleLower.includes(query)) {
    score += 85;
    if (matchField === 'keyword') {
      matchField = 'title';
      matchSnippet = story.title;
    }
  }

  if (story.modules.some((m) => m.toLowerCase().includes(query))) {
    score += 75;
    if (matchField === 'keyword') {
      matchField = 'module';
      matchSnippet = story.modules.find((m) => m.toLowerCase().includes(query));
    }
  }

  if (regionLower.includes(query)) {
    score += 65;
    if (matchField === 'keyword') {
      matchField = 'region';
      matchSnippet = story.region;
    }
  }

  // Check multi-word partial boosts
  for (const term of terms) {
    if (industryLower.includes(term)) score += 20;
    if (companyLower.includes(term) || businessProfileLower.includes(term)) score += 18;
    if (titleLower.includes(term)) score += 15;
    if (modulesJoined.includes(term)) score += 12;
    if (taglineLower.includes(term) || challengeText.includes(term) || solutionText.includes(term)) {
      score += 8;
    }
  }

  if (story.featured) {
    score += 3;
  }

  return {
    story,
    score,
    matchField,
    matchSnippet,
  };
}

export function matchesStoryQuery(story: SuccessStory, query: string): boolean {
  return evaluateStoryMatch(story, query) !== null;
}

export function searchStories(stories: SuccessStory[], query: string): StorySearchResult[] {
  const published = stories.filter((s) => s.status === 'published');
  const results: StorySearchResult[] = [];

  for (const story of published) {
    const match = evaluateStoryMatch(story, query);
    if (match) {
      results.push(match);
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
