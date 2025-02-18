import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Screen } from "../../components/Screen";
import { TicketCard } from "../../components/TicketCard";
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  RefreshControl,
} from "react-native";

export default function MyTickets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const storedTickets = await AsyncStorage.getItem("Stored-Tickets");
      if (storedTickets) {
        setItems(JSON.parse(storedTickets));
      }
    } catch (error) {
      console.error("Error al cargar los tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <Screen>
      <View className="flex-row justify-center mb-4">
        <Text className="text-3xl text-white font-bold">
          Entradas Registradas
        </Text>
      </View>

      <View className="flex-1">
        {loading ? (
          <ActivityIndicator color={"#fff"} size={"large"} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.ticketId}
            renderItem={({ item, index }) => (
              <TicketCard ticket={item} index={index} />
            )}
            contentContainerStyle={{ gap: 16, flexGrow: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000"]}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="bg-black/50 text-white text-lg text-center italic rounded-lg p-3 w-3/4">
                  Aún no tienes ninguna{"\n"}entrada registrada... 😔
                </Text>
              </View>
            }
          />
        )}
      </View>
      <View>
        <Text className="text-white text-center text-md italic">
          Si no encuentra su entrada después de escanear el código QR, intente
          actualizar deslizando hacia abajo
        </Text>
      </View>
    </Screen>
  );
}
