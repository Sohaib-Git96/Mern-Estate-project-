import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      {/* ---------- Heading ---------- */}
      <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-800">
        About Sohi Estate
      </h1>

      {/* ---------- Intro ---------- */}
      <p className="mb-4 text-slate-700 leading-relaxed">
        Sohi Estate is a leading real estate agency that specializes in
        helping clients buy, sell, and rent properties in the most desirable
        neighborhoods. Our team of experienced agents is dedicated to
        providing exceptional service and making the buying and selling
        process as smooth as possible.
      </p>
      <p className="mb-4 text-slate-700 leading-relaxed">
        Our mission is to help our clients achieve their real estate goals by
        providing expert advice, personalized service, and a deep
        understanding of the local market. Whether you are looking to buy,
        sell, or rent a property, we are here to help you every step of the
        way.
      </p>
      <p className="mb-10 text-slate-700 leading-relaxed">
        Our team of agents has a wealth of experience and knowledge in the
        real estate industry, and we are committed to providing the highest
        level of service to our clients. We believe that buying or selling a
        property should be an exciting and rewarding experience, and we are
        dedicated to making that a reality for each and every one of our
        clients.
      </p>

      {/* ---------- What we offer ---------- */}
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">
        What we offer
      </h2>
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Buy a property
          </h3>
          <p className="text-sm text-slate-600">
            Browse houses, apartments, and plots for sale. Filter by price,
            parking, and furnishing to find the right fit.
          </p>
        </div>
        <div className="border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Rent a place
          </h3>
          <p className="text-sm text-slate-600">
            Find rental homes and flats in your preferred area, with clear
            monthly prices and photos of every listing.
          </p>
        </div>
        <div className="border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            List your property
          </h3>
          <p className="text-sm text-slate-600">
            Create a listing with photos, price, and details in a few minutes
            and reach people who are looking right now.
          </p>
        </div>
      </div>

      {/* ---------- Call to action ---------- */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/search"
          className="bg-slate-700 text-white px-5 py-3 rounded-lg uppercase text-sm hover:opacity-95"
        >
          Browse listings
        </Link>
        <Link
          to="/create-listing"
          className="border border-slate-700 text-slate-700 px-5 py-3 rounded-lg uppercase text-sm hover:bg-slate-100"
        >
          List a property
        </Link>
      </div>
    </div>
  );
}