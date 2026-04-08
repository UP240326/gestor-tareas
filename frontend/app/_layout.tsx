import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

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

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.card,
    border: colors.border,
    primary: colors.accent,
    text: colors.textPrimary,
    notification: colors.red,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={appTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.bg },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="task/create" />
        <Stack.Screen name="task/[id]" />
        <Stack.Screen name="task/edit/[id]" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
