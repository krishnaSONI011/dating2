'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { toast } from "react-toastify"
import Breadcrumb from "@/components/ui/Breadcurm"
import { formateTheDate } from "@/lib/DateTimeFormate"

export default function BlogsDetailPage() {

  const params = useParams()
  const slug = params?.slug ?? ''

  const [blog, setBlog] = useState(null)

  useEffect(() => {

    async function getBlogDetail() {
      try {
        // ✅ Fixed: use FormData instead of JSON object
        const fd = new FormData()
        fd.append("slug", slug)

        const res = await api.post('/Wb/blogs_detail', fd)

        if (res.data.status == 0) {
          setBlog(res.data.data)
        } else {
          toast.error(res.data.message)
        }

      } catch (error) {
        console.log(error)
      }
    }

    if (slug) getBlogDetail()

  }, [slug])

  if (!blog) {
    return (
      <div className="text-center py-20 text-white">
        Loading blog...
      </div>
    )
  }

  // ✅ Parse tags — split by comma, trim whitespace, filter empty
  const tags = blog?.tag
    ? blog.tag.split(",").map(t => t.trim()).filter(Boolean)
    : []

  return (
    <>
      <Breadcrumb />

      <div className="max-w-4xl mx-auto px-5 py-10 text-white">

        {/* IMAGE */}
        {blog.img && (
          <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-8">
            <img
              src={blog.img}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* DATE */}
        <p className="text-gray-400 text-sm mb-3">
          {formateTheDate(blog.created_at)}
        </p>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-400 mb-6">
          {blog.title}
        </h1>

        {/* ✅ TAGS */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-medium px-3 py-1 rounded-full"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}

        {/* DESCRIPTION */}
        <div
          className="text-gray-300 leading-8 text-lg prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        {/* ✅ TAGS at bottom too */}
        {tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-800 hover:bg-orange-500/20 border border-gray-700 hover:border-orange-500/40 text-gray-300 hover:text-orange-400 text-xs font-medium px-3 py-1 rounded-full transition cursor-pointer"
                >
                  # {tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}