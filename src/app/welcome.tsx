import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-zinc-900 justify-between p-6">
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center">
        <View className="w-32 h-32 bg-violet-600 rounded-full items-center justify-center mb-8 shadow-lg shadow-violet-500/20">
          <Ionicons name="chatbubble-ellipses" size={64} color="#ffffff" />
        </View>

        <Text className="text-white text-4xl font-bold text-center mb-2">
          Vibe Coach
        </Text>
        <Text className="text-zinc-400 text-center text-lg max-w-xs">
          Seu assistente financeiro inteligente para alcançar seus objetivos.
        </Text>
      </View>

      <View className="w-full space-y-4 mb-8">
        <TouchableOpacity
          className="bg-violet-600 w-full p-4 rounded-xl items-center shadow-lg shadow-violet-500/20"
          onPress={() => router.push("/login")}
        >
          <Text className="text-white font-bold text-lg">Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-zinc-800 w-full p-4 rounded-xl items-center border border-zinc-700"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-zinc-300 font-bold text-lg">Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
