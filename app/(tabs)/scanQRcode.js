import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Screen } from "../../components/Screen";
import { View, Text, StyleSheet, SafeAreaView, Pressable, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraComponent from "../../components/Camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function ScanQRcode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { ticketData } = useLocalSearchParams();
  const [ticketInfo, setTicketInfo] = useState(null);
  const [shouldOpenCamera, setShouldOpenCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      setIsPermissionGranted(true);
    } else if (permission?.status === "denied") {
      setIsPermissionGranted(false);
    }
  }, [permission]);

  useFocusEffect(
    useCallback(() => {
      setShouldOpenCamera(false);
      setTicketInfo(null);
    }, [])
  );

  const handleAccept = async () => {
    if (!ticketInfo || !ticketInfo.ticketId) return;
    setIsLoading(true);

    try {
      const storedTickets = await AsyncStorage.getItem("Stored-Tickets");
      let ticketsArray = storedTickets ? JSON.parse(storedTickets) : [];
      if (!Array.isArray(ticketsArray)) ticketsArray = [];

      const ticketIndex = ticketsArray.findIndex((t) => t.ticketId === ticketInfo.ticketId);
      if (ticketIndex !== -1) {
        ticketsArray[ticketIndex].state = "Utilizado";
      } else {
        ticketsArray.push({ ...ticketInfo, state: "Utilizado" });
      }

      await AsyncStorage.setItem("Stored-Tickets", JSON.stringify(ticketsArray));
      Alert.alert("✅ Éxito", "El ticket ha sido utilizado correctamente.");
      setTicketInfo(null);
    } catch (error) {
      console.error("❌ Error actualizando ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>E S C Á N E R QR</Text>

          <View style={styles.cardContainer}>
            <View style={styles.permissionScanContainer}>
              <View style={styles.buttonColumn}>
                {!isPermissionGranted ? (
                  <Pressable style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Conceder Permiso</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.scanButton, !isPermissionGranted && styles.disabledButton]}
                    onPress={() => setShouldOpenCamera(true)}
                    disabled={!isPermissionGranted}
                  >
                    <Text style={styles.buttonText}>Scanear QR</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.qrIconColumn}>
                <MaterialIcons name="qr-code-scanner" size={50} color="#FFF" />
              </View>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.cardTitle}>Resultados del escaneo</Text>
              {ticketInfo ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>🎟 Evento: {ticketInfo.eventData.name}</Text>
                  <Text style={styles.resultText}>📅 Fecha: {ticketInfo.eventData.date}</Text>
                  <Text style={styles.resultText}>📍 Ubicación: {ticketInfo.eventData.ubi}</Text>
                  <Text style={styles.resultText}>🛑 Estado: {ticketInfo.state}</Text>

                  <Pressable 
                    style={[styles.acceptButton, isLoading && styles.disabledButton]} 
                    onPress={handleAccept} 
                    disabled={isLoading}
                  >
                    {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Aceptar</Text>}
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.noResultText}>🔍 No hay datos disponibles</Text>
              )}
            </View>
          </View>
        </ScrollView>
        {shouldOpenCamera && (
          <CameraComponent
            onClose={(data) => {
              setShouldOpenCamera(false);
              if (data) setTicketInfo(data);
            }}
          />
        )}
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  cardContainer: {
    width: "100%",
    gap: 20,
  },
  permissionScanContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 12,
  },
  buttonColumn: {
    flex: 1,
    alignItems: "center",
  },
  qrIconColumn: {
    alignItems: "center",
    justifyContent: "center",
  },
  permissionButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "#0E7AFE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 20,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
