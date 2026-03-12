export default async function sitemap() {

    const baseUrl = "https://affairescorts.com";
  
    let cities = [];
  
    try {
      const res = await fetch(`https://irisinformatics.net/dating/Wb/all_cities`, {
        method: "GET",
        cache: "no-store"
      });
  
      const data = await res.json();
      cities = data?.data || [];
  
    } catch (error) {
      console.log("Sitemap error:", error);
    }
  
    // Static pages
    const staticPages = [
      "",
      "/about",
      "/contact",
      "/login",
      "/register"
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
    }));
  
  
    // Dynamic city pages
    const cityPages = cities.map((city) => ({
      url: `${baseUrl}/escorts/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }));
  
  
    return [
      ...staticPages,
      ...cityPages
    ];
  }