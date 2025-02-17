import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Animated, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const [step, setStep] = useState(0);
  const translateXAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateXAnim, {
      toValue: -width * step,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const resetTutorial = () => setStep(0);

  return (
    <LinearGradient colors={["#11bebe", "#411494"]} style={styles.container}>
         <Text style={styles.headerTitle}>M A N E J O</Text>
      <Animated.View style={[styles.stepsContainer, { transform: [{ translateX: translateXAnim }] }]}>
        <WelcomeStep onNext={nextStep} />
        <NavigationStep onNext={nextStep} />
        <ScannerStep onNext={nextStep} />
        <ScanSimulationStep onNext={nextStep} />
        <ShowResultStep onNext={nextStep} />
        <ResultStep onFinish={resetTutorial} />
      </Animated.View>
    </LinearGradient>
  );
}

const StepTemplate = ({ icon, title, description, buttonText, onNext }) => (
  <View style={styles.stepPage}>
    <View style={styles.card}>
      <Ionicons name={icon} size={80} color="#FFF" style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const WelcomeStep = ({ onNext }) => (
  <StepTemplate icon="qr-code" title="Bienvenido" description="Escanea códigos QR fácilmente." buttonText="Comenzar" onNext={onNext} />
);

const NavigationStep = ({ onNext }) => (
  <StepTemplate icon="compass" title="Navegación" description="Usa la pestaña 'Escanear QR'." buttonText="Siguiente" onNext={onNext} />
);

const ScannerStep = ({ onNext }) => (
  <StepTemplate icon="camera" title="Escanear Código" description="Toca el botón para escanear." buttonText="Escanear" onNext={onNext} />
);

const ScanSimulationStep = ({ onNext }) => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [isScanning, setIsScanning] = useState(true);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    animationRef.current.start();

    const timer = setTimeout(() => {
      if (isScanning) {
        setIsScanning(false);
        animationRef.current?.stop();
        onNext();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      animationRef.current?.stop();
    };
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.stepPage}>
      <View style={styles.card}>
        <Ionicons name="scan" size={80} color="#FFF" style={styles.icon} />
        <Text style={styles.title}>Escaneando...</Text>
        <View style={styles.scanArea}>
          {isScanning && (
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          )}
        </View>
        {isScanning ? (
          <ActivityIndicator size="large" color="#FFF" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const ShowResultStep = ({ onNext }) => (
  <View style={styles.stepPage}>
    <View style={styles.card}>
      <Ionicons name="document-text" size={80} color="#FFF" style={styles.icon} />
      <Text style={styles.title}>Resultado del Escaneo</Text>
      <Text style={styles.cardText}>🎉 Evento: Concierto en Vivo</Text>
      <Text style={styles.cardText}>📍 Lugar: Auditorio Nacional</Text>
      <Text style={styles.cardText}>📅 Fecha: 25 de Febrero, 2025</Text>
      <Text style={styles.cardText}>⏰ Hora: 8:00 PM</Text>
      <Text style={styles.cardText}>🎶 Artista: Banda XYZ</Text>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ResultStep = ({ onFinish }) => (
  <StepTemplate icon="checkmark-circle" title="Éxito" description="Escaneo completado correctamente." buttonText="Finalizar" onNext={onFinish} />
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 32, fontWeight: "bold", color: "#FFF", textAlign: "center", marginTop: 30, marginBottom: -100},
  stepsContainer: { flexDirection: "row", width: width * 6, height: height },
  stepPage: { width, height, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: width * 0.8, // Tamaño fijo para todos los cards
    height: height * 0.6, // Altura fija para uniformidad
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center", // Centrar el contenido
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFF", marginBottom: 15, textAlign: "center" },
  description: { fontSize: 20, color: "#EEE", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#4CAF50", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10, marginTop: 50 },
  buttonText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  icon: { marginBottom: 15 },
});

