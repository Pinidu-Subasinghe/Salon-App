export default function Footer({ setShowBooking }) {
  const handleBookingClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowBooking(true);
    } else {
      localStorage.setItem("afterLoginBooking", "true");
      window.location.href = "/auth";
    }
  };

  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">
            Salon Monaz
          </h3>
          <p className="text-sm">
            Your destination for beautiful hair and exceptional service. We’re
            committed to helping you look and feel your best.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={handleBookingClick} className="hover:underline">
                Book Appointment
              </button>
            </li>
            <li>
              <a href="#services" className="hover:underline">
                Our Services
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-sm">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Pinterest</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 text-center text-sm text-gray-500 pt-6">
        © 2025 Salon Monaz. All rights reserved.
      </div>
    </footer>
  );
}
