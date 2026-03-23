import Link from "next/link"

export default function PopularArea({ areas, slug, is_category, is_category_page_area }) {

  function linkForArea(area) {
    if (is_category) {
      return `/${area.slug}`
    } else if (is_category_page_area) {
      return `/escorts/${area.slug}`
    } else {
      return `/escort/${slug}/${area.slug}`
    }
  }

  return (
    <div className="rounded-2xl shadow-sm border border-(--primary-color) w-full">

      {/* Title */}
      <div className="flex items-center bg-(--primary-color) justify-between p-2 py-4 rounded-t-2xl mb-5">
        <h2 className="text-xl text-center font-bold text-white tracking-wide">
          Popular {is_category ? "Category" : "Area"}
        </h2>
        <div className="h-2 w-2 bg-(--primary-color) rounded-full"></div>
      </div>

      {/* List */}
      <div className="space-y-1 p-2 text-white overflow-auto h-[500px]">

        {/* ✅ Empty state */}
        {(!areas || areas.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <p className="text-gray-400 text-sm">
              No {is_category ? "categories" : "areas"} found
            </p>
          </div>
        ) : (
          areas.map((area, index) => (
            <Link key={index} href={linkForArea(area)}>
              <div className="flex justify-between items-center px-3 py-3 rounded-lg hover:bg-(--primary-color)/10 text-(--primary-color) cursor-pointer transition group">
                <span className="text-(--primary-color) font-medium group-hover:text-text-(--primary-color)/60 transition">
                  {area.name}
                </span>
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-semibold group-hover:bg-(--primary-color)/30 group-hover:text-text-(--primary-color)">
                  {area.ads_count}
                </span>
              </div>
            </Link>
          ))
        )}

      </div>

    </div>
  )
}