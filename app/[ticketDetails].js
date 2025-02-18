import { View, Text, Image } from "react-native";
import { Screen } from "../components/Screen";
import { Stack, useLocalSearchParams } from "expo-router";
import event_bg from "../assets/event-bg.webp";
import qrCode from "../assets/qrExample.png";

export default function TicketDetails() {
  const { ticket } = useLocalSearchParams();
  const ticketData = ticket ? JSON.parse(ticket) : null;

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#64748b" },
          headerTintColor: "white",
          headerLeft: () => {},
          headerTitle: "Detalles Entrada Digital",
          headerRight: () => {},
        }}
      />

      <View className="flex-1 items-center">
        <Text className="bg-red-900 text-white w-full p-2 text-center text-3xl font-bold rounded-md">
          {ticketData?.eventData.name}
        </Text>
        <View className="flex-1 items-center">
          <Image
            source={event_bg}
            style={{ width: 300, height: 300 }}
            className="my-3 rounded-xl border border-slate-300"
          />
          <View className="w-full p-5 flex-row gap-3 items-center">
            <View className="flex-1">
              <Text className="text-white text-right text-xl font-bold">
                📆 Fecha Evento:
              </Text>
              <Text className="text-white text-right text-xl font-bold">
                📍 Lugar:
              </Text>
              <Text className="text-white text-right text-xl font-bold">
                🎫 Estado:
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl">
                {ticketData?.eventData.date}
              </Text>
              <Text className="text-white text-xl">
                {ticketData?.eventData.ubi}
              </Text>
              <Text className="text-white text-xl">{ticketData?.state}</Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center">
            <Image
              source={qrCode}
              style={{ width: 150, height: 150 }}
              className="rounded-xl"
            />
          </View>
        </View>
        <View className="my-2">
          <Text className="text-red-300 italic text-center">
            *Esta entrada es válida y necesaria{"\n"}para el ingreso al evento
          </Text>
        </View>
      </View>
    </Screen>
  );
}
