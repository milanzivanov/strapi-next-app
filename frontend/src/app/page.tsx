async function getStrapiData(url: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + url);
    if (!response.ok) {
      throw new Error("Failed to fetch data from Strapi");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from Strapi:", error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");

  console.log("Strapi Data:", strapiData);

  const { title, description } = strapiData.data;

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>
    </main>
  );
}
