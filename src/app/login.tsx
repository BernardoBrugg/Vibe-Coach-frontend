import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useMutation } from "@tanstack/react-query";

import { useAllUsers } from "../hooks/useAllUsers";
import { useAuth } from "../contexts/AuthContext";
import { googleLogin } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { users, isLoading, error, refetch } = useAllUsers();
  const { login, signIn } = useAuth();
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: async (data) => {
      if (data.isNewUser) {
        // New User -> Go to Profile completion
        router.push({
          pathname: "/complete-profile",
          params: { email: data.email, name: data.name },
        });
      } else if (data.token && data.user) {
        // Existing User -> Login direct
        await signIn(data.token, data.user);
        router.replace("/(tabs)");
      }
    },
    onError: (err) => {
      console.error("Google Auth API Error:", err);
      // For demo purposes while backend is being built by user:
      // Alert.alert("Dev Note", "Backend not reachable. Simulating new user flow.");
      // router.push({
      //   pathname: "/complete-profile",
      //   params: { email: "test@gmail.com", name: "Test User" },
      // });
       Alert.alert("Erro", "Falha ao autenticar com Google no backend.");
    },
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // Exchange token with backend
        googleLoginMutation.mutate(authentication.accessToken);
      }
    }
  }, [response]);

  const handleSelectUser = async (userId: string) => {
    try {
      await login(userId);
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-zinc-400 mt-4">Carregando usuários...</Text>
      </View>
    );
  }

  // Removed blocking error state to allow Google Login even if /users fails
  // if (error) { ... }

  return (
    <View className="flex-1 bg-zinc-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="items-center mt-12 mb-8">
            <View className="w-24 h-24 bg-violet-600 rounded-full items-center justify-center mb-6">
              <Ionicons name="chatbubble-ellipses" size={48} color="#ffffff" />
            </View>
            <Text className="text-zinc-100 text-3xl font-bold mb-2">
              Vibe Coach
            </Text>
            <Text className="text-zinc-400 text-center">
              Faça login para continuar
            </Text>
          </View>

          {/* Google Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white p-4 rounded-xl mb-8"
              onPress={() => {
               promptAsync(); 
            }}
          >
            <Ionicons name="logo-google" size={24} color="#000" />
            <Text className="text-black font-bold text-lg ml-3">
              Entrar com Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-px bg-zinc-800" />
            <Text className="text-zinc-500 mx-4">OU</Text>
            <View className="flex-1 h-px bg-zinc-800" />
          </View>

          <Text className="text-zinc-400 mb-4 font-bold">Usuários Locais (Dev)</Text>

          {error ? (
             <View className="bg-zinc-800 rounded-2xl p-6 items-center border border-red-500/20">
               <Ionicons name="lock-closed-outline" size={32} color="#ef4444" />
               <Text className="text-red-400 mt-2 text-center font-bold">
                 Acesso Restrito
               </Text>
               <Text className="text-zinc-500 text-sm mt-1 text-center">
                 A listagem de usuários requer autenticação.
               </Text>
               <Text className="text-zinc-600 text-xs mt-2 text-center">
                 (Error: 401 Unauthorized)
               </Text>
             </View>
          ) : users.length === 0 ? (
            <View className="bg-zinc-800 rounded-2xl p-8 items-center">
              <Ionicons name="person-outline" size={48} color="#71717a" />
              <Text className="text-zinc-400 mt-4 text-center">
                Nenhum usuário encontrado
              </Text>
              <Text className="text-zinc-500 text-sm mt-2 text-center">
                Crie um usuário na API primeiro
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  className="bg-zinc-800 rounded-2xl p-5 flex-row items-center active:bg-zinc-700"
                  onPress={() => handleSelectUser(user.id)}
                >
                  <View className="w-16 h-16 bg-violet-600 rounded-full items-center justify-center mr-4">
                    <Text className="text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-100 text-lg font-bold">
                      {user.name}
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1">
                      {user.email}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#8b5cf6" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
