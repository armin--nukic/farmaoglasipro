import { Route, Routes } from "react-router";
import { Header } from "./components/layout/Header";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { AuthPage } from "./pages/AuthPage";
import { AuctionsPage } from "./pages/AuctionsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateListingPage } from "./pages/CreateListingPage";
import { FarmsPage } from "./pages/FarmsPage";
import { ForumPage } from "./pages/ForumPage";
import { HomePage } from "./pages/HomePage";
import { ListingsPage } from "./pages/ListingsPage";
import { MapPage } from "./pages/MapPage";
import { MessagesPage } from "./pages/MessagesPage";
import { PremiumPage } from "./pages/PremiumPage";
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
        <Route path="/create-listing" element={<CreateListingPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </>
  );
}
