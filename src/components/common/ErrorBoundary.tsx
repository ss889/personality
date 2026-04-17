import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,var(--app-bg)_0%,var(--app-bg-accent)_100%)] px-4 text-[var(--app-text)]">
          <div className="rounded-2xl border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-8 text-center shadow-[0_20px_60px_var(--app-shadow)]">
            <h2 className="mb-4 text-2xl font-bold text-[var(--app-text)]">Something went wrong</h2>
            <p className="mb-6 text-[color:var(--app-muted)]">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[color:var(--app-accent-strong)] px-6 py-2 text-white hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
