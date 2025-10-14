import { Link, useNavigate } from "react-router-dom";
import heroBg from "../../assets/hero-bg.jpg";

export default function HeroSection({ setShowBooking }) {
  const navigate = useNavigate();

  const handleBookingClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowBooking(true);
    } else {
      localStorage.setItem("afterLoginBooking", "true");
      navigate("/auth");
    }
  };

  return (
    <section
      className="relative min-h-[90vh] md:h-[92vh] flex flex-col justify-center items-center text-center text-white overflow-hidden px-4"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Glow Hair Salon
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed">
          Where beauty meets artistry. Transform your look with our expert
          stylists in a serene, modern environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                setShowBooking(true);
              } else {
                window.location.href = "/auth";
              }
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-200 transition"
          >
            Book Appointment
          </button>

          <button
            onClick={() => (window.location.href = "/auth")}
            className="bg-white text-gray-900 px-6 py-3 rounded font-semibold hover:bg-gray-200 transition"
          >
            Get 10% Off First Visit
          </button>
        </div>
      </div>
    </section>
  );
}
