import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Lightbulb, 
  ShieldAlert, 
  Calculator, 
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from '../data/knowledgeBase';

export const KnowledgeBaseView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(KNOWLEDGE_ARTICLES[0].id);

  const categories = [
    'all',
    'মৌলিক ধারণা',
    'সূত্র ও হিসাব',
    'তার ও কেবল',
    'ব্রেকার ও সুরক্ষা',
    'ওয়্যারিং নিয়মাবলি',
    'আর্থিং ও নিরাপত্তা'
  ];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span>ইলেকট্রিক্যাল তথ্যভান্ডার ও প্রকৌশল গাইড (Knowledge Base)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          ইলেকট্রিশিয়ান ও টেকনিশিয়ানদের জন্য বাংলায় দরকারি সূত্র, ওয়্যারিং স্ট্যান্ডার্ড ও নিরাপত্তা বিধিমালা
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="বিষয় বা সূত্র অনুসন্ধান করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat === 'all' ? 'সকল বিষয়' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List Accordion */}
      <div className="space-y-3">
        {filteredArticles.map((art) => {
          const isExpanded = expandedArticleId === art.id;

          return (
            <div
              key={art.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => toggleExpand(art.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {art.category}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {art.summary}
                  </p>
                </div>

                <div className="p-1.5 rounded-lg text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in text-xs leading-relaxed">
                  
                  {/* Detailed explanation */}
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {art.details.trim()}
                  </div>

                  {/* Formula Box */}
                  {art.formula && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5">
                      <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-950 dark:text-amber-200 block mb-0.5">
                          ব্যবহারিক সূত্র:
                        </span>
                        <code className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                          {art.formula}
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Example Box */}
                  {art.example && (
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-950 dark:text-blue-200 block mb-0.5">
                          বাস্তব কাজের উদাহরণ:
                        </span>
                        <span className="text-blue-800 dark:text-blue-300">
                          {art.example}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Safety Tip */}
                  {art.safetyTip && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-red-950 dark:text-red-200 block mb-0.5">
                          নিরাপত্তা সতর্কতা:
                        </span>
                        <span className="text-red-800 dark:text-red-300 font-semibold">
                          {art.safetyTip}
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}

        {filteredArticles.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            কোনো তথ্যভান্ডার আর্টিকেল পাওয়া যায়নি।
          </div>
        )}
      </div>

    </div>
  );
};
