import { useEffect, useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import VisitSection from "../components/sections/VisitSection";
import BookingModal from "../components/BookingModal";

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);

  // open modal automatically if redirected after auth
  useEffect(() => {
    const afterLogin = localStorage.getItem("afterLoginBooking");
    const token = localStorage.getItem("token");
    if (afterLogin === "true") {
      if (token) {
        setShowBooking(true);
      }
      // whether we opened the modal or not, clear the transient flag so
      // navigating back doesn't re-trigger the modal unexpectedly
      localStorage.removeItem("afterLoginBooking");
    }
  }, []);

  return (
    <>
      <HeroSection setShowBooking={setShowBooking} />
      <AboutSection />
      <ServicesSection setShowBooking={setShowBooking} />
      <VisitSection />
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </>
  );
}
