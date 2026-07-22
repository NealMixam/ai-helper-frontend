import "./App.css";
import { useState, useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import NotesPage from "./pages/NotesPage";
import AppLayout from "./components/AppLayout";

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

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthPage onLogin={handleLogin} />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <AppLayout
                  onLogout={handleLogout}
                  toggleTheme={toggleTheme}
                  currentMode={activeMode}
                />
              }
            >
              <Route index element={<ChatPage />} />
              <Route path="notes" element={<NotesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;