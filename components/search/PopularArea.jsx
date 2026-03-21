import Link from "next/link"

export default function PopularArea({areas , slug , is_category, is_category_page_area}){

 function linkForArea(area){
  if (is_category){
    return `/${area.slug}`
  }
  else if (is_category_page_area){
    return `/escorts/${area.slug}`
  }
  else return `/escort/${slug}/${area.slug}`
 }

 

  return(
    <div className=" rounded-2xl shadow-sm border border-(--primary-color) w-full ">

      {/* Title */}
      <div className="  flex items-center bg-(--primary-color) justify-between p-2 py-4 rounded-t-2xl mb-5">
        <h2 className="text-xl text-center font-bold text-white tracking-wide">
          Popular {is_category ? "Category" : "Area"}
        </h2>

        <div className="h-2 w-2  bg-(--primary-color) rounded-full"></div>
      </div>

      {/* orange line */}
      {/* <div className="h-[3px] bg-orange-500 w-12 rounded mb-4"></div> */}

      {/* List */}
      <div className="space-y-1 p-2 text-white overflow-auto h-[500px]">

        {areas.map((area, index)=>(
          // <Link key={index} href={is_category ? `/${area.slug}` : `/escort/${slug}/${area.slug}`}>
          <Link key={index} href={linkForArea(area)} >
          <div
            
            className="flex justify-between items-center px-3 py-3 rounded-lg hover:bg-(--primary-color)/10 text-(--primary-color) cursor-pointer transition group"
          >
            <span className="text-(--primary-color) font-medium group-hover:text-text-(--primary-color)/60 transition">
              {area.name}
            </span>

            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-semibold group-hover:bg-(--primary-color)/30 group-hover:text-text-(--primary-color)">
              {area.ads_count}
            </span>
          </div>
          </Link>
        ))}

      </div>

    </div>
  )
}