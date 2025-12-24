import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { userId } = useAuth();
  const { user, isLoading, error, refetch } = useUser(userId || "");

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center p-4">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-red-500 text-center mt-4">
          Erro ao carregar perfil
        </Text>
        <TouchableOpacity
          className="mt-4 bg-violet-600 px-6 py-3 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-semibold">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-violet-600 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-zinc-100 text-2xl font-bold">{user?.name}</Text>
          <Text className="text-zinc-400 text-sm mt-1">{user?.email}</Text>
        </View>

        {/* Balance Card */}
        <View className="bg-zinc-800 rounded-2xl p-6 mb-6">
          <Text className="text-zinc-400 text-sm mb-2">Saldo Atual</Text>
          <Text className="text-zinc-100 text-4xl font-bold">
            R$ {parseFloat(user?.currentBalance || "0").toFixed(2)}
          </Text>
        </View>

        {/* Income & Expenses */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-zinc-800 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="arrow-down" size={20} color="#22c55e" />
              <Text className="text-zinc-400 text-sm ml-2">Renda Mensal</Text>
            </View>
            <Text className="text-zinc-100 text-xl font-bold">
              R$ {parseFloat(user?.monthlyIncome || "0").toFixed(2)}
            </Text>
          </View>

          <View className="flex-1 bg-zinc-800 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="arrow-up" size={20} color="#ef4444" />
              <Text className="text-zinc-400 text-sm ml-2">Despesas Fixas</Text>
            </View>
            <Text className="text-zinc-100 text-xl font-bold">
              R$ {parseFloat(user?.fixedExpenses || "0").toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="bg-zinc-800 rounded-2xl p-6">
          <Text className="text-zinc-100 text-lg font-bold mb-4">
            Informações da Conta
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between py-2 border-b border-zinc-700">
              <Text className="text-zinc-400">ID do Usuário</Text>
              <Text className="text-zinc-300 text-xs">{user?.id}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
