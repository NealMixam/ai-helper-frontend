import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => api.get("/notes").then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (body) => api.post("/notes", body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }) => api.patch(`/notes/${id}`, body).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const openCreate = () => {
    setEditingNote(null);
    setForm({ title: "", content: "", tags: "" });
    setDialogOpen(true);
  };

  const openEdit = (note) => {
    setEditingNote(note);
    setForm({
      title: note.title,
      content: note.content || "",
      tags: (note.tags || []).join(", "),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingNote(null);
  };

  const handleSave = () => {
    const body = {
      title: form.title,
      content: form.content,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, body });
    } else {
      createMutation.mutate(body);
    }
  };

  const notes = data?.notes || [];
  const filtered = notes.filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2, pb: 0, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Заметки
        </Typography>
        <TextField
          size="small"
          placeholder="Поиск по тексту или тегам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Новая заметка
        </Button>
      </Box>

      {/* Notes list */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            {search ? "Ничего не найдено" : "У вас ещё нет заметок"}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((note) => (
              <Card key={note.id} variant="outlined">
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {note.title}
                  </Typography>
                  {note.content && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {note.content}
                    </Typography>
                  )}
                  {(note.tags || []).length > 0 && (
                    <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {note.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                  <Tooltip title="Редактировать">
                    <IconButton size="small" onClick={() => openEdit(note)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (window.confirm("Удалить заметку?")) {
                          deleteMutation.mutate(note.id);
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingNote ? "Редактировать заметку" : "Новая заметка"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Заголовок"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Содержание"
            multiline
            minRows={4}
            maxRows={12}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Теги"
            placeholder="тег1, тег2, тег3"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            helperText="Теги через запятую"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.title.trim() || isPending}
          >
            {isPending ? <CircularProgress size={20} /> : editingNote ? "Сохранить" : "Создать"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}