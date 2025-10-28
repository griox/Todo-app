import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage.jsx";
import Notfound from "./pages/Notfound.jsx";
import './index.css'
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </>
  );
}
