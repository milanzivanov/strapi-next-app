import { HeroSection } from "@/components/custom/hero-section";
import qs from "qs";

const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"]
            },
            link: {
              populate: true
            }
          }
        }
      }
    }
  }
});

async function getStrapiData(path: string) {
  const baseUrl = "http://localhost:1337";

  const url = new URL(path, baseUrl);
  url.search = homePageQuery;

  try {
    const response = await fetch(url.href);
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

  console.dir(strapiData.data, { depth: null });

  const { blocks } = strapiData.data;

  return (
    <main className="container mx-auto py-6">
      <HeroSection data={blocks[0]} />
    </main>
  );
}
