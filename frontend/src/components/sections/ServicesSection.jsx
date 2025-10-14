export default function ServicesSection({ setShowBooking }) {
  const handleBookService = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowBooking(true);
    } else {
      localStorage.setItem("afterLoginBooking", "true");
      window.location.href = "/auth";
    }
  };

  const services = [
    { name: "Haircut & Blow Dry", desc: "Professional cuts with expert blow dry styling.", price: "£45", icon: "✂️" },
    { name: "Highlights & Balayage", desc: "Hand-painted highlights for natural dimension.", price: "£85", icon: "🖌️" },
    { name: "Hair Colouring", desc: "Full colour transformations using premium products.", price: "£65", icon: "🎨" },
    { name: "Hair Treatments", desc: "Olaplex & Keratin treatments for healthier hair.", price: "£40", icon: "✨" },
    { name: "Men’s Haircuts & Grooming", desc: "Sharp cuts and trims for the modern gentleman.", price: "£35", icon: "👨‍🦰" },
  ];

  return (
    <section className="py-20 bg-gray-50" id="services">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-bold mb-3">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our comprehensive range of hair services designed to help you look and feel your absolute best.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
            <p className="text-gray-600 mb-2">{s.desc}</p>
            <p className="font-semibold">Starting at {s.price}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleBookService}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition"
        >
          Book Your Service
        </button>
      </div>
    </section>
  );
}
