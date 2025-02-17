import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import { RightIcon } from "./Icons";
import ticketImg from "../assets/digitalTicket.jpg";

export function TicketCard({ ticket }) {
  return (
    <Link
      href={{
        pathname: `/${ticket.eventId}`,
        params: { ticket: JSON.stringify(ticket) },
      }}
      asChild
      className="bg-slate-500 active:bg-slate-700 border border-white p-2 rounded-xl"
    >
      <Pressable>
        <View className="flex-row gap-3">
          <Image
            source={ticketImg}
            style={{ width: 100, height: 75 }}
            className="rounded-md border border-white"
          />
          <View className="flex-1 justify-center">
            <Text className="font-bold text-2xl text-white">
              {ticket.eventData.name}
            </Text>
            <Text className="text-lg text-white">{ticket.eventData.date}</Text>
          </View>
          <View className="justify-center p-4">
            <RightIcon color="white" size={32} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
