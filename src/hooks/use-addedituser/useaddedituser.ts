import { useState, useEffect } from "react";
import { db } from "../../services/firebase/index";
import { collection, getDocs } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export const useaddedituser = <T>(
  collectionName: string,
  dependencies: any[] = [],
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id,
          ...(doc.data() || {}),
        })) as T[];

        setData(result);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};
