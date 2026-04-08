import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import TaskForm from '../../../components/TaskForm';
import { deleteTask, getTaskById, toggleTask, updateTask } from '../../../services/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

const colors = {
  bg: '#111318',
  card: '#1A1D28',
  cardDone: '#151820',
  border: '#2a2d36',
  accent: '#4A9EFF',
  green: '#4CAF72',
  red: '#FF5C5C',
  textPrimary: '#E8E8F0',
  textSecondary: '#555868',
};

export default function EditTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const taskId = Number(rawId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const loadTask = useCallback(async () => {
    if (!Number.isFinite(taskId)) {
      setLoading(false);
      return;
    }

    try {
      const data = (await getTaskById(taskId)) as Task;
      setTitle(data.title);
      setDescription(data.description ?? '');
      setCompleted(data.completed);
    } catch (error) {
      console.error('Error loading task:', error);
    } finally {
      setLoading(false);
      setToggling(false);
    }
  }, [taskId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void loadTask();
    }, [loadTask])
  );

  const isDisabled = title.trim().length === 0 || saving;

  const handleSave = async () => {
    if (isDisabled || !Number.isFinite(taskId)) {
      return;
    }

    setSaving(true);
    try {
      await updateTask(taskId, {
        title: title.trim(),
        description: description.trim(),
      });
      router.back();
    } catch (error) {
      console.error('Error updating task:', error);
      setSaving(false);
    }
  };

  const handleToggleCompleted = async () => {
    if (!Number.isFinite(taskId) || toggling) {
      return;
    }

    setCompleted((current) => !current);
    setToggling(true);

    try {
      await toggleTask(taskId);
      await loadTask();
    } catch (error) {
      console.error('Error toggling task:', error);
      setCompleted((current) => !current);
      setToggling(false);
    }
  };

  const handleDelete = () => {
    if (!Number.isFinite(taskId)) {
      return;
    }

    Alert.alert('Eliminar tarea', 'Esta accion no se puede deshacer.', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(taskId);
            router.replace('/');
          } catch (error) {
            console.error('Error deleting task:', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.headerAction}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar tarea</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isDisabled}
          onPress={handleSave}
        >
          <Text style={[styles.headerAction, styles.headerActionRight, isDisabled && styles.disabledText]}>
            Guardar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TaskForm
          description={description}
          onChangeDescription={setDescription}
          onChangeTitle={setTitle}
          title={title}
        />

        <View style={styles.switchCard}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchTitle}>Completada</Text>
            <Text style={styles.switchSubtitle}>
              Cambia el estado actual de la tarea.
            </Text>
          </View>
          <Switch
            disabled={toggling}
            onValueChange={handleToggleCompleted}
            thumbColor={colors.textPrimary}
            trackColor={{ false: colors.border, true: colors.green }}
            value={completed}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isDisabled}
          onPress={handleSave}
          style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
        >
          {saving ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={handleDelete} style={styles.deleteTextButton}>
          <Text style={styles.deleteText}>Eliminar tarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerAction: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
    width: 82,
  },
  headerActionRight: {
    textAlign: 'right',
  },
  disabledText: {
    opacity: 0.45,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 24,
  },
  switchCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchTextGroup: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  switchSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteTextButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: '700',
  },
});
