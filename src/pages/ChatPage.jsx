import { useState, useRef, useEffect } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import ChatMessage from "../components/ChatMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.js";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const messagesEndRef = useRef(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get("/messages").then((res) => res.data),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mutation = useMutation({
    mutationFn: (newMsg) => api.post("/chat", newMsg).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setInputValue("");
    },
  });

  const handleSendMessage = () => {
    if (inputValue.trim() === "" || mutation.isPending) return;
    mutation.mutate({ message: inputValue });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {isLoading ? (
          <Typography color="text.secondary">Загрузка истории...</Typography>
        ) : messages.length === 0 ? (
          <Typography color="text.secondary">Нет сообщений. Начните диалог!</Typography>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
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
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Напишите сообщение..."
          disabled={mutation.isPending}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "..." : "Отправить"}
        </Button>
      </Box>
    </>
  );
}
