import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkPlus, 
  BookmarkCheck, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw,
  Sliders, 
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import { FilterState } from '../types';
import { SavedFilterPreset, useSavedFilters, generateSmartPresetName } from '../utils/savedFilterPresets';

interface SavedFilterShortcutsProps {
  currentFilters: FilterState;
  onApplyPreset: (presetFilters: FilterState) => void;
  activeFiltersCount: number;
}

export const SavedFilterShortcuts: React.FC<SavedFilterShortcutsProps> = ({
  currentFilters,
  onApplyPreset,
  activeFiltersCount,
}) => {
  const { savedPresets, saveCurrent, removePreset, resetToDefaults } = useSavedFilters();
  const [isSaving, setIsSaving] = useState(false);
  const [customName, setCustomName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleStartSave = () => {
    const suggested = generateSmartPresetName(currentFilters);
    setCustomName(suggested);
    setIsSaving(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    saveCurrent(customName, currentFilters);
    setIsSaving(false);
    setCustomName('');
    showToast(`Shortcut "${customName}" saved!`);
  };

  // Compare if current filters closely match a preset
  const isPresetActive = (preset: SavedFilterPreset) => {
    const pf = preset.filters;
    const cf = currentFilters;
    return (
      (pf.country || '') === (cf.country || '') &&
      (pf.city || '') === (cf.city || '') &&
      (pf.partnerType || '') === (cf.partnerType || '') &&
      (pf.industry || '') === (cf.industry || '') &&
      (pf.service || '') === (cf.service || '') &&
      (pf.level || '') === (cf.level || '') &&
      (pf.remoteOnly || false) === (cf.remoteOnly || false) &&
      (pf.verifiedOnly || false) === (cf.verifiedOnly || false) &&
      (pf.availability || '') === (cf.availability || '') &&
      (pf.successStoryScale || '') === (cf.successStoryScale || '')
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 mb-6 shadow-sm transition-all duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-3 px-3 py-2 bg-lime-500/15 border border-lime-500/40 text-lime-700 dark:text-lime-300 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400">
            <Bookmark className="w-4 h-4 fill-lime-500/30" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Saved Search Filter Shortcuts
              </h3>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {savedPresets.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              One-click shortcuts stored locally in your browser for fast future repeat visits.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Save Current Filter Criteria CTA */}
          {!isSaving ? (
            <button
              onClick={handleStartSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm shadow-lime-500/20 transition-all transform active:scale-95 cursor-pointer"
              title="Save current search and filters to browser storage"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span>Save Current Criteria</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-slate-950 text-lime-400 rounded-full text-[10px] font-mono">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          ) : (
            <form onSubmit={handleConfirmSave} className="flex items-center gap-1.5 animate-fadeIn">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name your filter shortcut..."
                autoFocus
                className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-lime-500 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none ring-1 ring-lime-500 w-44 sm:w-56"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                title="Save shortcut"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg text-xs"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Toggle Accordion / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Collapse shortcuts' : 'Expand shortcuts'}
            aria-label="Toggle shortcut bar"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preset Pills List */}
      {isExpanded && (
        <div className="pt-3">
          {savedPresets.length === 0 ? (
            <div className="text-center py-3 text-xs text-slate-500 dark:text-slate-400">
              No saved filter shortcuts yet. Configure any filter in the directory and click <strong className="text-slate-700 dark:text-slate-300">"Save Current Criteria"</strong>!
              <div className="mt-2">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center gap-1 text-[11px] text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Load recommended sample shortcuts
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3 text-slate-400" />
                Shortcuts:
              </span>

              {savedPresets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <div
                    key={preset.id}
                    className={`group relative inline-flex items-center rounded-xl border text-xs transition-all duration-200 ${
                      active
                        ? 'bg-lime-500/15 border-lime-500 text-lime-800 dark:text-lime-300 font-bold shadow-sm shadow-lime-500/10 ring-1 ring-lime-500/40'
                        : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    {/* Click shortcut to apply */}
                    <button
                      type="button"
                      onClick={() => {
                        onApplyPreset(preset.filters);
                        showToast(`Applied shortcut "${preset.name}"`);
                      }}
                      className="flex items-center gap-1.5 py-1.5 pl-3 pr-2 cursor-pointer focus:outline-none"
                      title={`Apply filter shortcut: ${preset.name}`}
                    >
                      {active ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 text-slate-400 group-hover:text-lime-500 shrink-0" />
                      )}
                      <span className="truncate max-w-[200px] sm:max-w-[280px]">
                        {preset.name}
                      </span>
                    </button>

                    {/* Delete shortcut button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreset(preset.id);
                        showToast(`Removed shortcut "${preset.name}"`);
                      }}
                      className="p-1 mr-1 text-slate-400 hover:text-red-500 rounded-md transition-colors opacity-70 group-hover:opacity-100"
                      title="Delete this shortcut"
                      aria-label={`Delete ${preset.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Reset to Default shortcuts button */}
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-[11px] text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 underline ml-auto transition-colors flex items-center gap-1"
                title="Restore default sample shortcuts"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset Defaults
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
