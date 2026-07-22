import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
} from "@mui/material";

const emptyForm = { title: "", content: "", tagInput: "" };

export default function NoteEditor({ open, note, onSave, onClose }) {
  const [form, setForm] = useState(
    note
      ? { title: note.title, content: note.content, tagInput: (note.tags || []).join(", ") }
      : { ...emptyForm }
  );

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    const tags = form.tagInput
      ? form.tagInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (!form.title.trim()) return;

    onSave({
      title: form.title.trim(),
      content: form.content,
      tags,
    });
  };

  const handleClose = () => {
    onClose();
  };

  const isEditing = !!note;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Редактировать заметку" : "Новая заметка"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Заголовок"
          value={form.title}
          onChange={handleChange("title")}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Содержание"
          value={form.content}
          onChange={handleChange("content")}
          margin="dense"
          multiline
          minRows={4}
          maxRows={12}
        />
        <TextField
          fullWidth
          label="Теги (через запятую)"
          value={form.tagInput}
          onChange={handleChange("tagInput")}
          margin="dense"
          placeholder="работа, идеи, личное"
          helperText={
            form.tagInput ? (
              <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {form.tagInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag, i) => (
                    <Chip key={i} label={tag} size="small" />
                  ))}
              </Box>
            ) : undefined
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!form.title.trim()}
        >
          {isEditing ? "Сохранить" : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
