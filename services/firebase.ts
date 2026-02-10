import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, onSnapshot, setDoc, writeBatch } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD1nQYfkPEsuLQxSmgAZKqZe1pxMUc_h38",
  authDomain: "the-prophet-s-medicine.firebaseapp.com",
  projectId: "the-prophet-s-medicine",
  storageBucket: "the-prophet-s-medicine.firebasestorage.app",
  messagingSenderId: "96800261645",
  appId: "1:96800261645:web:6a7794abb43068b020b744",
  measurementId: "G-LHC0SM4RZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export interface InquiryData {
  email: string;
  question: string;
}

export interface BookingData {
  serviceId: string;
  serviceTitle: string;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export const saveInquiry = async (data: InquiryData) => {
  try {
    await addDoc(collection(db, "inquiries"), {
      ...data,
      timestamp: serverTimestamp(),
      status: 'new'
    });
    return true;
  } catch (e) {
    console.error("Error saving inquiry: ", e);
    return false;
  }
};

export const saveBooking = async (data: BookingData) => {
  try {
    await addDoc(collection(db, "bookings"), {
      ...data,
      timestamp: serverTimestamp(),
      status: 'pending'
    });
    return true;
  } catch (e) {
    console.error("Error saving booking: ", e);
    return false;
  }
};

export { db, analytics, collection, getDocs, doc, updateDoc, deleteDoc, onSnapshot, setDoc, writeBatch };