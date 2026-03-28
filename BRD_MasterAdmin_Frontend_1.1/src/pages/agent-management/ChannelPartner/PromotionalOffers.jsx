// PromotionalOffers.js
export default function PromotionalOffers() {
  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Promotional Offers</h2>

      <input className="input" placeholder="Offer Name" />
      <input className="input mt-2" placeholder="Reward Value" />

      <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
        Save Offer
      </button>
    </div>
  );
}
