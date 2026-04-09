import Link from "next/link"

export default function PopularArea({ areas, slug, is_category, is_category_page_area }) {

  function linkForArea(area) {
    if (is_category) {
      return `/${area.slug}`
    } else if (is_category_page_area) {
      return `/escorts/${area.slug}`
    } else {
      return `/escorts/${slug}/${area.slug}`
    }
  }

  return (
    <div className="rounded-3xl shadow-sm border border-(--area-bg) w-full border-t-0" style={{
      borderWidth: '3px '
    }}>

      {/* Title */}
      <div className="flex justify-center items-center bg-(--area-bg) justify-between p-2 py-4 rounded-t-2xl mb-5">
        <h2 className="text-xl text-center flex justify-center font-bold text-(--area-text) tracking-wide">
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
                <span className="text-(--area-link) font-medium group-hover:text-text-(--area-link)/60 transition">
                  {area.name}
                </span>
                <span className="bg-(--button-color)  text-(--button-text) text-sm px-3 py-1 rounded-full font-semibold group-hover:bg-(--button-hover-color) group-hover:text-(--button-hover-text)">
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