
import { formateTheDate, getExpiryDate } from "@/lib/DateTimeFormate"
import Link from "next/link"

export default function BlogCard({ image, title, description, date, slug }) {
  return (

    <Link href={`/blogs/${slug}`}>
      <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-r from-[#0f1b2d] to-[#1b2b45] hover:border-orange-400 transition duration-300">

        {/* IMAGE */}
        <div className="md:w-72 w-full h-52 md:h-auto relative overflow-hidden">
          <img
            src={image}
            alt={title}
           
            className="object-cover w-[200px] h-full group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between p-6 flex-1 text-white">

          <div>
            {/* DATE */}
            <p className="text-sm text-gray-400 mb-2">
                {formateTheDate(date)}
             
            </p>

            {/* TITLE */}
            <h2 className="text-xl md:text-2xl font-semibold text-orange-300 mb-3 line-clamp-2">
              {title}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-300 text-sm md:text-base line-clamp-3">
              {description}
            </p>
          </div>

          {/* READ MORE */}
          <div className="mt-5">
            <span className="inline-flex items-center text-orange-400 font-medium group-hover:translate-x-1 transition">
              Read Article →
            </span>
          </div>

        </div>

      </div>
    </Link>

  )
}