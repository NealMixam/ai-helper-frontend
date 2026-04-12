import "./App.css";
import { useState, useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "system";
  });

  const activeMode = useMemo(() => {
    if (mode === "system") {
      return prefersDarkMode ? "dark" : "light";
    }
    return mode;
  }, [mode, prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: activeMode,
        },
      }),
    [activeMode],
  );

  const toggleTheme = () => {
    const newMode = activeMode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <ChatPage
            onLogout={handleLogout}
            toggleTheme={toggleTheme}
            currentMode={activeMode}
          />
        ) : (
          <AuthPage onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
