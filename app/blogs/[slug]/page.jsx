import BlogDetailClient from "./BlogDetailClient"

export async function generateMetadata({ params }) {

  // ✅ Fixed: await params first
  const { slug } = await params

  try {

    const fd = new FormData()
    fd.append("slug", slug)

    const res = await fetch(`https://irisinformatics.net/dating/Wb/blogs_detail`, {
      method: "POST",
      body: fd,
      cache: "no-store",
    })

    const json = await res.json()
    const blog = json?.data

    return {
      title:       blog?.meta_title       || blog?.title        || "Blog",
      description: blog?.meta_description || "",
      keywords:    blog?.keyword          || "",

      openGraph: {
        title:       blog?.meta_title       || blog?.title || "Blog",
        description: blog?.meta_description || "",
        images: blog?.img
          ? [{ url: blog.img, alt: blog?.title || "Blog Image" }]
          : [],
        type: "article",
      },

      twitter: {
        card:        "summary_large_image",
        title:       blog?.meta_title       || blog?.title || "Blog",
        description: blog?.meta_description || "",
        images:      blog?.img ? [blog.img] : [],
      },
    }

  } catch (error) {
    console.log("Blog metadata error:", error)
    return {
      title: "Blog",
      description: "Blog detail page",
    }
  }
}

export default function Page() {
  return <BlogDetailClient />
}