export default function VisitSection() {
  const contactInfo = [
    { title: "Location", value: "31 Richmond Way\nLondon\nW14 0AS", icon: "📍" },
    { title: "Phone", value: "020 7946 0123\n07700 900456", icon: "📞" },
    {
      title: "Hours",
      value: "Mon–Fri: 9AM–7PM\nSat: 8AM–6PM\nSun: 10AM–4PM",
      icon: "⏰",
    },
    {
      title: "Email",
      value: "info@glowhairsalon.com\nbook@glowhairsalon.com",
      icon: "✉️",
    },
  ];

  return (
    <section className="py-20" id="contact">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Visit Us</h2>
        <p className="text-gray-600">
          Ready to glow? Book your appointment today and experience the
          difference.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        {contactInfo.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
