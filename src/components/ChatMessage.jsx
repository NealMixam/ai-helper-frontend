import { Box, Typography, Paper } from "@mui/material";

export default function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          maxWidth: "70%",
          bgcolor: isUser ? "primary.main" : "grey.800",
          color: "white",
          borderRadius: isUser ? "12px 12px 0 12px" : "12px 12px 12px 0",
        }}
      >
        <Typography variant="caption" sx={{ display: "block", opacity: 0.7, mb: 0.5 }}>
          {isUser ? "Вы" : "Бот"}
        </Typography>
        <Typography>{message.text}</Typography>
      </Paper>
    </Box>
  );
}