'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { toast } from "react-toastify"
import Breadcrumb from "@/components/ui/Breadcurm"
import Image from "next/image"
import { formateTheDate } from "@/lib/DateTimeFormate"

export default function BlogsDetailPage() {

  const params = useParams()
  const slug = params?.slug ?? ''

  const [blog, setBlog] = useState(null)

  useEffect(() => {

    async function getBlogDetail() {
      try {

        const res = await api.post('/Wb/blogs_detail', {
          slug: slug
        })

        if (res.data.status == 0) {
          setBlog(res.data.data)
        } else {
          toast.error(res.data.message)
        }

      } catch (error) {
        console.log(error)
      }
    }

    if (slug) {
      getBlogDetail()
    }

  }, [slug])


  if (!blog) {
    return (
      <div className="text-center py-20 text-white">
        Loading blog...
      </div>
    )
  }

  return (
    <>
      <Breadcrumb />

      <div className="max-w-4xl mx-auto px-5 py-10 text-white">

        {/* IMAGE */}
        <div className="w-full h-[400px] relative rounded-xl overflow-hidden mb-8">
          <img
            src={`${blog.img}`}
            alt={blog.title}
            
            className="object-cover"
          />
        </div>

        {/* DATE */}
        <p className="text-gray-400 mb-3">
          {formateTheDate(blog.created_at)}

        </p>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-400 mb-6">
          {blog.title}
        </h1>

        {/* DESCRIPTION */}
        <div
          className="text-gray-300 leading-8 text-lg"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

      </div>
    </>
  )
}