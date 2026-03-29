import { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import ChatMessage from "../components/ChatMessage";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api.js";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newMessage]);

    mutation.mutate({ message: inputValue });

    setInputValue("");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["healthCheck"],
    queryFn: () => api.get("/health").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (newMsg) => api.post("/chat", newMsg).then((res) => res.data),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(), 
          text: data.content,
          sender: "ai",
        },
      ]);
    },
  });

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
        {isLoading ? "Проверка..." : data.status}
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
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={mutation.isPending}
          >
            Отправить
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
