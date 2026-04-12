import { useState } from "react";
import { Typography, TextField, Button, Box, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import ChatMessage from "../components/ChatMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api.js";

export default function ChatPage({ onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => api.get("/messages").then((res) => res.data),
  });

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
    <Box
      component="main"
      sx={{ display: "flex", bgcolor: "background.default", height: "100vh" }}
    >
      <Box
        component="aside"
        sx={{
          width: "280px",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Чаты</Typography>
          <IconButton onClick={onLogout} title="Выйти">
            <LogoutIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? "Загрузка истории..." : `Сообщений: ${messages.length}`}
          </Typography>
        </Box>
      </Box>

      <Box
        component="section"
        sx={{ flexGrow: "1", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
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
      </Box>
    </Box>
  );
}