import { useState, useEffect, useRef, useCallback } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import { AppState, Platform, SafeAreaView, StatusBar, StyleSheet, Pressable, View, Text, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Overlay } from "./Overlay";
import { validateTicketAndEvent } from "../Operations";

export default function CameraComponent({ onClose }) {
  const [flashOn, setFlashOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrContent, setQrContent] = useState("");
  const [localTickets, setLocalTickets] = useState([]);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      qrLock.current = false;
    }, [])
  );

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }

    const loadLocalTickets = async () => {
      try {
        const storedTickets = await AsyncStorage.getItem("Stored-Tickets");
        setLocalTickets(storedTickets ? JSON.parse(storedTickets) : []);
      } catch (error) {
        console.error("❌ Error cargando tickets locales:", error);
      }
    };

    loadLocalTickets();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      setFlashOn(false);
    };
  }, [permission, requestPermission]);

  const validateQR = async (data) => {
    if (!data) return;
  
    const ticketIdMatch = data.match(/Ticket ID:\s*(\S+)/);
    if (!ticketIdMatch) {
      setQrContent("❌ QR no válido, no pertenece a la Organización.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
      return;
    }
  
    const ticketId = ticketIdMatch[1];
  
    
    const localTicket = localTickets.find(ticket => ticket.ticketId === ticketId);
  
    if (localTicket && localTicket.state === "Utilizado") {
      setQrContent("❌ El QR ya fue utilizado.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
      return;
    }
  
   
    const ticketData = await validateTicketAndEvent(ticketId);
  
    if (ticketData) {
      if (ticketData.state === "Utilizado") {
        setQrContent("❌ El QR fue generado Utilizado.");
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
      } else {
        setQrContent(`✅ QR Aceptado\nEstado: ${ticketData.state}\nEvento: ${ticketData.eventData?.name || "No encontrado"}`);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          if (onClose) {
            onClose(ticketData);
          }
        }, 3000);
      }
    } else {
      setQrContent("❌ Ticket no encontrado.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };
  
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Se necesita permiso para la cámara</Text>
        <Pressable style={styles.requestButton} onPress={requestPermission}>
          <Text style={styles.requestButtonText}>Conceder permiso</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashOn}
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            validateQR(data);
            setTimeout(() => {
              qrLock.current = false;
            }, 2000);
          }
        }}
      />

      <Overlay />

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{qrContent}</Text>
          </View>
        </View>
      </Modal>

      <Pressable
        style={styles.closeButton}
        onPress={() => {
          if (onClose) {
            onClose();
          } else {
            navigation.goBack();
          }
        }}
      >
        <MaterialIcons name="close" size={28} color="white" />
      </Pressable>

      <Pressable style={styles.flashButton} onPress={() => setFlashOn((prev) => !prev)}>
        <MaterialIcons name={flashOn ? "flash-on" : "flash-off"} size={28} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    bottom: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 30,
  },
  flashButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 30,
  },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
  permissionText: { color: "white", fontSize: 18, textAlign: "center", marginBottom: 10 },
  requestButton: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 5 },
  requestButtonText: { color: "white", fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { width: "80%", backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
});
