'use client'

import Link from "next/link";
import EscortCard from "../ui/AdsCard";

export default function CardShower({
  items,
  
  currentPage,
  setCurrentPage,
  totalPages
}) {
console.log(items)
  return (
    <div className="max-1xl md:max-w-7xl mx-auto px-6 py-10">

      {/* Grid */}
      <div className="grid grid-cols-1 gap-10">

{items?.length > 0 ? (
  items.map(item => (
    <Link key={item.id} href={`/escorts/${item.city_name}/${item.local_area_slug}/${item.slug}`}>
    <EscortCard
      
      age={item.age}
      images={item.images}
      title={item.title}
      is_telegram={item.is_telegram == 1 ? true : false}
      is_whatsapp={item.is_whatsapp == 1 ? true : false}
      country={item.nationality}
      desc={item.description}
      location={item.local_area_name+' , '+item.city_name}
      is_superTop={item.super_top == 1 ? true : false}
      highlight={item.hight_light == 1 ? true : false}
      is_new={item.new== 1 ? true : false}

    />
    </Link>
  ))
) : (
  <div className="text-center py-10 col-span-full">
    <h2 className="text-2xl font-semibold text-gray-700">
      No listings for this area
    </h2>
    <p className="text-gray-500 mt-2">
      Please check another location or try again later.
    </p>
  </div>
)}

</div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2 flex-wrap">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === index + 1
                  ? "bg-orange-300 text-white"
                  : "bg-blue-950"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  )
}