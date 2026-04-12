import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box, Paper, Typography } from "@mui/material";

export default function ChatMessage({ message }) {
  const isAi = message.sender === "ai";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isAi ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          maxWidth: "80%",
          bgcolor: isAi ? "background.paper" : "primary.main",
          color: isAi ? "text.primary" : "primary.contrastText",
        }}
      >
        {isAi ? (
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ margin: "10px 0", borderRadius: "8px" }} 
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          <Typography>{message.text}</Typography>
        )}
      </Paper>
    </Box>
  );
}
