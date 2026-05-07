import { Router, RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

export default function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
        {/* <Router basename="/veedhi"/> */}
      </Suspense>
      <Toaster position="top-center" />
    </>
  );
}
