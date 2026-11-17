import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Check, AlertCircle, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';

export interface PatternNode {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
}

export interface PatternLockProps {
  /** Size of the pattern grid in pixels (square) */
  size?: number;
  /** Minimum dots required to form a valid pattern (default: 4, like Android) */
  minNodes?: number;
  /** Current mode: 'record' (set & confirm), 'verify' (match target), or 'free' */
  mode?: 'record' | 'verify' | 'free';
  /** Target pattern to match in 'verify' mode (e.g. [0, 1, 2, 4, 6]) */
  targetPattern?: number[];
  /** Callback when pattern is successfully completed/verified */
  onSuccess?: (pattern: number[]) => void;
  /** Callback when verification fails */
  onError?: (errorMsg: string) => void;
  /** Callback on any pattern change */
  onChange?: (pattern: number[]) => void;
  /** Whether to show directional connection lines while drawing (default: true) */
  showTrail?: boolean;
  /** Custom prompt header text */
  promptText?: string;
  /** Whether grid is disabled */
  disabled?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
}

/**
 * Android-style 3x3 Pattern Lock Gesture Component
 * Fully responsive with pointer events (touch + mouse) and accessibility support.
 */
export const PatternLock: React.FC<PatternLockProps> = ({
  size = 280,
  minNodes = 4,
  mode = 'free',
  targetPattern,
  onSuccess,
  onError,
  onChange,
  showTrail = true,
  promptText,
  disabled = false,
  ariaLabel = 'Pattern Lock 3 by 3 Grid',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const selectedNodesRef = useRef<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>(
    promptText || `Connect at least ${minNodes} dots`
  );
  const [showNumbers, setShowNumbers] = useState(false);

  // Sync ref
  useEffect(() => {
    selectedNodesRef.current = selectedNodes;
  }, [selectedNodes]);

  // Setup mode states (draw once -> confirm)
  const [firstAttemptPattern, setFirstAttemptPattern] = useState<number[] | null>(null);
  const [recordStep, setRecordStep] = useState<'first' | 'confirm'>('first');

  // Compute node coordinates relative to grid size
  const padding = size * 0.14;
  const usableSize = size - padding * 2;
  const step = usableSize / 2;

  const nodes: PatternNode[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const id = r * 3 + c;
      nodes.push({
        id,
        row: r,
        col: c,
        x: padding + c * step,
        y: padding + r * step,
      });
    }
  }

  // Trigger light haptic pulse on mobile if supported
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // Safe fallback
      }
    }
  }, []);

  // Find node under client coordinate
  const getNodeAtPoint = (clientX: number, clientY: number): PatternNode | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Threshold radius around node center
    const hitRadius = size * 0.12;

    for (const node of nodes) {
      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= hitRadius) {
        return node;
      }
    }
    return null;
  };

  // Intermediate node detection (e.g. going from 0 to 2 passes through 1)
  const getIntermediateNode = (fromId: number, toId: number): number | null => {
    const fromNode = nodes[fromId];
    const toNode = nodes[toId];
    if (!fromNode || !toNode) return null;

    const midRow = (fromNode.row + toNode.row) / 2;
    const midCol = (fromNode.col + toNode.col) / 2;

    // Only if it lands exactly on integer node
    if (Number.isInteger(midRow) && Number.isInteger(midCol)) {
      const midId = midRow * 3 + midCol;
      if (!selectedNodes.includes(midId)) {
        return midId;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Safe fallback
    }

    const hitNode = getNodeAtPoint(e.clientX, e.clientY);
    if (hitNode) {
      setIsDrawing(true);
      const initial = [hitNode.id];
      setSelectedNodes(initial);
      selectedNodesRef.current = initial;
      setStatus('recording');
      setStatusMessage('Release finger or mouse to confirm pattern');
      triggerHaptic();

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || disabled) return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    const hitNode = getNodeAtPoint(e.clientX, e.clientY);
    const currentList = selectedNodesRef.current;
    if (hitNode && !currentList.includes(hitNode.id)) {
      const lastId = currentList[currentList.length - 1];
      const intermediate = getIntermediateNode(lastId, hitNode.id);

      let nextNodes = [...currentList];
      if (intermediate !== null && !nextNodes.includes(intermediate)) {
        nextNodes.push(intermediate);
      }
      nextNodes.push(hitNode.id);

      setSelectedNodes(nextNodes);
      selectedNodesRef.current = nextNodes;
      triggerHaptic();
      onChange?.(nextNodes);
    }
  };

  const finalizePattern = (finalNodes: number[]) => {
    setIsDrawing(false);
    setCursorPos(null);

    if (finalNodes.length === 0) {
      setStatus('idle');
      return;
    }

    if (finalNodes.length < minNodes) {
      setStatus('error');
      setStatusMessage(`Pattern too short. Connect at least ${minNodes} dots.`);
      onError?.(`Connect at least ${minNodes} dots.`);
      triggerHaptic();
      setTimeout(() => {
        setSelectedNodes([]);
        setStatus('idle');
        setStatusMessage(
          recordStep === 'confirm'
            ? 'Draw pattern again to confirm'
            : promptText || `Connect at least ${minNodes} dots`
        );
      }, 1200);
      return;
    }

    // Verify mode
    if (mode === 'verify') {
      if (!targetPattern || targetPattern.length === 0) {
        setStatus('success');
        setStatusMessage('Pattern accepted');
        onSuccess?.(finalNodes);
        return;
      }

      const isMatch =
        finalNodes.length === targetPattern.length &&
        finalNodes.every((val, idx) => val === targetPattern[idx]);

      if (isMatch) {
        setStatus('success');
        setStatusMessage('Pattern verified successfully!');
        triggerHaptic();
        onSuccess?.(finalNodes);
      } else {
        setStatus('error');
        setStatusMessage('Wrong pattern. Please try again.');
        onError?.('Wrong pattern.');
        triggerHaptic();
        setTimeout(() => {
          setSelectedNodes([]);
          setStatus('idle');
          setStatusMessage(promptText || 'Draw your unlock pattern');
        }, 1200);
      }
      return;
    }

    // Record mode (two-step confirmation)
    if (mode === 'record') {
      if (recordStep === 'first') {
        setFirstAttemptPattern(finalNodes);
        setRecordStep('confirm');
        setStatus('idle');
        setSelectedNodes([]);
        setStatusMessage('Draw pattern again to confirm');
      } else {
        // Confirmation step
        const isMatch =
          firstAttemptPattern &&
          finalNodes.length === firstAttemptPattern.length &&
          finalNodes.every((val, idx) => val === firstAttemptPattern[idx]);

        if (isMatch) {
          setStatus('success');
          setStatusMessage('Pattern confirmed and saved!');
          triggerHaptic();
          onSuccess?.(finalNodes);
        } else {
          setStatus('error');
          setStatusMessage('Patterns do not match. Restarting pattern setup.');
          onError?.('Patterns did not match.');
          triggerHaptic();
          setTimeout(() => {
            setFirstAttemptPattern(null);
            setRecordStep('first');
            setSelectedNodes([]);
            setStatus('idle');
            setStatusMessage(`Draw your pattern (at least ${minNodes} dots)`);
          }, 1400);
        }
      }
      return;
    }

    // Free mode
    setStatus('success');
    setStatusMessage(`Pattern captured (${finalNodes.length} dots)`);
    onSuccess?.(finalNodes);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }
    finalizePattern(selectedNodesRef.current);
  };

  // Keyboard / Click accessibility: click/tap on node
  const handleNodeClick = (nodeId: number) => {
    if (disabled || isDrawing) return;

    const currentList = selectedNodesRef.current;
    if (!currentList.includes(nodeId)) {
      let next = [...currentList];
      if (currentList.length > 0) {
        const lastId = currentList[currentList.length - 1];
        const intermediate = getIntermediateNode(lastId, nodeId);
        if (intermediate !== null && !next.includes(intermediate)) {
          next.push(intermediate);
        }
      }
      next.push(nodeId);
      setSelectedNodes(next);
      selectedNodesRef.current = next;
      triggerHaptic();
      onChange?.(next);
    }
  };

  const handleReset = () => {
    setSelectedNodes([]);
    selectedNodesRef.current = [];
    setCursorPos(null);
    setIsDrawing(false);
    setStatus('idle');
    setFirstAttemptPattern(null);
    setRecordStep('first');
    setStatusMessage(promptText || `Connect at least ${minNodes} dots`);
  };

  // Dynamic theme colors based on state
  const isLemonGreen = status === 'success' || (status === 'recording' && selectedNodes.length >= minNodes);
  const isError = status === 'error';

  const strokeColor = isError
    ? '#EF4444' // subtle red
    : isLemonGreen
    ? '#84CC16' // lemon-green
    : '#0F4C81'; // brand blue

  const glowColor = isError
    ? 'rgba(239, 68, 68, 0.35)'
    : isLemonGreen
    ? 'rgba(132, 204, 22, 0.4)'
    : 'rgba(15, 76, 129, 0.35)';

  return (
    <div className="flex flex-col items-center select-none" id="pattern-lock-container">
      {/* Status Feedback Banner with aria-live */}
      <div
        className={`mb-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
          isError
            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
            : isLemonGreen
            ? 'bg-[#84CC16]/15 text-[#65A30D] dark:text-[#84CC16] border border-[#84CC16]/40'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        }`}
        aria-live="polite"
        role="status"
      >
        {isError ? (
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        ) : isLemonGreen ? (
          <Check className="w-3.5 h-3.5 flex-shrink-0 stroke-[3]" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-[#0F4C81] dark:bg-[#9AE61C] animate-pulse" />
        )}
        <span className="truncate max-w-[260px]">{statusMessage}</span>
      </div>

      {/* Interactive 3x3 Grid Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: size,
          height: size,
          touchAction: 'none',
        }}
        className={`relative rounded-3xl bg-slate-50 dark:bg-[#071626] border-2 transition-all duration-200 touch-none cursor-crosshair shadow-inner ${
          isError
            ? 'border-red-400 dark:border-red-500/60 ring-4 ring-red-400/20'
            : isLemonGreen
            ? 'border-[#84CC16] ring-4 ring-[#84CC16]/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        aria-label={ariaLabel}
        role="application"
        tabIndex={0}
      >
        {/* SVG Drawing Canvas for Connecting Lines */}
        {showTrail && (
          <svg
            className="absolute inset-0 pointer-events-none w-full h-full z-10"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Render connecting line segments */}
            {selectedNodes.map((nodeId, idx) => {
              if (idx === 0) return null;
              const prevNode = nodes[selectedNodes[idx - 1]];
              const currNode = nodes[nodeId];
              return (
                <line
                  key={`line-${prevNode.id}-${currNode.id}`}
                  x1={prevNode.x}
                  y1={prevNode.y}
                  x2={currNode.x}
                  y2={currNode.y}
                  stroke={strokeColor}
                  strokeWidth={size * 0.024}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 4px ${glowColor})`,
                  }}
                />
              );
            })}

            {/* Active trailing line to cursor/finger during active drag */}
            {isDrawing && cursorPos && selectedNodes.length > 0 && (
              <line
                x1={nodes[selectedNodes[selectedNodes.length - 1]].x}
                y1={nodes[selectedNodes[selectedNodes.length - 1]].y}
                x2={cursorPos.x}
                y2={cursorPos.y}
                stroke={strokeColor}
                strokeWidth={size * 0.02}
                strokeDasharray="4 4"
                strokeLinecap="round"
                opacity={0.8}
              />
            )}
          </svg>
        )}

        {/* 9 Gesture Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodes.includes(node.id);
          const orderIndex = selectedNodes.indexOf(node.id);
          const isLatest = selectedNodes[selectedNodes.length - 1] === node.id;

          const nodeRadius = size * 0.085;
          const innerDotRadius = size * 0.032;

          return (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNodeClick(node.id);
                }
              }}
              style={{
                left: node.x,
                top: node.y,
                width: nodeRadius * 2,
                height: nodeRadius * 2,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute rounded-full flex items-center justify-center transition-all duration-150 z-20 ${
                isSelected
                  ? 'scale-110'
                  : 'hover:scale-105 active:scale-95'
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Pattern dot ${node.id + 1} of 9`}
              aria-pressed={isSelected}
            >
              {/* Outer Ring / Halo */}
              <div
                style={{
                  width: nodeRadius * 2,
                  height: nodeRadius * 2,
                }}
                className={`absolute rounded-full border-2 transition-all ${
                  isSelected
                    ? isError
                      ? 'border-red-500 bg-red-500/15'
                      : isLemonGreen
                      ? 'border-[#84CC16] bg-[#84CC16]/20'
                      : 'border-[#0F4C81] dark:border-[#9AE61C] bg-[#0F4C81]/15'
                    : 'border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 shadow-2xs'
                } ${isLatest && isDrawing ? 'animate-ping opacity-30' : ''}`}
              />

              {/* Centered Target Dot */}
              <div
                style={{
                  width: innerDotRadius * 2,
                  height: innerDotRadius * 2,
                }}
                className={`rounded-full transition-transform duration-150 shadow-xs z-10 ${
                  isSelected
                    ? isError
                      ? 'bg-red-500 scale-125'
                      : isLemonGreen
                      ? 'bg-[#84CC16] scale-125'
                      : 'bg-[#0F4C81] dark:bg-[#9AE61C] scale-125'
                    : 'bg-slate-400 dark:bg-slate-500'
                }`}
              />

              {/* Sequence Order / Accessible Number Overlay */}
              {showNumbers && (
                <span
                  className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white shadow-xs z-20 ${
                    isSelected ? 'bg-[#84CC16]' : 'bg-slate-400'
                  }`}
                >
                  {isSelected ? orderIndex + 1 : node.id + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Control Utility Toolbar */}
      <div className="flex items-center justify-between w-full max-w-[280px] mt-3.5 text-xs text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 hover:text-[#0F4C81] dark:hover:text-[#9AE61C] font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Grid</span>
        </button>

        <button
          type="button"
          onClick={() => setShowNumbers(!showNumbers)}
          className="inline-flex items-center gap-1 hover:text-[#0F4C81] dark:hover:text-[#9AE61C] font-medium transition-colors cursor-pointer"
          title="Toggle dot numbers for easier accessibility"
        >
          {showNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showNumbers ? 'Hide Numbers' : 'Show Numbers'}</span>
        </button>
      </div>

      {/* Sequence Preview Dots */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[11px] text-slate-400 font-medium">Nodes Connected:</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < selectedNodes.length
                  ? isError
                    ? 'bg-red-500'
                    : isLemonGreen
                    ? 'bg-[#84CC16]'
                    : 'bg-[#0F4C81]'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Keyboard / Click Mode Finalize Action */}
      {!isDrawing && selectedNodes.length >= minNodes && status !== 'success' && (
        <button
          type="button"
          onClick={() => finalizePattern(selectedNodesRef.current)}
          className="mt-3 w-full max-w-[280px] py-1.5 px-3 rounded-lg text-xs font-bold bg-[#0F4C81] hover:bg-[#072644] text-white dark:bg-[#9AE61C] dark:text-[#072644] dark:hover:bg-[#84CC16] transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer animate-in fade-in"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Confirm Gesture ({selectedNodes.length} Dots)</span>
        </button>
      )}
    </div>
  );
};
