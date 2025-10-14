import offerImg from "../../assets/offer.jpg";

export default function OfferSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10 px-6 bg-gray-50 rounded-2xl shadow-sm">
        <img
          src={offerImg}
          alt="Offer"
          className="rounded-l-2xl w-full h-full object-cover"
        />
        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-3">
            Get 10% Off Your First Visit
          </h2>
          <p className="text-gray-600 mb-6">
            Join our newsletter to receive exclusive offers, hair care tips, and
            updates on our latest services and promotions.
          </p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border rounded px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
            >
              Claim Your Discount
            </button>
            <p className="text-xs text-gray-500">
              By subscribing, you agree to receive promotional emails. You can
              unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
