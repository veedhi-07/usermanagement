import * as Sentry from "@sentry/react";

const SentryTest = () => {
  const triggerError = () => {
    Sentry.captureMessage("User clicked error button", "info");

    Sentry.addBreadcrumb({
      message: "Trigger error button clicked",
      level: "info",
    });
    throw new Error("Test Error from Sentry button click");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sentry Test</h2>

      <button onClick={triggerError}>Click to trigger error</button>
    </div>
  );
};

export default SentryTest;
