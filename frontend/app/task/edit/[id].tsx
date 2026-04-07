import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteTask,
  getTaskById,
  toggleTask,
  updateTask,
} from "../../../services/api";

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

const colors = {
  bg: "#111318",
  card: "#1A1D28",
  cardDone: "#151820",
  border: "#2a2d36",
  accent: "#4A9EFF",
  green: "#4CAF72",
  red: "#FF5C5C",
  textPrimary: "#E8E8F0",
  textSecondary: "#555868",
};

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTask = async () => {
    if (!id) return;
    setLoadingData(true);
    try {
      const data = await getTaskById(Number(id));
      setTask(data);
      setTitle(data.title);
      setDescription(data.description ?? "");
      setCompleted(data.completed);
    } catch {
      Alert.alert("Error", "No se pudo cargar la tarea.");
      router.back();
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "El título no puede estar vacío.");
      return;
    }
    setSaving(true);
    try {
      await updateTask(Number(id), {
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Si el estado completed cambió, hacer toggle
      if (task && completed !== task.completed) {
        await toggleTask(Number(id));
      }

      router.back();
    } catch {
      Alert.alert("Error", "No se pudo guardar los cambios. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteTask(Number(id));
              router.replace("/");
            } catch {
              Alert.alert("Error", "No se pudo eliminar la tarea.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <Text style={styles.headerBtnText}>‹ Cancelar</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar tarea</Text>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.headerBtn}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={[styles.headerBtnText, { color: colors.accent }]}>
                Guardar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
          {/* Title input */}
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={[styles.input, titleFocused && styles.inputFocused]}
            placeholder="Título"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            maxLength={100}
          />

          {/* Description input */}
          <Text style={[styles.label, { marginTop: 20 }]}>Descripción</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputMultiline,
              descFocused && styles.inputFocused,
            ]}
            placeholder="Descripción (opcional)"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setDescFocused(true)}
            onBlur={() => setDescFocused(false)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />

          {/* Completed toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {completed ? "Completada" : "Pendiente"}
            </Text>
            <Switch
              value={completed}
              onValueChange={setCompleted}
              trackColor={{ false: colors.border, true: colors.green }}
              thumbColor="#fff"
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.btnSave, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnSaveText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={styles.btnDelete}
            onPress={handleDelete}
            disabled={deleting}
            activeOpacity={0.7}
          >
            {deleting ? (
              <ActivityIndicator color={colors.red} size="small" />
            ) : (
              <Text style={styles.btnDeleteText}>Eliminar tarea</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    minWidth: 80,
  },
  headerBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: colors.accent,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 20,
  },
  toggleLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  btnSave: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  btnSaveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  btnDelete: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
  },
  btnDeleteText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: "500",
  },
});
