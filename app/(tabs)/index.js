import { Text, View } from "react-native";
import { Screen } from "../../components/Screen";

export default function Index() {
  return (
    <Screen>
      <View className="h-full items-center justify-center border-2 border-red-500">
        <Text className="text-2xl text-white text-center">
          Esta va a ser la pantalla principal, solo vamos a poner una
          bienvenida, una descripción y/o tutorial escrito de la app
        </Text>
      </View>
    </Screen>
  );
}
