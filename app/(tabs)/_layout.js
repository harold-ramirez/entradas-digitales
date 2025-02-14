import { Tabs } from "expo-router";
import {
  HomeIcon,
  ScanQRIcon,
  TicketIcon,
  EventIcon,
} from "../../components/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanQRcode"
        options={{
          title: "Escanear QR",
          tabBarIcon: ({ color }) => <ScanQRIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="myTickets"
        options={{
          title: "Mis Entradas",
          tabBarIcon: ({ color }) => <TicketIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="createEvent"
        options={{
          title: "Crear Evento",
          tabBarIcon: ({ color }) => <EventIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
