import { db } from "./FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function validateTicketAndEvent(ticketId, eventID) {
  try {
    
    const storedTickets = await AsyncStorage.getItem("Stored-Tickets");
    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets);
      const localTicket = parsedTickets.find(ticket => ticket.ticketId === ticketId);
      if (localTicket && localTicket.state === "leido") {
        return { ...localTicket, eventID };
      }
    }


    const eventRef = doc(db, "Event", eventID);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      return { ticketId, eventID, state: "Evento no encontrado", eventData: null };
    }

    const eventData = eventSnap.data();
    const ticketsCollection = eventData.tickets_collection;

    if (!ticketsCollection) {
      return { ticketId, eventID, state: "Colección de tickets no encontrada", eventData: null };
    }

 
    const ticketRef = doc(db, ticketsCollection, ticketId);
    const ticketSnap = await getDoc(ticketRef);
    if (!ticketSnap.exists()) {
      return { ticketId, eventID, state: "Ticket no encontrado", eventData: null };
    }

    const ticketData = ticketSnap.data();

    return {
      ticketId,
      eventID,
      state: ticketData.state || "Estado desconocido",
      eventData: {
        date: eventData.date || "Fecha no disponible",
        name: eventData.name || "Nombre no disponible",
        stock: eventData.stock || 0,
        tickets_collection: ticketsCollection,
        ubi: eventData.ubi || "Ubicación no disponible",
      },
    };
  } catch (error) {
    console.error("❌ Error validando ticket y evento:", error);
    return null;
  }
}


export async function updateEventAndTicket(eventID, ticketId) {
  if (!eventID || !ticketId) {
    console.error("❌ ID de evento o ticket faltante:", { eventID, ticketId });
    return { success: false, error: "ID de evento o ticket faltante" };
  }

  try {
    
    const eventRef = doc(db, "Event", eventID);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
  
      return { success: false, error: "Evento no encontrado" };
    }

    const eventData = eventSnap.data();
 
    if (!eventData.tickets_collection) {
     
      return { success: false, error: "Colección de tickets no encontrada" };
    }

    
    const ticketRef = doc(db, eventData.tickets_collection, ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) {

      return { success: false, error: "Ticket no encontrado" };
    }

    const newAvaStock = (eventData.avaStock || 0) > 0 ? eventData.avaStock - 1 : 0;



    const now = new Date();
    const formattedDate = now.toLocaleString("es-ES", {
      timeZone: "America/La_Paz"
    });
    

    const eventUpdate = { avaStock: newAvaStock };
    const ticketUpdate = {
      modDate: formattedDate
    };

   
    await updateDoc(eventRef, eventUpdate);
    
    await updateDoc(ticketRef, ticketUpdate);

    return {
      success: true,
      newAvaStock,
      modDate: formattedDate
    };
  } catch (error) {
    console.error("❌ Error en la actualización:", error);
    return {
      success: false,
      error: error.message
    };
  }
}