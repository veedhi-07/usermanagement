import { useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function useNotifications() {
  useEffect(() => {
    const q = query(collection(db, "notifications"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();

        if (Notification.permission === "granted") {
          new Notification(data.type, {
            body: data.message,
          });
        }
      });
    });

    return () => unsubscribe();
  }, []);
}
