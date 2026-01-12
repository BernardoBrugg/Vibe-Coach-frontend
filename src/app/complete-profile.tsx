import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function CompleteProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signIn } = useAuth();
  
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");

  const email = params.email as string;
  const name = params.name as string;

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      await signIn(data.token, data.user);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      Alert.alert(
        "Erro no Cadastro",
        "Não foi possível completar seu cadastro. Tente novamente."
      );
    },
  });

  const handleComplete = () => {
    if (!income || !expenses) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    registerMutation.mutate({
      email,
      name,
      monthlyIncome: parseFloat(income.replace(",", ".")),
      fixedExpenses: parseFloat(expenses.replace(",", ".")),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-zinc-900"
    >
      <ScrollView className="flex-1 p-6">
        <View className="items-center mt-12 mb-8">
          <View className="w-20 h-20 bg-violet-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
          <Text className="text-white text-2xl font-bold text-center">
            Complete seu Perfil
          </Text>
          <Text className="text-zinc-400 text-center mt-2">
            Olá, {name}! Precisamos de mais algumas informações para começar.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-zinc-400 mb-2">Renda Mensal (R$)</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="0,00"
              placeholderTextColor="#71717a"
              keyboardType="numeric"
              value={income}
              onChangeText={setIncome}
            />
          </View>

          <View>
            <Text className="text-zinc-400 mb-2">Despesas Fixas Mensais (R$)</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="0,00"
              placeholderTextColor="#71717a"
              keyboardType="numeric"
              value={expenses}
              onChangeText={setExpenses}
            />
            <Text className="text-zinc-500 text-xs mt-1">
              Aluguel, contas, internet, etc.
            </Text>
          </View>

          <TouchableOpacity
            className="bg-violet-600 p-4 rounded-xl items-center mt-6"
            onPress={handleComplete}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Finalizar Cadastro
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
