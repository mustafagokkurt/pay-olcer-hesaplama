import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Consumption } from "./interfaces/Consumption";

export const useApp = () => {
  useEffect(() => {});

  const getDocById = async (id: string) => {
    const docRef = doc(db, "consumptions", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data() as Consumption;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return { getDocById };
};
