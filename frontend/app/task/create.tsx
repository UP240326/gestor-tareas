import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createTask } from "../../services/api";

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

export default function CreateTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Campo requerido", "El título no puede estar vacío.");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      router.replace("/");
    } catch {
      Alert.alert("Error", "No se pudo crear la tarea. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

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

          <Text style={styles.headerTitle}>Nueva tarea</Text>

          <TouchableOpacity
            onPress={handleCreate}
            style={styles.headerBtn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text style={[styles.headerBtnText, { color: colors.accent }]}>
                Guardar
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.body}>
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

          <Text style={[styles.label, { marginTop: 20 }]}>
            Descripción (opcional)
          </Text>
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

          <TouchableOpacity
            style={[styles.btnCreate, loading && { opacity: 0.6 }]}
            onPress={handleCreate}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnCreateText}>Crear tarea</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerLabel}>Crear tarea</Text>
        </View>
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
  btnCreate: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 32,
  },
  btnCreateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footerLabel: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    fontSize: 13,
  },
});
