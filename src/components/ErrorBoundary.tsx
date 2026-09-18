import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in StudentVentures:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetData = () => {
    if (window.confirm('Una uhakika unataka kufuta data za muda na kurudisha mfumo kwenye hali ya awali? Hii itasafisha hitilafu ya kivinjari chako.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Hitilafu ya Kiufundi Imetokea
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mfumo wa StudentVentures umekumbana na hitilafu ya kivinjari. Taarifa za kiusalama na akaunti zinalindwa salama.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-300">
                <span className="text-slate-500 block mb-1">Maelezo ya Hitilafu:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Pakia Upya Mfumo</span>
              </button>

              <button
                onClick={this.handleResetData}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Weka Upya Data za Awali</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              StudentVentures &bull; Usimamizi na Elimu ya Uwekezaji kwa Wanafunzi wa Sekondari
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
