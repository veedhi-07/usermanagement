import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import { Firestore } from "firebase-admin/firestore";

const serviceAccount =
  require("../serviceAccountKey.json") as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth: Auth = admin.auth();
export const db: Firestore = admin.firestore();

export default admin;
