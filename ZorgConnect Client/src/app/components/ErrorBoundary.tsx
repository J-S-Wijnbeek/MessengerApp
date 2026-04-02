import { useRouteError, useNavigate } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Er ging iets mis</h1>
        <p className="text-muted-foreground mb-6">
          {error?.message || "Er is een onverwachte fout opgetreden."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Terug naar Login
        </button>
      </div>
    </div>
  );
}