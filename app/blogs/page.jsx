'use client'
import BlogCard from "@/components/blogs/BlogsCard";
import Breadcrumb from "@/components/ui/Breadcurm";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Blogs() {

  const [blogs, setBlogs] = useState([])

  useEffect(() => {

    async function getBlogs() {
      try {

        const res = await api.post('/Wb/blogs')

        if (res.data.status) {

          const categories = res.data.data

          // merge all blogs
          const allBlogs = categories.flatMap((cat) => cat.blogs)

          setBlogs(allBlogs)

        } else {
          toast.error(res.data.message)
        }

      } catch (e) {
        console.log(e)
      }
    }

    getBlogs()

  }, [])

  return (
    <>
      <Breadcrumb />

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Latest Updates
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto">
          Explore our latest blogs, updates, and helpful guides.
        </p>
      </div>

      {/* BLOG SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1  gap-8">

          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              description={blog.description}
              image={blog.img}
              date={blog.created_at}
              slug={blog.slug}
            />
          ))}

        </div>

      </div>

    </>
  )
}