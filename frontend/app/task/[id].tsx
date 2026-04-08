import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { deleteTask, getTaskById, toggleTask } from '../../services/api';

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

export default function TaskDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const taskId = Number(rawId);

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const loadTask = useCallback(async () => {
        if (!Number.isFinite(taskId)) {
            setTask(null);
            setLoading(false);
            return;
        }

        try {
            const data = (await getTaskById(taskId)) as Task;
            setTask(data);
        } catch (error) {
            console.error('Error loading task:', error);
            setTask(null);
        } finally {
            setLoading(false);
            setUpdatingStatus(false);
        }
    }, [taskId]);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            void loadTask();
        }, [loadTask])
    );

    const handleToggleStatus = async () => {
        if (!Number.isFinite(taskId)) {
            return;
        }

        setUpdatingStatus(true);
        try {
            await toggleTask(taskId);
            await loadTask();
        } catch (error) {
            console.error('Error toggling task:', error);
            setUpdatingStatus(false);
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

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('es-MX', {
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

    if (!task) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.notFoundText}>No se encontro la tarea.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
                    <Text style={styles.headerAction}>Volver</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View
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
                    </View>

                    <Text style={[styles.title, task.completed && styles.titleCompleted]}>
                        {task.title}
                    </Text>

                    <Text style={styles.description}>
                        {task.description && task.description.trim().length > 0
                            ? task.description
                            : 'Sin descripcion.'}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Creada</Text>
                        <Text style={styles.metaValue}>{formatDate(task.created_at)}</Text>
                    </View>
                </View>

                <View style={styles.switchCard}>
                    <View style={styles.switchTextGroup}>
                        <Text style={styles.switchTitle}>Estado</Text>
                        <Text style={styles.switchSubtitle}>
                            Cambia rapidamente entre pendiente y completada.
                        </Text>
                    </View>
                    <Switch
                        disabled={updatingStatus}
                        onValueChange={handleToggleStatus}
                        thumbColor={colors.textPrimary}
                        trackColor={{ false: colors.border, true: colors.green }}
                        value={task.completed}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() =>
                        router.push({
                            pathname: '/task/edit/[id]',
                            params: { id: String(task.id) },
                        })
                    }
                    style={styles.editButton}
                >
                    <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleDelete}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
            </ScrollView>
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
    notFoundText: {
        color: colors.textSecondary,
        fontSize: 15,
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
        width: 64,
    },
    headerTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    headerSpacer: {
        width: 64,
    },
    content: {
        padding: 20,
        gap: 18,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 18,
        gap: 14,
    },
    badge: {
        alignSelf: 'flex-start',
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
    title: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
    },
    titleCompleted: {
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    description: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
    metaRow: {
        gap: 4,
    },
    metaLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    metaValue: {
        color: colors.textPrimary,
        fontSize: 14,
    },
    switchCard: {
        backgroundColor: colors.card,
        borderRadius: 18,
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
    editButton: {
        backgroundColor: colors.accent,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    editButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    deleteButton: {
        backgroundColor: colors.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.red,
        paddingVertical: 16,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: colors.red,
        fontSize: 16,
        fontWeight: '700',
    },
});
