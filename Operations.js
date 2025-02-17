import { db } from "./FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function validateTicketAndEvent(ticketId) {
  try {
  
    const storedTicket = await AsyncStorage.getItem("Stored-Tickets");
    if (storedTicket) {
      const parsedTicket = JSON.parse(storedTicket);
      if (parsedTicket.ticketId === ticketId && parsedTicket.state === "Utilizado") {
        return parsedTicket;
      }
    }

  
    const ticketRef = doc(db, "Ticket_Concierto LP", ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {
    
      return null;
    }

    const ticketData = ticketSnap.data();

    let { state, eventID } = ticketData;

    if (!eventID) {
      
      return { ticketId, state, eventData: null };
    }

    const eventRef = doc(db, "Event", eventID);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return { ticketId, state, eventData: null };
    }

    const eventData = eventSnap.data();

    const result = {
      ticketId,
      state,
      eventData: {
        date: eventData.date || "Fecha no disponible",
        name: eventData.name || "Nombre no disponible",
        stock: eventData.stock || 0,
        tickets_collection: "Ticket_Concierto LP", 
        ubi: eventData.ubi || "Ubicación no disponible",
      },
    };

    return result;
  } catch (error) {
    return null;
  }
}
