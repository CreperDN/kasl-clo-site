import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Зберігаємо повну інформацію про помилку
    this.setState({ error, errorInfo });

    // Також можна логувати на сервер
    console.error("Помилка у компоненті:", error);
    console.error("Деталі помилки:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", fontFamily: "monospace" }}>
          <h2>Сталася помилка на сторінці</h2>
          <p><strong>Повідомлення:</strong> {this.state.error?.message}</p>
          {this.state.errorInfo && (
            <>
              <p><strong>Стек компонентів:</strong></p>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </>
          )}
          <button onClick={() => window.location.reload()}>Спробувати ще раз</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
