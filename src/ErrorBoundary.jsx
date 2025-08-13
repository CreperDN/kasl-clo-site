import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    // Оновлюємо стан, щоб показати fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    // Тут можна логувати помилку на сервер
    console.error("Помилка у компоненті:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
          <h2>Сталася помилка на сторінці</h2>
          <p>{this.state.errorMessage}</p>
          <button onClick={() => window.location.reload()}>Спробувати ще раз</button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
