import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAllUsers } from "../hooks/useAllUsers";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { users, isLoading, error, refetch } = useAllUsers();
  const { login } = useAuth();
  const router = useRouter();

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

  if (error) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center p-6">
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text className="text-red-500 text-center mt-4 text-lg">
          Erro ao carregar usuários
        </Text>
        <Text className="text-zinc-500 text-center mt-2">
          Verifique se a API está rodando em http://192.168.0.11:5010
        </Text>
        <Text className="text-zinc-500 text-center mt-2 text-xs">
          Certifique-se de que seu celular e computador estão na mesma rede Wi-Fi
        </Text>
        <TouchableOpacity
          className="mt-6 bg-violet-600 px-8 py-4 rounded-xl"
          onPress={() => refetch()}
        >
          <Text className="text-white font-bold text-lg">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              Selecione um usuário para continuar
            </Text>
          </View>

          {users.length === 0 ? (
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
