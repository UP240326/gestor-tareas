import { useRouter } from 'expo-router';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { deleteTask, toggleTask } from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onRefresh: () => void;
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

export default function TaskCard({ task, onRefresh }: TaskCardProps) {
  const router = useRouter();

  const handleCardPress = () => {
    router.push({
      pathname: '/task/[id]',
      params: { id: String(task.id) },
    });
  };

  const handleToggle = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    await toggleTask(task.id);
    onRefresh();
  };

  const handleEdit = (event: GestureResponderEvent) => {
    event.stopPropagation();
    router.push({
      pathname: '/task/edit/[id]',
      params: { id: String(task.id) },
    });
  };

  const handleDelete = async (event: GestureResponderEvent) => {
    event.stopPropagation();
    await deleteTask(task.id);
    onRefresh();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleCardPress}
      style={[
        styles.card,
        task.completed ? styles.cardCompleted : styles.cardPending,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text numberOfLines={2} style={styles.description}>
            {task.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggle}
          style={[
            styles.badge,
            task.completed ? styles.badgeDone : styles.badgePending,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: task.completed ? colors.green : colors.accent },
            ]}
          >
            {task.completed ? 'Completada' : 'Pendiente'}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEdit}
            style={styles.iconButton}
          >
            <Text style={[styles.iconText, styles.editText]}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDelete}
            style={styles.iconButton}
          >
            <Text style={[styles.iconText, styles.deleteText]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  cardPending: {
    backgroundColor: colors.card,
  },
  cardCompleted: {
    backgroundColor: colors.cardDone,
  },
  content: {
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  titleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgePending: {
    backgroundColor: '#1E2A3A',
  },
  badgeDone: {
    backgroundColor: '#1A2B1E',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  editText: {
    color: colors.accent,
  },
  deleteText: {
    color: colors.red,
  },
});
