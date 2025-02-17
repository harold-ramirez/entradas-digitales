// Importar Firebase
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs } from "firebase/firestore"

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2218YP1MNQ-Q0Ifu3ZuRKDM5puPygd4E",
  authDomain: "digitaltickets-bfa2c.firebaseapp.com",
  databaseURL: "https://digitaltickets-bfa2c-default-rtdb.firebaseio.com",
  projectId: "digitaltickets-bfa2c",
  storageBucket: "digitaltickets-bfa2c.firebasestorage.app",
  messagingSenderId: "292458265449",
  appId: "1:292458265449:web:47398c843164df9f655bf8",
  measurementId: "G-3S0RWD3JVB"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
