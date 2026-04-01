import { RouterProvider } from 'react-router';
import { router } from './routes';
import { useAccessibilityPreferences } from "./hooks/useAccessibilityPreferences";

export default function App() {
  useAccessibilityPreferences();
  return <RouterProvider router={router} />;
}
