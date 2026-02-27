import Link from "next/link"

export default function PopularArea({areas , slug}){

 
console.log(areas)
 

  return(
    <div className=" rounded-2xl shadow-sm border border-orange-400  w-full ">

      {/* Title */}
      <div className="  flex items-center bg-orange-500 justify-between p-2 py-4 rounded-t-2xl mb-5">
        <h2 className="text-xl text-center font-bold text-white tracking-wide">
          Popular Areas
        </h2>

        <div className="h-2 w-2  bg-orange-500 rounded-full"></div>
      </div>

      {/* orange line */}
      {/* <div className="h-[3px] bg-orange-500 w-12 rounded mb-4"></div> */}

      {/* List */}
      <div className="space-y-1 p-2 text-white overflow-auto h-[500px]">

        {areas.map((area, index)=>(
          <Link key={index} href={`/escorts/${slug}/${area.slug}`}>
          <div
            
            className="flex justify-between items-center px-3 py-3 rounded-lg hover:bg-orange-50 text-white cursor-pointer transition group"
          >
            <span className="text-white font-medium group-hover:text-orange-600 transition">
              {area.name}
            </span>

            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-semibold group-hover:bg-orange-100 group-hover:text-orange-600">
              {area.ads_count}
            </span>
          </div>
          </Link>
        ))}

      </div>

    </div>
  )
}