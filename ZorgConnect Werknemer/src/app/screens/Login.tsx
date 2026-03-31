import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/staff-home");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[390px] mx-auto">
      {/* Teal Header with Logo Only */}
      <div className="bg-[#1DC6B4] text-white text-center py-8">
        <div className="text-4xl font-bold mb-2">ZorgConnect</div>
        <div className="text-sm opacity-90">GGZ Verbinding & Zorg</div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4]"
              placeholder="naam@voorbeeld.nl"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DC6B4]"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1DC6B4] text-white py-3 rounded-lg font-medium hover:bg-[#18B5A3] transition-colors"
          >
            Inloggen
          </button>

          {/* Demo Credentials */}
          <div className="text-center text-xs text-gray-500">
            demo@medewerker.nl / 1234
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-[#F5A623] text-sm font-medium hover:underline"
            >
              Wachtwoord vergeten?
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pb-8 px-8">
        Door in te loggen ga je akkoord met onze voorwaarden en privacybeleid
      </div>
    </div>
  );
}