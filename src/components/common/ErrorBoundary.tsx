import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Flame, RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public props!: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NOIR ErrorBoundary] Uncaught render error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-neutral-100 flex items-center justify-center p-4 selection:bg-[#d4af37]/30 selection:text-[#f7e7ce]">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0a0a0c] border border-amber-600/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-500/50 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-mono">NOIR HOOKAH Lounge</span>
              </div>
              <h1 className="font-serif-luxury font-bold text-2xl text-white">Experience Interrupted</h1>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mx-auto">
                A client application state anomaly occurred. Your session data and reservations remain secure in the NOIR cloud.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Experience</span>
              </button>
              <button
                onClick={this.handleHome}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                <span>Return to Lounge</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
