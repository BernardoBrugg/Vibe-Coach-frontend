import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-zinc-900">
      <View className="p-6">
        {/* App Settings */}
        <View className="mb-8">
          <Text className="text-zinc-100 text-xl font-bold mb-4">
            Configurações do App
          </Text>

          <View className="bg-zinc-800 rounded-2xl overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="notifications" size={24} color="#8b5cf6" />
                <View className="ml-4">
                  <Text className="text-zinc-100 font-semibold">
                    Notificações
                  </Text>
                  <Text className="text-zinc-400 text-sm">
                    Receber alertas de gastos
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#27272a", true: "#8b5cf6" }}
                thumbColor="#ffffff"
              />
            </View>

            <View className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="moon" size={24} color="#8b5cf6" />
                <View className="ml-4">
                  <Text className="text-zinc-100 font-semibold">
                    Modo Escuro
                  </Text>
                  <Text className="text-zinc-400 text-sm">
                    Ativado por padrão
                  </Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#27272a", true: "#8b5cf6" }}
                thumbColor="#ffffff"
              />
            </View>

            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1">
                <Ionicons name="finger-print" size={24} color="#8b5cf6" />
                <View className="ml-4">
                  <Text className="text-zinc-100 font-semibold">Biometria</Text>
                  <Text className="text-zinc-400 text-sm">
                    Usar impressão digital
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: "#27272a", true: "#8b5cf6" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-zinc-100 text-xl font-bold mb-4">Conta</Text>

          <View className="bg-zinc-800 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="person" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Editar Perfil
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="lock-closed" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Alterar Senha
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1">
                <Ionicons name="card" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Métodos de Pagamento
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View className="mb-8">
          <Text className="text-zinc-100 text-xl font-bold mb-4">Suporte</Text>

          <View className="bg-zinc-800 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="help-circle" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Central de Ajuda
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-700">
              <View className="flex-row items-center flex-1">
                <Ionicons name="document-text" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Termos de Uso
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1">
                <Ionicons name="shield-checkmark" size={24} color="#8b5cf6" />
                <Text className="text-zinc-100 font-semibold ml-4">
                  Privacidade
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="bg-red-600 rounded-xl p-4 items-center"
          onPress={handleLogout}
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out" size={24} color="#ffffff" />
            <Text className="text-white font-bold text-lg ml-2">Sair</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-zinc-500 text-center mt-8">
          Vibe Coach v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
