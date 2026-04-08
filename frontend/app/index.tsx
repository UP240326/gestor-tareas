import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import TaskCard from '../components/TaskCard';
import { getTasks } from '../services/api';

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

export default function HomeScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const data = (await getTasks()) as Task[];
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchTasks();
    }, [fetchTasks])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
  }, [fetchTasks]);

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerDate}>{currentDate}</Text>
        <Text style={styles.headerTitle}>Mis tareas</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={handleRefresh}
            refreshing={refreshing}
            tintColor={colors.accent}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            PENDIENTES ({pendingTasks.length})
          </Text>
          {pendingTasks.length > 0 ? (
            pendingTasks.map((task) => (
              <TaskCard key={task.id} onRefresh={handleRefresh} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay tareas pendientes.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            COMPLETADAS ({completedTasks.length})
          </Text>
          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <TaskCard key={task.id} onRefresh={handleRefresh} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No hay tareas completadas.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push('/task/create')}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: colors.bg,
    paddingTop: 60,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerDate: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  fabText: {
    color: colors.textPrimary,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '500',
  },
});
