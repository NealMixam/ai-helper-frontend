import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  InputAdornment,
  CircularProgress,
  Collapse,
  Divider,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import NoteEditor from "../components/NoteEditor";

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [analysisError, setAnalysisError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => api.get("/notes?limit=100").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/notes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setEditorOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/notes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setEditorOpen(false);
      setEditingNote(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: (id) => api.post(`/notes/${id}/analyze`),
    onSuccess: (res, noteId) => {
      setAnalysisResults((prev) => ({
        ...prev,
        [noteId]: res.data.analysis,
      }));
      setAnalyzingId(null);
      setAnalysisError(null);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err) => {
      setAnalyzingId(null);
      setAnalysisError(err.response?.data?.error || "Ошибка при анализе");
    },
  });

  const notes = data?.notes || [];

  const filtered = notes.filter((note) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      (note.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleCreate = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleSave = (formData) => {
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (note) => {
    if (window.confirm(`Удалить заметку «${note.title}»?`)) {
      deleteMutation.mutate(note.id);
    }
  };

  const handleAnalyze = (noteId) => {
    setAnalyzingId(noteId);
    setAnalysisError(null);
    analyzeMutation.mutate(noteId);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditingNote(null);
  };

  const getAnalysisData = (note) => {
    if (analysisResults[note.id]) return analysisResults[note.id];
    if (note.ai_summary) {
      return { summary: note.ai_summary, tags: [], tasks: [] };
    }
    return null;
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
        <TextField
          size="small"
          placeholder="Поиск по заметкам..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Заметка
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, pt: 0 }}>
        {analysisError && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setAnalysisError(null)}>
            {analysisError}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
            {search ? "Ничего не найдено" : "Нет заметок. Создайте первую!"}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((note) => {
              const isAnalyzing = analyzingId === note.id;
              const analysis = getAnalysisData(note);

              return (
                <Card key={note.id} variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {note.title}
                    </Typography>
                    {note.content && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "pre-wrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {note.content}
                      </Typography>
                    )}
                    {note.tags?.length > 0 && (
                      <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {note.tags.map((tag, i) => (
                          <Chip key={i} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                    )}

                    {/* Analysis results */}
                    {analysis && (
                      <Collapse in={!!analysis}>
                        <Box sx={{ mt: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}>
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="primary"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                          >
                            <AutoAwesomeIcon fontSize="inherit" />
                            AI-анализ
                          </Typography>
                          {analysis.summary && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {analysis.summary}
                            </Typography>
                          )}
                          {analysis.tags?.length > 0 && (
                            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
                              {analysis.tags.map((tag, i) => (
                                <Chip key={i} label={tag} size="small" color="primary" variant="filled" />
                              ))}
                            </Box>
                          )}
                          {analysis.tasks?.length > 0 && (
                            <>
                              <Typography variant="caption" fontWeight="bold" sx={{ display: "block", mb: 0.5 }}>
                                📋 Задачи:
                              </Typography>
                              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                                {analysis.tasks.map((task, i) => (
                                  <Typography key={i} component="li" variant="body2">
                                    {task}
                                  </Typography>
                                ))}
                              </Box>
                            </>
                          )}
                        </Box>
                      </Collapse>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={
                        isAnalyzing ? (
                          <CircularProgress size={14} />
                        ) : (
                          <AutoAwesomeIcon fontSize="small" />
                        )
                      }
                      onClick={() => handleAnalyze(note.id)}
                      disabled={isAnalyzing}
                      color={analysis ? "success" : "primary"}
                    >
                      {isAnalyzing ? "Анализ..." : "Анализировать"}
                    </Button>
                    <IconButton size="small" onClick={() => handleEdit(note)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(note)}
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

      <NoteEditor
        open={editorOpen}
        note={editingNote}
        onSave={handleSave}
        onClose={handleCloseEditor}
      />
    </Box>
  );
}