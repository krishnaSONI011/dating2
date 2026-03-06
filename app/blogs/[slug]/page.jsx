import BlogDetailClient from "./BlogDetailClient"

export async function generateMetadata({ params }) {

  const slug = params.slug

  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Wb/blogs_detail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slug }),
      cache: "no-store"
    })

    const data = await res.json()
    const blog = data.data

    return {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.description?.slice(0, 150),

      openGraph: {
        title: blog.meta_title || blog.title,
        description: blog.meta_description,
        images: [
          {
            url: blog.img
          }
        ]
      }
    }

  } catch (error) {

    return {
      title: "Blog",
      description: "Blog detail page"
    }

  }
}

export default function Page() {
  return <BlogDetailClient />
}