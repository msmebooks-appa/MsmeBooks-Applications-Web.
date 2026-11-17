import React, { useState, useEffect, useMemo } from 'react';
import { mockArticles } from './data/mockArticles';
import { Article } from './types';
import { Header } from './components/Header';
import { BlogHero } from './components/BlogHero';
import { FeaturedArticle } from './components/FeaturedArticle';
import { CategoryNav } from './components/CategoryNav';
import { ArticleGrid } from './components/ArticleGrid';
import { NewsletterSection } from './components/NewsletterSection';
import { IndustryResources } from './components/IndustryResources';
import { BusinessGuides } from './components/BusinessGuides';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { BlogDetails } from './components/BlogDetails';
import { AIAssistant } from './components/AIAssistant';
import { LiveChat } from './components/LiveChat';
import { AdminCMSModal } from './components/AdminCMSModal';
import { Footer } from './components/Footer';
import { ScrollControls } from './components/ScrollControls';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [currentView, setCurrentView] = useState<'home' | 'article'>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string>('');
  const [liveChatOpen, setLiveChatOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);

  // Find the featured article
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.isFeatured) || articles[0];
  }, [articles]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    articles.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // Handle URL hash / path navigation for SEO-friendly URLs
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        const found = articles.find((a) => a.slug === slug);
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article');
          return;
        }
      }
      setCurrentView('home');
      setSelectedArticle(null);
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // Dynamic SEO head metadata updater
  useEffect(() => {
    if (currentView === 'article' && selectedArticle) {
      document.title = `${selectedArticle.title} | MsmeBooks Blog`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', selectedArticle.metaDescription);
      }
      
      // Update og:title & og:description
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', selectedArticle.title);
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', selectedArticle.excerpt);

      // Inject Article Schema.org JSON-LD
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: selectedArticle.title,
        description: selectedArticle.excerpt,
        image: selectedArticle.featuredImage,
        author: {
          '@type': 'Person',
          name: selectedArticle.author.name,
          jobTitle: selectedArticle.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'MsmeBooks',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.msmebooks.org/logo.png',
          },
        },
        datePublished: selectedArticle.publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://www.msmebooks.org/blog/${selectedArticle.slug}`,
        },
      };

      let scriptTag = document.getElementById('dynamic-article-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-article-schema';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(articleSchema);
    } else {
      document.title = 'MsmeBooks – SaaS Blog & Business Knowledge Center';
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Practical accounting, POS, inventory, finance and business management insights for African and global SMEs to operate smarter and scale sustainably.'
        );
      }
      const scriptTag = document.getElementById('dynamic-article-schema');
      if (scriptTag) scriptTag.remove();
    }
  }, [currentView, selectedArticle]);

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.location.hash = `#/blog/${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (currentView !== 'home') {
      setCurrentView('home');
      setSelectedArticle(null);
      window.location.hash = '';
    }
    const el = document.getElementById('articles-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAddArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#061221] text-slate-900 dark:text-slate-100 font-sans selection:bg-lime-400 selection:text-slate-950 transition-colors duration-200">
      {/* 1. Header Navigation */}
      <Header
        currentView={currentView}
        onNavigateHome={handleNavigateHome}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectCategory={handleSelectCategory}
        onScrollToSection={handleScrollToSection}
        onOpenLiveChat={() => setLiveChatOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === 'article' && selectedArticle ? (
          /* 2. Blog Details View */
          <BlogDetails
            article={selectedArticle}
            allArticles={articles}
            onBackToBlog={handleNavigateHome}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onOpenAssistantWithPrompt={(prompt) => setAssistantPrompt(prompt)}
          />
        ) : (
          /* 3. Blog Home Hub View */
          <>
            {/* Hero Section with Search */}
            <BlogHero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={(q) => {
                setSearchQuery(q);
                handleScrollToSection('articles-section');
              }}
              onSelectCategory={handleSelectCategory}
            />

            {/* Featured Article Section */}
            {!searchQuery && selectedCategory === 'All' && (
              <FeaturedArticle
                article={featuredArticle}
                onSelectArticle={handleSelectArticle}
              />
            )}

            {/* Horizontal Category Navigation */}
            <CategoryNav
              activeCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              articleCounts={categoryCounts}
            />

            {/* Main Articles Grid with Filters & Pagination */}
            <ArticleGrid
              articles={articles}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
              onClearFilters={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />

            {/* Newsletter Subscription Section */}
            <NewsletterSection />

            {/* Industry Resource Cards Section */}
            <IndustryResources
              onSelectIndustryFilter={(industry) => {
                setSearchQuery(industry);
                handleScrollToSection('articles-section');
              }}
            />

            {/* Business Guides Section */}
            <BusinessGuides
              onSelectCategoryFilter={handleSelectCategory}
            />

            {/* Customer Case Studies Section */}
            <CaseStudiesSection />
          </>
        )}
      </div>

      {/* Floating Left-Side Scroll Up / Down Controls */}
      <ScrollControls />

      {/* Floating MsmeBooks AI Knowledge Bot */}
      <AIAssistant
        currentArticle={selectedArticle}
        externalPrompt={assistantPrompt}
        onClearExternalPrompt={() => setAssistantPrompt('')}
        isOpen={aiAssistantOpen}
        onToggle={(open) => {
          setAiAssistantOpen(open);
          if (open) setLiveChatOpen(false);
        }}
      />

      {/* Floating Live Chat Icon & Support Help Dialog */}
      <LiveChat
        isOpen={liveChatOpen}
        onToggle={(open) => {
          setLiveChatOpen(open);
          if (open) setAiAssistantOpen(false);
        }}
        onOpenAIAssistant={() => {
          setLiveChatOpen(false);
          setAiAssistantOpen(true);
        }}
      />

      {/* Admin CMS & Analytics Portal Modal */}
      <AdminCMSModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        articles={articles}
        onAddArticle={handleAddArticle}
        onDeleteArticle={handleDeleteArticle}
      />

      {/* Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenLiveChat={() => setLiveChatOpen(true)}
      />
    </div>
  );
}
