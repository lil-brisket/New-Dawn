import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorScreen } from './ErrorScreen';
import { Logger } from '@/services/logger/Logger';
import { analytics } from '@/services/analytics/Analytics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Logger.error('Unhandled render error', error.message, info.componentStack);
    analytics.trackError(error, { componentStack: info.componentStack ?? undefined });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorScreen onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
