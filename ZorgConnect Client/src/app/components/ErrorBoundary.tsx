import { useRouteError, useNavigate } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Er ging iets mis</h1>
        <p className="text-gray-600 mb-6">
          {error?.message || "Er is een onverwachte fout opgetreden."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#F5A623] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E69510] transition-colors"
        >
          Terug naar Login
        </button>
      </div>
    </div>
  );
}