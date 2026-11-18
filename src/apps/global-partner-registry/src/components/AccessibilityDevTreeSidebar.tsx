import React, { useState, useEffect, useRef } from 'react';
import { 
  Bug, 
  X, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  LayoutGrid, 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Eye, 
  Terminal,
  Code
} from 'lucide-react';
import { Partner } from '../types';
import { PARTNERS_DATA } from '../data/partnersData';

export interface AnnouncementLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'assertive' | 'polite';
}

interface AccessibilityDevTreeSidebarProps {
  onFocusMarker: (partnerId: string) => void;
  onSelectPartner: (partner: Partner) => void;
  announcementLogs: AnnouncementLogEntry[];
  onClearLogs: () => void;
  currentFocusedMarkerId?: string | null;
  filteredPartners?: Partner[];
}

export const AccessibilityDevTreeSidebar: React.FC<AccessibilityDevTreeSidebarProps> = ({
  onFocusMarker,
  onSelectPartner,
  announcementLogs,
  onClearLogs,
  currentFocusedMarkerId,
  filteredPartners = PARTNERS_DATA,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-map': true,
    'root-directory': true,
    'cat-nigeria': true,
    'cat-kenya': true,
    'cat-south-africa': true,
  });
  const [activeTab, setActiveTab] = useState<'tree' | 'sequence-tester' | 'aria-logs'>('tree');
  const [isAutoTesting, setIsAutoTesting] = useState<boolean>(false);
  const [autoTestIndex, setAutoTestIndex] = useState<number>(0);
  const [copiedLog, setCopiedLog] = useState<boolean>(false);
  const autoTestTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Group partners by country for the accessible tree hierarchy
  const partnersByCountry = React.useMemo(() => {
    const map: Record<string, Partner[]> = {};
    filteredPartners.forEach(p => {
      if (!map[p.country]) {
        map[p.country] = [];
      }
      map[p.country].push(p);
    });
    return map;
  }, [filteredPartners]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  // Keyboard shortcut Alt+T or Ctrl+Shift+D to toggle dev inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 't') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Automated sequence tester runner
  useEffect(() => {
    if (!isAutoTesting) {
      if (autoTestTimerRef.current) {
        clearInterval(autoTestTimerRef.current);
        autoTestTimerRef.current = null;
      }
      return;
    }

    autoTestTimerRef.current = setInterval(() => {
      setAutoTestIndex(prevIdx => {
        const nextIdx = (prevIdx + 1) % filteredPartners.length;
        const targetPartner = filteredPartners[nextIdx];
        if (targetPartner) {
          onFocusMarker(targetPartner.id);
        }
        return nextIdx;
      });
    }, 1200);

    return () => {
      if (autoTestTimerRef.current) {
        clearInterval(autoTestTimerRef.current);
      }
    };
  }, [isAutoTesting, filteredPartners, onFocusMarker]);

  const handleCopyLogs = () => {
    const text = announcementLogs.map(l => `[${l.timestamp}] (${l.type}): ${l.message}`).join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLog(true);
      setTimeout(() => setCopiedLog(false), 2000);
    }
  };

  const handleStepArrow = (direction: 'next' | 'prev') => {
    const currentIdx = filteredPartners.findIndex(p => p.id === currentFocusedMarkerId);
    let targetIdx = 0;
    if (direction === 'next') {
      targetIdx = currentIdx < filteredPartners.length - 1 ? currentIdx + 1 : 0;
    } else {
      targetIdx = currentIdx > 0 ? currentIdx - 1 : filteredPartners.length - 1;
    }
    const partner = filteredPartners[targetIdx];
    if (partner) {
      onFocusMarker(partner.id);
    }
  };

  return (
    <>
      {/* Floating Dev Inspector Trigger Badge */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          id="btn-toggle-dev-tree-sidebar"
          data-testid="btn-toggle-dev-tree-sidebar"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs font-bold transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-lime-400"
          title="Toggle Accessible Navigation Tree Inspector (Alt+T)"
          aria-label="Open Accessible Navigation Tree Inspector"
        >
          <div className="p-1 rounded-md bg-lime-500/10 text-lime-400 border border-lime-500/30">
            <Bug className="w-3.5 h-3.5" />
          </div>
          <span className="text-white font-extrabold text-[11px]">Dev: A11y Nav Tree</span>
          <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[9.5px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            Alt+T
          </span>
        </button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      {isOpen && (
        <aside
          id="a11y-dev-tree-sidebar"
          data-testid="a11y-dev-tree-sidebar"
          role="dialog"
          aria-label="Accessible Navigation Tree and Sequence Debugger"
          className="fixed top-0 bottom-0 left-0 w-full sm:w-[420px] bg-slate-950 border-r border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-400">
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>A11y Nav Tree Inspector</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-lime-400/20 text-lime-300 font-mono">
                    INTERNAL DEV
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Verify tab order, arrow key flow & speech logs
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-dev-tree-sidebar"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close A11y Nav Tree Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('tree')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                activeTab === 'tree' ? 'bg-slate-800 text-lime-400 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tree Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sequence-tester')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                activeTab === 'sequence-tester' ? 'bg-slate-800 text-sky-400 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sequence Tester
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('aria-logs')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'aria-logs' ? 'bg-slate-800 text-purple-400 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>ARIA Logs</span>
              {announcementLogs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-500/20 text-purple-300">
                  {announcementLogs.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab 1: Accessible Tree Overview */}
          {activeTab === 'tree' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div 
                role="tree" 
                aria-label="Application Navigation Tree Hierarchy"
                className="space-y-3 font-mono text-xs text-slate-300"
              >
                {/* Branch 1: Map Marker Pins */}
                <div role="treeitem" aria-expanded={expandedNodes['root-map']} className="space-y-1">
                  <div 
                    onClick={() => toggleNode('root-map')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 hover:bg-slate-800/80 cursor-pointer select-none text-white font-bold"
                  >
                    {expandedNodes['root-map'] ? <ChevronDown className="w-3.5 h-3.5 text-lime-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    <span>Global Map Markers Layer</span>
                    <span className="text-[10px] text-slate-400 font-normal">({filteredPartners.length} pins)</span>
                  </div>

                  {expandedNodes['root-map'] && (
                    <div className="pl-4 space-y-2 border-l border-slate-800 ml-3 mt-1">
                      {Object.entries(partnersByCountry).map(([country, partners]) => {
                        const countryNodeId = `cat-${country.toLowerCase().replace(/\s+/g, '-')}`;
                        const isExpanded = expandedNodes[countryNodeId];
                        return (
                          <div key={country} role="group" className="space-y-1">
                            <div
                              onClick={() => toggleNode(countryNodeId)}
                              className="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-900 cursor-pointer select-none text-slate-300 font-semibold"
                            >
                              {isExpanded ? <ChevronDown className="w-3 h-3 text-sky-400" /> : <ChevronRight className="w-3 h-3" />}
                              <span>{partners[0]?.countryFlag} {country}</span>
                              <span className="text-[10px] text-slate-500">({partners.length})</span>
                            </div>

                            {isExpanded && (
                              <div className="pl-4 space-y-1 border-l border-slate-800/80 ml-2">
                                {partners.map((partner, pIdx) => {
                                  const isFocused = currentFocusedMarkerId === partner.id;
                                  return (
                                    <div
                                      key={partner.id}
                                      role="treeitem"
                                      aria-selected={isFocused}
                                      className={`p-2 rounded-lg border transition-all text-[11px] ${
                                        isFocused 
                                          ? 'bg-slate-800 border-lime-400 text-white font-bold shadow-md' 
                                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 truncate">
                                          <span className="text-lime-400 font-mono text-[10px]">#{pIdx + 1}</span>
                                          <span className="truncate">{partner.name}</span>
                                        </div>
                                        <span className={`text-[9.5px] px-1 rounded ${
                                          partner.level === 'Platinum' ? 'bg-purple-900/40 text-purple-300' :
                                          partner.level === 'Gold' ? 'bg-amber-900/40 text-amber-300' : 'bg-sky-900/40 text-sky-300'
                                        }`}>
                                          {partner.level}
                                        </span>
                                      </div>

                                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                                        <span>📍 {partner.city}</span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => onFocusMarker(partner.id)}
                                            className="text-lime-400 hover:underline font-bold"
                                            title="Focus Pin on Map & Trigger ARIA Speech Cue"
                                          >
                                            Focus Pin →
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => onSelectPartner(partner)}
                                            className="text-sky-400 hover:underline"
                                            title="View Partner Profile Modal"
                                          >
                                            Profile
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Branch 2: Directory Cards Sequence */}
                <div role="treeitem" aria-expanded={expandedNodes['root-directory']} className="space-y-1 pt-2">
                  <div 
                    onClick={() => toggleNode('root-directory')}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 hover:bg-slate-800/80 cursor-pointer select-none text-white font-bold"
                  >
                    {expandedNodes['root-directory'] ? <ChevronDown className="w-3.5 h-3.5 text-sky-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
                    <span>Directory Cards Grid Order</span>
                    <span className="text-[10px] text-slate-400 font-normal">({PARTNERS_DATA.length} cards)</span>
                  </div>

                  {expandedNodes['root-directory'] && (
                    <div className="pl-4 space-y-1.5 border-l border-slate-800 ml-3 mt-1">
                      {PARTNERS_DATA.slice(0, 10).map((partner, idx) => (
                        <div 
                          key={partner.id} 
                          className="p-1.5 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-slate-500 font-mono text-[10px]">T{idx + 1}</span>
                            <span className="truncate">{partner.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`partner-card-${partner.id}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                el.focus();
                              }
                            }}
                            className="text-[10px] text-sky-400 hover:underline shrink-0"
                          >
                            Scroll & Focus
                          </button>
                        </div>
                      ))}
                      <div className="text-[10px] text-slate-500 pl-2">
                        + {PARTNERS_DATA.length - 10} more directory cards in tab order
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sequence Tester Controls */}
          {activeTab === 'sequence-tester' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* Active Focused Element Status Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Current Active Focus Target</span>
                </div>
                {currentFocusedMarkerId ? (() => {
                  const p = filteredPartners.find(x => x.id === currentFocusedMarkerId);
                  return (
                    <div className="space-y-1 text-xs">
                      <div className="text-white font-bold">{p?.name}</div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        ID: <span className="text-lime-300">{`partner-marker-${p?.id}`}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {p?.city}, {p?.country} • {p?.level} Partner ({p?.verified ? 'Verified' : 'Standard'})
                      </div>
                    </div>
                  );
                })() : (
                  <div className="text-xs text-slate-400 italic">
                    No map marker currently in focus. Use arrow keys or step buttons below.
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">
                  Simulate Keyboard Arrow Navigation
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStepArrow('prev')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev Pin (← / ↑)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepArrow('next')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition-colors"
                  >
                    <span>Next Pin (→ / ↓)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (filteredPartners.length > 0) onFocusMarker(filteredPartners[0].id);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300"
                  >
                    First Pin (Home)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (filteredPartners.length > 0) onFocusMarker(filteredPartners[filteredPartners.length - 1].id);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300"
                  >
                    Last Pin (End)
                  </button>
                </div>
              </div>

              {/* Automated Sequence Stress Tester */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Auto Audio Cue Runner</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAutoTesting(!isAutoTesting)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      isAutoTesting ? 'bg-rose-500 text-white' : 'bg-lime-500 text-slate-950'
                    }`}
                  >
                    {isAutoTesting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoTesting ? 'Stop Test' : 'Run Auto Cycle'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automatically cycles through each visible pin every 1.2s to test continuous speech output and verify no DOM deadlocks occur.
                </p>
              </div>

            </div>
          )}

          {/* Tab 3: ARIA Announcements Live Log */}
          {activeTab === 'aria-logs' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Announcements Stream ({announcementLogs.length})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLogs}
                      className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                    >
                      {copiedLog ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={onClearLogs}
                      className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {announcementLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 italic">
                    No announcements dispatched yet. Trigger search, keyboard arrows, or filter clicks to generate live events.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[460px] overflow-y-auto font-mono text-[11px]">
                    {announcementLogs.slice(-25).reverse().map(log => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1 text-slate-300"
                      >
                        <div className="flex items-center justify-between text-[9.5px] text-slate-500">
                          <span>{log.timestamp}</span>
                          <span className="px-1 rounded bg-purple-900/40 text-purple-300 uppercase">
                            {log.type}
                          </span>
                        </div>
                        <p className="text-white break-words">
                          "{log.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>WCAG 2.1 AA Compliance Suite</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-lime-400 hover:underline"
            >
              Close Panel
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
