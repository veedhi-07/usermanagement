import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";

const queryClient = new QueryClient();

Sentry.init({
  dsn: "https://8e0c629801b5c47fd103058a8caa13c1@o4511212543148032.ingest.us.sentry.io/4511212575719424",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: "development",
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["log", "warn", "error"],
    }),
    Sentry.browserTracingIntegration(),
  ],
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>,
);
