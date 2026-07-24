import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌦️",
  56: "🌦️",
  57: "🌦️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  66: "🌧️",
  67: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  77: "❄️",
  80: "🌦️",
  81: "🌦️",
  82: "🌦️",
  85: "❄️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

function getWeatherIcon(code) {
  return weatherIcons[code] || "🌡️";
}

export default function WeatherPage() {
  const queryClient = useQueryClient();
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState({});
  const [error, setError] = useState(null);

  const { data: cities = [], isLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: () => api.get("/weather/cities").then((res) => res.data),
  });

  const addMutation = useMutation({
    mutationFn: (name) => api.post("/weather/cities", { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      setCityName("");
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.error || "Ошибка при добавлении города");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/weather/cities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });

  const fetchWeather = async (city) => {
    if (weatherData[city.id]) return;

    setWeatherLoading((prev) => ({ ...prev, [city.id]: true }));
    try {
      const res = await api.get(`/weather/cities/${city.id}/current`);
      setWeatherData((prev) => ({ ...prev, [city.id]: res.data }));
    } catch (err) {
      setWeatherData((prev) => ({
        ...prev,
        [city.id]: { error: err.response?.data?.error || "Ошибка получения погоды" },
      }));
    } finally {
      setWeatherLoading((prev) => ({ ...prev, [city.id]: false }));
    }
  };

  const handleAdd = () => {
    const name = cityName.trim();
    if (!name) return;
    addMutation.mutate(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Название города..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flexGrow: 1 }}
          disabled={addMutation.isPending}
        />
        <Button
          variant="contained"
          startIcon={addMutation.isPending ? <CircularProgress size={16} /> : <AddIcon />}
          onClick={handleAdd}
          disabled={addMutation.isPending || !cityName.trim()}
        >
          {addMutation.isPending ? "..." : "Добавить"}
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, pt: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : cities.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            Нет добавленных городов. Добавьте первый!
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {cities.map((city) => {
              const weather = weatherData[city.id];
              const loading = weatherLoading[city.id];

              return (
                <Card key={city.id} variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {city.name}
                      </Typography>
                      {!weather && !loading && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => fetchWeather(city)}
                        >
                          Показать погоду
                        </Button>
                      )}
                    </Box>

                    {loading && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          Загрузка погоды...
                        </Typography>
                      </Box>
                    )}

                    {weather && !weather.error && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          bgcolor: "action.hover",
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Typography variant="h3" sx={{ lineHeight: 1 }}>
                          {getWeatherIcon(weather.weatherCode)}
                        </Typography>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {weather.temperature}°C
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {weather.description}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                            <Chip
                              label={`💧 ${weather.humidity}%`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`💨 ${weather.windSpeed} км/ч`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`🌡️ ${weather.feelsLike}°C`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {weather?.error && (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        {weather.error}
                      </Alert>
                    )}

                    {!weather && !loading && (
                      <Typography variant="caption" color="text.secondary">
                        Добавлен{" "}
                        {new Date(city.created_at).toLocaleDateString("ru-RU")}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(city.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}