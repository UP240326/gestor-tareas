import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import TaskForm from '../../components/TaskForm';
import { createTask } from '../../services/api';

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

export default function CreateTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const isDisabled = title.trim().length === 0 || saving;

  const handleCreate = async () => {
    if (isDisabled) {
      return;
    }

    setSaving(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
      });
      router.replace('/');
    } catch (error) {
      console.error('Error creating task:', error);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Text style={styles.headerAction}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva tarea</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isDisabled}
          onPress={handleCreate}
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

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isDisabled}
          onPress={handleCreate}
          style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
        >
          {saving ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Crear tarea</Text>
          )}
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
});
