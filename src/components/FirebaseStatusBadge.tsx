import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, AlertTriangle, Cloud, CloudOff, Info } from 'lucide-react';
import { checkFirebaseHealth, FirebaseHealthStatus, hasFirebaseEnvVars } from '../firebase/config';

export interface FirebaseStatusBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
  showDetails?: boolean;
}

export const FirebaseStatusBadge: React.FC<FirebaseStatusBadgeProps> = ({
  variant = 'compact',
  className = '',
  showDetails = false
}) => {
  const [health, setHealth] = useState<FirebaseHealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      const result = await checkFirebaseHealth();
      setHealth(result);
    } catch {
      setHealth({
        isConnected: false,
        mode: 'local_storage_fallback',
        error: 'Missing environment variables or network unreachable'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const isConnected = health?.isConnected === true && health?.mode === 'live_cloud';

  if (isLoading && !health) {
    return (
      <div className={`p-2.5 rounded-2xl bg-[#070C1C] border border-white/10 flex items-center justify-between gap-2 animate-pulse ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-500 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-slate-300">
            Diagnosing Firebase Cloud Connection...
          </span>
        </div>
        <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl transition-all border ${
        isConnected
          ? 'bg-gradient-to-r from-emerald-950/60 via-[#0B1A24] to-[#071318] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-emerald-200'
          : 'bg-gradient-to-r from-amber-950/60 via-[#181109] to-[#0E0C16] border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.12)] text-amber-200'
      } ${variant === 'compact' ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4'} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          {isConnected ? (
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-400/50 animate-ping" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
          ) : (
            <div className="flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            </div>
          )}

          <div className="text-left">
            {isConnected ? (
              <span className="text-xs sm:text-[13px] font-black font-['Outfit'] uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                ● LIVE REAL-TIME CLOUD CONNECTED
                <span className="hidden md:inline font-mono text-[10px] text-emerald-400/90 font-medium lowercase">
                  (Syncing Across All Registered Devices)
                </span>
              </span>
            ) : (
              <span className="text-xs sm:text-[13px] font-black font-['Outfit'] uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                ▲ LOCAL OFFLINE MODE
                <span className="hidden md:inline font-mono text-[10px] text-amber-400/90 font-medium lowercase">
                  (Data stored locally on this device. Add Firebase ENV keys to activate global multi-device sync)
                </span>
              </span>
            )}
            
            {/* Mobile Subtitle */}
            <p className="md:hidden text-[10px] font-mono opacity-80 mt-0.5 leading-tight">
              {isConnected
                ? 'Syncing across all registered devices'
                : 'Data stored locally on this device. Add Firebase ENV keys to activate global multi-device sync'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto ml-auto">
          {(showDetails || !isConnected) && (
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Diagnostic Info"
              aria-label="Diagnostic Information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={runDiagnostic}
            disabled={isLoading}
            className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold ${
              isConnected
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
            }`}
            title="Re-run Diagnostic Health Check"
            aria-label="Re-test Firebase Connection"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Expanded Diagnostic Panel */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[11px] font-mono space-y-1.5 animate-fadeIn">
          <div className="flex justify-between items-center text-slate-300">
            <span>Diagnostic Status:</span>
            <span className={isConnected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {health?.mode === 'live_cloud' ? 'Live Cloud Real-Time' : 'Local Storage Fallback'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Environment Keys Present:</span>
            <span className={hasFirebaseEnvVars ? 'text-emerald-400' : 'text-amber-400'}>
              {hasFirebaseEnvVars ? 'Yes (All 6 Inspected)' : 'Missing VITE_FIREBASE_* Keys'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Persistence Engine:</span>
            <span className="text-slate-200">IndexedDB Local Cache Active</span>
          </div>

          {health?.error && (
            <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-amber-300/90 text-[10px] leading-relaxed">
              <strong>Notice:</strong> {health.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default FirebaseStatusBadge;
