import { useEffect, useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ServicesSection from "../components/sections/ServicesSection";
import OfferSection from "../components/sections/OfferSection";
import VisitSection from "../components/sections/VisitSection";
import BookingModal from "../components/BookingModal";

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);

  // open modal automatically if redirected after auth
  useEffect(() => {
    const afterLogin = localStorage.getItem("afterLoginBooking");
    if (afterLogin === "true") {
      setShowBooking(true);
      localStorage.removeItem("afterLoginBooking");
    }
  }, []);

  return (
    <>
      <HeroSection setShowBooking={setShowBooking} />
      <AboutSection />
      <ServicesSection setShowBooking={setShowBooking} />
      <OfferSection />
      <VisitSection />
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </>
  );
}
