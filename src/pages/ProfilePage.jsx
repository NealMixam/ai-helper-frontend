import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { api } from "../api";

export default function ProfilePage() {
  const [linkCode, setLinkCode] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [linkStatus, setLinkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await api.get("/telegram/link-status");
      setLinkStatus(res.data);
    } catch {
      setError("Ошибка при проверке статуса");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    setError(null);
    setCopied(false);
    try {
      const res = await api.post("/telegram/link-code");
      setLinkCode(res.data.code);
      setExpiresIn(res.data.expiresIn);
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при генерации кода");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshStatus = () => {
    setLoading(true);
    setError(null);
    loadStatus();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isLinked = linkStatus?.linked;

  return (
    <Box sx={{ height: "100%", overflowY: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        Настройки
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TelegramIcon color="primary" fontSize="large" />
            <Typography variant="h6">Telegram</Typography>
            {isLinked && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Привязан"
                color="success"
                size="small"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Привяжите Telegram-аккаунт, чтобы получать уведомления о погоде и
            другие уведомления от AI Helper прямо в Telegram.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {isLinked ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Telegram привязан к вашему аккаунту.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Telegram ID: {linkStatus.telegramChatId}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRefreshStatus}
                >
                  Обновить статус
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<TelegramIcon />}
                  onClick={handleGenerateCode}
                  disabled={generating}
                >
                  Перепривязать
                </Button>
              </Box>
              {linkCode && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Код для привязки:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontFamily: "monospace",
                      fontSize: "1.5rem",
                      letterSpacing: 2,
                    }}
                  >
                    <code>{linkCode}</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopy}
                    >
                      {copied ? "Скопировано" : "Копировать"}
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: "block" }}
                  >
                    Отправьте этот код боту:{" "}
                    <code>/link {linkCode}</code>
                    <br />
                    Код действителен {Math.floor(expiresIn / 60)} минут.
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Telegram не привязан. Сгенерируйте код и отправьте его боту.
              </Alert>

              {!linkCode ? (
                <Button
                  variant="contained"
                  startIcon={
                    generating ? (
                      <CircularProgress size={16} />
                    ) : (
                      <TelegramIcon />
                    )
                  }
                  onClick={handleGenerateCode}
                  disabled={generating}
                >
                  {generating ? "Генерация..." : "Привязать Telegram"}
                </Button>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Ваш код для привязки:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontFamily: "monospace",
                      fontSize: "1.5rem",
                      letterSpacing: 2,
                    }}
                  >
                    <code>{linkCode}</code>
                    <Button
                      size="small"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopy}
                    >
                      {copied ? "Скопировано" : "Копировать"}
                    </Button>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                  >
                    Инструкция:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="ol"
                    sx={{ pl: 2, mt: 0.5 }}
                  >
                    <li>
                      Откройте Telegram и найдите бота{" "}
                      <strong>@ai_helper_bot</strong>
                    </li>
                    <li>
                      Отправьте команду: <code>/link {linkCode}</code>
                    </li>
                    <li>Дождитесь подтверждения от бота</li>
                    <li>
                      Вернитесь сюда и нажмите «Обновить статус»
                    </li>
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRefreshStatus}
                    >
                      Обновить статус
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setLinkCode(null);
                        setCopied(false);
                      }}
                    >
                      Создать новый код
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}