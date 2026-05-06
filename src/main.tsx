import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { AppWrapper } from "./components/common/page-meta";
import { ThemeProvider } from "./context/theme-context";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Sentry.ErrorBoundary>
              <App />
            </Sentry.ErrorBoundary>
          </Provider>
        </QueryClientProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
