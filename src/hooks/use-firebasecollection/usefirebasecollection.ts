import { useState, useEffect } from "react";
import { db } from "../../services/firebase/index";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export const usefirebasecollection = <T>(
  collectionName: string,
  dependencies: any[] = [],
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id,
          ...(doc.data() || {}),
        })) as T[];

        setData(result);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      },
    );

    return () => unsubscribe();
  }, [collectionName, ...dependencies]);

  return { data, loading };
};
