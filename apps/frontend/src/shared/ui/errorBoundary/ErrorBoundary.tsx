import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
  }
  render(): ReactNode {
    const { error, hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div
          style={{
            position: "fixed", 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "white", 
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            overflow: "auto",
            padding: "20px",
          }}
        >
          <h1 style={{ color: "#dc3545", marginBottom: "20px" }}>
            Что-то пошло не так 😔
          </h1>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #dee2e6",
                maxWidth: "600px",
                textAlign: "left",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#495057" }}>
                Подробности ошибки:
              </h3>
              <pre
                style={{
                  color: "#dc3545",
                  fontSize: "14px",
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {error.toString()}
              </pre>
            </div>
          )}

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button onClick={() => window.location.reload()}>
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
