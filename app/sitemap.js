export default async function sitemap() {

  const baseUrl = "https://affairescorts.com";
  const apiBase = "https://irisinformatics.net/dating/Wb";

  /* ================= HELPER ================= */
  async function fetchData(endpoint, body = null) {
    try {
      const options = {
        method: "POST",
        cache: "no-store",
      };
      if (body) {
        const fd = new FormData();
        Object.entries(body).forEach(([key, val]) => fd.append(key, val));
        options.body = fd;
      }
      const res = await fetch(`${apiBase}/${endpoint}`, options);
      const data = await res.json();

      // ✅ Ensure always returns an array, never null/undefined
      const result = data?.data;
      return Array.isArray(result) ? result : [];

    } catch (error) {
      console.log(`Sitemap fetch error [${endpoint}]:`, error);
      return [];
    }
  }

  /* ================= FETCH CITIES + CATEGORIES + LEGAL IN PARALLEL ================= */
  const [cities, categories, legalGrouped] = await Promise.all([
    fetchData("all_cities"),
    fetchData("posts_categories"),
    fetchData("legal_pages_by_footer_cat"),
  ]);

  const legalPages = Array.isArray(legalGrouped)
    ? legalGrouped.flatMap((cat) => cat?.pages || [])
    : [];

  /* ================= FETCH LOCAL AREAS FOR EACH CITY IN PARALLEL ================= */
  const validCities = cities.filter((city) => city?.slug);

  const localAreaResults = await Promise.all(
    validCities.map(async (city) => {
      try {
        const areas = await fetchData("get_areas_by_city", { city_slug: city.slug });

        //  Guard: ensure areas is array before chaining
        if (!Array.isArray(areas)) return [];

        return areas
          .filter((area) => area?.slug)
          .map((area) => ({
            citySlug: city.slug,
            areaSlug: area.slug,
          }));
      } catch (e) {
        console.log(`Local area fetch failed for city: ${city.slug}`, e);
        return []; // ✅ Never crash the whole sitemap for one city
      }
    })
  );

  const allLocalAreas = localAreaResults.flat();

  /* ================= STATIC PAGES ================= */
  const staticPages = [
    { route: "",          priority: 1.0, changeFrequency: "daily"   },
    { route: "/about",    priority: 0.7, changeFrequency: "monthly" },
    { route: "/contact",  priority: 0.7, changeFrequency: "monthly" },
    { route: "/login",    priority: 0.5, changeFrequency: "yearly"  },
    { route: "/register", priority: 0.5, changeFrequency: "yearly"  },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  /* ================= CITY PAGES ================= */
  const cityPages = validCities.map((city) => ({
    url: `${baseUrl}/escorts/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  /* ================= LOCAL AREA PAGES ================= */
  const localAreaPages = allLocalAreas.map(({ citySlug, areaSlug }) => ({
    url: `${baseUrl}/${citySlug}/${areaSlug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  /* ================= CATEGORY PAGES ================= */
  const categoryPages = categories
    .filter((cat) => cat?.slug)
    .map((cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

  /* ================= LEGAL PAGES ================= */
  const legalPageEntries = legalPages
    .filter((page) => page?.slug)
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  /* ================= SUMMARY LOG ================= */
  

  return [
    ...staticPages,
    ...cityPages,
    ...localAreaPages,
    ...categoryPages,
    ...legalPageEntries,
  ];
}