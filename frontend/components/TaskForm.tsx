import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface TaskFormProps {
    title: string;
    description: string;
    onChangeTitle: (value: string) => void;
    onChangeDescription: (value: string) => void;
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

export default function TaskForm({
    title,
    description,
    onChangeTitle,
    onChangeDescription,
}: TaskFormProps) {
    const [focusedField, setFocusedField] = useState<'title' | 'description' | null>(null);

    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <Text style={styles.label}>Titulo</Text>
                <TextInput
                    onBlur={() => setFocusedField(null)}
                    onChangeText={onChangeTitle}
                    onFocus={() => setFocusedField('title')}
                    placeholder="Escribe el titulo de la tarea"
                    placeholderTextColor={colors.textSecondary}
                    selectionColor={colors.accent}
                    style={[
                        styles.input,
                        focusedField === 'title' && styles.inputFocused,
                    ]}
                    value={title}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Descripcion</Text>
                <TextInput
                    multiline
                    numberOfLines={5}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={onChangeDescription}
                    onFocus={() => setFocusedField('description')}
                    placeholder="Agrega detalles opcionales"
                    placeholderTextColor={colors.textSecondary}
                    selectionColor={colors.accent}
                    style={[
                        styles.input,
                        styles.multilineInput,
                        focusedField === 'description' && styles.inputFocused,
                    ]}
                    textAlignVertical="top"
                    value={description}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 18,
    },
    field: {
        gap: 8,
    },
    label: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        color: colors.textPrimary,
        fontSize: 15,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    inputFocused: {
        borderColor: colors.accent,
    },
    multilineInput: {
        minHeight: 130,
    },
});
