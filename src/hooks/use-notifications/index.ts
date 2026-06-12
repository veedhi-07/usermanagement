// import { useEffect } from "react";
// import { collection, onSnapshot, query } from "firebase/firestore";
// import { db } from "../../services/firebase";
// import { useAppSelector } from "../../redux/hooks";

// export default function useNotifications() {
//   const role = useAppSelector((state) => state.auth.role);
//   console.log("Current role:", role);

//   useEffect(() => {
//     if (role !== "Admin") console.log("Not admin, listener not started");

//     const unsubscribe = onSnapshot(
//       collection(db, "notifications"),
//       (snapshot) => {
//         snapshot.docChanges().forEach((change) => {
//           if (change.type !== "added") return;

//           const data = change.doc.data();

//           if (data.type !== "USER_DELETED") return;

//           new Notification("User Deleted", {
//             body: data.message,
//           });
//         });
//       },
//     );

//     return unsubscribe;
//   }, [role]);
// }
