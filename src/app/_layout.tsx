import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import "../global.css";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { userId, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!userId && inAuthGroup) {
      router.replace("/welcome");
    } else if (userId && !inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [userId, segments, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View className="flex-1 bg-zinc-900">
            <StatusBar style="light" />
            <RootLayoutNav />
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
