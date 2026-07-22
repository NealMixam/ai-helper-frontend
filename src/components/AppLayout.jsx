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
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import ChatIcon from "@mui/icons-material/Chat";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

const navItems = [
  { label: "Чат", path: "/", icon: <ChatIcon /> },
  { label: "Заметки", path: "/notes", icon: <NoteAltIcon /> },
];

export default function AppLayout({ onLogout, toggleTheme, currentMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
      <Box
        component="aside"
        sx={{
          width: 240,
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            AI Helper
          </Typography>
          <Box>
            <Tooltip title={currentMode === "dark" ? "Светлая тема" : "Темная тема"}>
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {currentMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Выйти">
              <IconButton onClick={onLogout} color="error" size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, pt: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{ mx: 1, borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
}