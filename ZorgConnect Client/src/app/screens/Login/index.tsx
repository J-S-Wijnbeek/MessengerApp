import { useLoginForm } from "./hooks/useLoginForm";

export default function Login() {
  const { email, setEmail, password, setPassword, handleLogin } = useLoginForm();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full mx-auto">
      {/* Teal Header with Logo Only */}
      <div className="bg-primary text-primary-foreground text-center py-8">
        <div className="text-4xl font-bold mb-2">YoungConnect</div>
        <div className="text-sm opacity-90">GGZ Verbinding & Zorg</div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <form onSubmit={handleLogin} className="space-y-4 max-w-[75vw] md:max-w-[50vw] w-full mx-auto">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="naam@voorbeeld.nl"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
          >
            Inloggen
          </button>

          {/* Demo Credentials */}
          <div className="text-center text-xs text-muted-foreground">
            demo@client.nl / 1234
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-secondary text-sm font-medium hover:underline"
            >
              Wachtwoord vergeten?
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pb-8 px-8">
        Door in te loggen ga je akkoord met onze voorwaarden en privacybeleid
      </div>
    </div>
  );
}
