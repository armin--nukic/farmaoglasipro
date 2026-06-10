import { Route, Routes } from "react-router";
import { Header } from "./components/layout/Header";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AuthPage } from "./pages/AuthPage";
import { AuctionsPage } from "./pages/AuctionsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { FarmsPage } from "./pages/FarmsPage";
import { HomePage } from "./pages/HomePage";
import { ListingsPage } from "./pages/ListingsPage";
import { MessagesPage } from "./pages/MessagesPage";
import { VeterinariansPage } from "./pages/VeterinariansPage";

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/equipment" element={<ListingsPage type="EQUIPMENT" />} />
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/veterinarians" element={<VeterinariansPage />} />
        <Route path="/stations" element={<VeterinariansPage stations />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </>
  );
}
