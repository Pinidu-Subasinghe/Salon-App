export default function Footer({ setShowBooking }) {
  const handleBookingClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const ustr = localStorage.getItem("user");
      if (ustr) {
        try {
          const uu = JSON.parse(ustr);
          if (uu.role === "admin") {
            alert("Admins are not allowed to book appointments.");
            return;
          }
        } catch (e) {}
      }
      if (typeof setShowBooking === "function") setShowBooking(true);
    } else {
      // prefer register when user came from booking intent
      localStorage.setItem("afterLoginBooking", "true");
      localStorage.setItem("authMode", "register");
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
              <button onClick={() => window.location.hash = 'services'} className="hover:underline">
                Our Services
              </button>
            </li>
            <li>
              <button onClick={() => window.location.hash = 'about'} className="hover:underline">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => window.location.hash = 'contact'} className="hover:underline">
                Contact
              </button>
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
