import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";

const navItems = [
  { path: "/chat", label: "Чат", icon: <ChatIcon /> },
  { path: "/notes", label: "Заметки", icon: <NoteAltIcon /> },
  { path: "/weather", label: "Погода", icon: <WbSunnyIcon /> },
  { path: "/profile", label: "Профиль", icon: <SettingsIcon /> },
];

export default function AppLayout({ onLogout, toggleTheme, currentMode }) {
  const navigate = useNavigate();
  const location = useLocation();

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
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">AI Helper</Typography>
          <Box>
            <Tooltip
              title={currentMode === "dark" ? "Светлая тема" : "Темная тема"}
            >
              <IconButton onClick={toggleTheme} color="inherit">
                {currentMode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Выйти">
              <IconButton onClick={onLogout} color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        <List sx={{ px: 1, py: 2 }} dense>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        component="section"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
