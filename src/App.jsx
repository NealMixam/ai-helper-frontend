import "./App.css";
import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {isAuthenticated ? (
          <ChatPage onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;