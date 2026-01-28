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
import { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";


import { useAuth } from "../contexts/AuthContext";
import { googleLogin } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, login } = useAuth(); // login is the old insecure one, keeping for fallback
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* 
   * CRITICAL: redirection URI configuration is tricky for Expo.
   * We use makeRedirectUri to handle both Expo Go (development) and Native Builds (production).
   */
  const config = {
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: "vibe-coach-app",
      path: "oauth2redirect"
    }),
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const googleLoginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: async (data) => {
      if (data.isNewUser) {
        // Redirect to complete profile
         router.push({
          pathname: "/complete-profile",
          params: { email: data.email, name: data.name },
        });
      } else if (data.token && data.user) {
        await signIn(data.token, data.user);
        router.replace("/(tabs)");
      }
    },
    onError: (err) => {
      console.error("Google Auth API Error:", err);
       Alert.alert("Erro", "Falha ao autenticar com Google no backend.");
    },
  });

  const handleGoogleLogin = async () => {
    // Validating if Client IDs are set before attempting to login
    if (!config.androidClientId && !config.iosClientId && !config.webClientId) {
       Alert.alert(
        "Configuração Pendente", 
        "Client IDs do Google não configurados no .env"
      );
      return;
    }
    
    try {
      await promptAsync();
    } catch (e) {
      console.error("Google Prompt Error:", e);
      Alert.alert("Erro", "Falha ao iniciar login com Google");
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        googleLoginMutation.mutate(authentication.accessToken);
      }
    }
  }, [response]);


  const handleEmailLogin = async () => {
      if (!email || !password) {
          Alert.alert("Campos obrigatórios", "Por favor, preencha email e senha.");
          return;
      }
      
      setIsLoading(true);
      
      // MOCK BEHAVIOR: 
      // Since the backend doesn't support password auth yet, we'll try to find a user by ID if the "email" matches an ID 
      // OR mostly just alert asking to use Google as this is Likely a "Demo" logic request.
      // BUT, to be helpful, if the user typed an email, and we have the "useAllUsers" hook, we could try to match it.
      // However, for security and cleaner architecture, let's just assume this feature is "Coming Soon" or 
      // strictly for the Google flow if backend isn't ready.
      
      // ACTUAL IMPL based on user request "Manual Auth":
      // User likely created an account via the "Signup" flow we just made (which goes to complete-profile -> registerUser).
      // That registerUser returns a TOKEN and USER.
      // But we don't have a "login with password" endpoint in api.ts.
      
      setTimeout(() => {
          setIsLoading(false);
          Alert.alert(
              "Login com Senha", 
              "Esta funcionalidade requer suporte do backend (endpoint /auth/login). Por enquanto, use 'Criar Conta' para cadastrar um novo usuário ou Google Login."
          );
      }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-zinc-900"
    >
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center mt-6 mb-8">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#a1a1aa" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Entrar</Text>
        </View>

        <View className="items-center mb-8">
            <View className="w-24 h-24 bg-violet-600 rounded-full items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
              <Ionicons name="chatbubble-ellipses" size={48} color="#ffffff" />
            </View>
            <Text className="text-zinc-100 text-3xl font-bold mb-2">
              Vibe Coach
            </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-zinc-400 mb-2">E-mail</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="seu@email.com"
              placeholderTextColor="#71717a"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="text-zinc-400 mb-2">Senha</Text>
            <TextInput
              className="bg-zinc-800 text-white p-4 rounded-xl"
              placeholder="******"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            className="bg-violet-600 p-4 rounded-xl items-center mt-4"
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Text className="text-white font-bold text-lg">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-zinc-800" />
            <Text className="text-zinc-500 mx-4">OU</Text>
            <View className="flex-1 h-px bg-zinc-800" />
        </View>

         {/* Google Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white p-4 rounded-xl mb-6"
                onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={24} color="#000" />
            <Text className="text-black font-bold text-lg ml-3">
              Entrar com Google
            </Text>
          </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
