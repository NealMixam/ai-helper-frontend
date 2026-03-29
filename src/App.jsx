import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChatPage from "./pages/ChatPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline></CssBaseline>
      <ChatPage></ChatPage>
    </ThemeProvider>
  );
}

export default App;
