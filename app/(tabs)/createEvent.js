import { Screen } from "../../components/Screen";
import { View, Text, TextInput, Pressable, Image } from "react-native";

import event_bg from "../../assets/event-bg.webp";

export default function CreateEvent() {
  return (
    <Screen>
      <View className="flex-1 items-center gap-5">
        <Text className="text-2xl text-white text-center font-bold">
          Crear Nuevo Evento
        </Text>
        <Image source={event_bg} style={{ width: 300, height: 200 }} />
        <View className="flex-row w-full items-center">
          <Text className="flex-1 text-lg text-white">Nombre del Evento:</Text>
          <TextInput
            keyboardType="default"
            placeholder="TunaFest 2025"
            className="bg-slate-300 flex-1 rounded-xl px-3 text-lg text-center"
          />
        </View>
        <View className="flex-row w-full items-center">
          <Text className="flex-1 text-lg text-white">Fecha del Evento:</Text>
          <TextInput
            keyboardType="default"
            placeholder="25/12/2025"
            className="bg-slate-300 flex-1 rounded-xl px-3 text-lg text-center"
          />
        </View>
        <View className="flex-row w-full items-center">
          <Text className="flex-1 text-lg text-white">Lugar del Evento:</Text>
          <TextInput
            keyboardType="default"
            placeholder="Achumani"
            className="bg-slate-300 flex-1 rounded-xl px-3 text-lg text-center"
          />
        </View>
        <View className="flex-row w-full items-center">
          <Text className="flex-1 text-lg text-white">Número de entradas:</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="500"
            className="bg-slate-300 flex-1 rounded-xl px-3 text-lg text-center"
          />
        </View>
        <View className="w-full mt-10 items-center justify-center">
          <Pressable className="bg-blue-500 active:bg-blue-700 w-4/5 p-2 border-2 border-slate-300 rounded-lg items-center justify-around">
            <Text className="text-2xl text-white">Registrar Evento</Text>
          </Pressable>
        </View>
      </View>

      <View className="bg-black/60 absolute bottom-0 top-0 left-0 right-0 items-center justify-center">
        <View className="bg-slate-300 w-3/4 p-2 rounded-md items-center justify-center">
          <Text className="text-2xl text-black text-center font-bold">
            ¡Oops!
          </Text>
          <Text className="text-black text-center">
            Para usar esta funcionalidad, debe actualizar a un plan PRO 😉
          </Text>
          <Pressable className="bg-blue-500 active:bg-blue-700 w-3/5 mt-2 rounded-md items-center justify-around">
            <Text className="text-lg text-white">Actualizar Ahora</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
