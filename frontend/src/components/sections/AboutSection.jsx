import aboutImg from "../../assets/about.jpg";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">About Glow Hair Salon</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Glow Hair Salon, where we believe every person deserves
            to feel beautiful and confident. Our newly opened salon combines
            cutting-edge techniques with personalized care to create stunning
            results that enhance your natural beauty.
          </p>
          <p className="text-gray-600 mb-6">
            From precision haircuts and vibrant colours to advanced treatments
            like Olaplex and Keratin, we offer comprehensive hair services for
            both women and men. Our team of experienced stylists stays current
            with the latest trends and techniques.
          </p>
          <div className="flex gap-4">
            <div className="bg-gray-100 rounded-lg p-6 text-center flex-1">
              <p className="text-3xl font-bold">5+</p>
              <p className="text-gray-600">Expert Stylists</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 text-center flex-1">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>
        <img
          src={aboutImg}
          alt="About Glow Hair Salon"
          className="rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
