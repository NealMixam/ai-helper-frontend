import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChatPage from "./pages/ChatPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline></CssBaseline>
        <ChatPage></ChatPage>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
