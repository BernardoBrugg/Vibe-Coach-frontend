import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useTransactions } from "../../hooks/useTransactions";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Transaction } from "../../types";

export default function DashboardScreen() {
  const { userId } = useAuth();
  const { transactions, isLoading, createTransaction, deleteTransaction } =
    useTransactions(userId || "");
  const { user } = useUser(userId || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    title: "",
    amount: "",
    category: "",
    type: "EXPENSE" as "INCOME" | "EXPENSE",
  });

  const handleAddTransaction = () => {
    if (
      newTransaction.title &&
      newTransaction.amount &&
      newTransaction.category &&
      userId
    ) {
      createTransaction({
        userId: userId,
        title: newTransaction.title,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        type: newTransaction.type,
        frequency: "UNIQUE",
      });
      setNewTransaction({
        title: "",
        amount: "",
        category: "",
        type: "EXPENSE",
      });
      setModalVisible(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const income =
    transactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  const expenses =
    transactions
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

  return (
    <View className="flex-1 bg-zinc-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Balance Overview */}
          <View className="bg-violet-600 rounded-2xl p-6 mb-6">
            <Text className="text-violet-200 text-sm mb-2">
              Saldo Disponível
            </Text>
            <Text className="text-white text-4xl font-bold mb-6">
              R$ {parseFloat(user?.currentBalance || "0").toFixed(2)}
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-violet-200 text-xs mb-1">Receitas</Text>
                <Text className="text-white text-lg font-semibold">
                  +R$ {income.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text className="text-violet-200 text-xs mb-1">Despesas</Text>
                <Text className="text-white text-lg font-semibold">
                  -R$ {expenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Transactions List */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-zinc-100 text-xl font-bold">Transações</Text>
            <TouchableOpacity
              className="bg-violet-600 px-4 py-2 rounded-lg"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white font-semibold">+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          {transactions?.length === 0 ? (
            <View className="bg-zinc-800 rounded-2xl p-8 items-center">
              <Ionicons name="receipt-outline" size={48} color="#71717a" />
              <Text className="text-zinc-400 mt-4">
                Nenhuma transação ainda
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {transactions?.map((transaction: Transaction) => (
                <View
                  key={transaction.id}
                  className="bg-zinc-800 rounded-xl p-4 flex-row justify-between items-center"
                >
                  <View className="flex-1">
                    <Text className="text-zinc-100 font-semibold text-lg">
                      {transaction.title}
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1">
                      {transaction.category}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text
                      className={`text-lg font-bold ${
                        transaction.type === "INCOME"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}R${" "}
                      {parseFloat(transaction.amount).toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => deleteTransaction(transaction.id)}
                      className="mt-2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-zinc-900 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-zinc-100 text-xl font-bold">
                Nova Transação
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#71717a" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-zinc-400 mb-2">Tipo</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`flex-1 p-3 rounded-lg ${
                      newTransaction.type === "EXPENSE"
                        ? "bg-red-600"
                        : "bg-zinc-800"
                    }`}
                    onPress={() =>
                      setNewTransaction({ ...newTransaction, type: "EXPENSE" })
                    }
                  >
                    <Text className="text-white text-center font-semibold">
                      Despesa
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 p-3 rounded-lg ${
                      newTransaction.type === "INCOME"
                        ? "bg-green-600"
                        : "bg-zinc-800"
                    }`}
                    onPress={() =>
                      setNewTransaction({ ...newTransaction, type: "INCOME" })
                    }
                  >
                    <Text className="text-white text-center font-semibold">
                      Receita
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                className="bg-zinc-800 text-zinc-100 p-4 rounded-lg"
                placeholder="Título"
                placeholderTextColor="#71717a"
                value={newTransaction.title}
                onChangeText={(text) =>
                  setNewTransaction({ ...newTransaction, title: text })
                }
              />

              <TextInput
                className="bg-zinc-800 text-zinc-100 p-4 rounded-lg"
                placeholder="Valor"
                placeholderTextColor="#71717a"
                keyboardType="numeric"
                value={newTransaction.amount}
                onChangeText={(text) =>
                  setNewTransaction({ ...newTransaction, amount: text })
                }
              />

              <TextInput
                className="bg-zinc-800 text-zinc-100 p-4 rounded-lg"
                placeholder="Categoria"
                placeholderTextColor="#71717a"
                value={newTransaction.category}
                onChangeText={(text) =>
                  setNewTransaction({ ...newTransaction, category: text })
                }
              />

              <TouchableOpacity
                className="bg-violet-600 p-4 rounded-lg mt-4"
                onPress={handleAddTransaction}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Adicionar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
