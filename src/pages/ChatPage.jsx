import { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import ChatMessage from "../components/ChatMessage";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newMessage]);

    setInputValue("");
  };

  return (
    <Box
      component="main"
      sx={{ display: "flex", bgcolor: "background.default", height: "100vh" }}
    >
      <Box
        component="aside"
        sx={{
          width: "280px",
          bgcolor: "gray",
          borderRight: "1px solid ",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ p: 2 }} variant="h6">
          История чатов
        </Typography>
      </Box>
      <Box
        component="section"
        sx={{ flexGrow: "1", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg}></ChatMessage>
          ))}
        </Box>
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Напишите сообщение..."
          ></TextField>
          <Button variant="contained" onClick={handleSendMessage}>
            Отправить
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
