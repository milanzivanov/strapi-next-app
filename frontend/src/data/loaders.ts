import qs from "qs";
import type {
  TStrapiResponse,
  THomePage,
  TGlobal,
  TMetaData,
  TSummary
} from "@/types";

import { api } from "@/data/data-api";
import { getStrapiURL } from "@/lib/utils";
import { actions } from "./actions";
import QueryString from "qs";

const baseUrl = getStrapiURL();

async function getHomePageData(): Promise<TStrapiResponse<THomePage>> {
  const query = qs.stringify({
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
          },
          "layout.features-section": {
            populate: {
              features: {
                populate: true
              }
            }
          }
        }
      }
    }
  });

  const url = new URL("/api/home-page", baseUrl);
  url.search = query;
  return api.get<THomePage>(url.href);
}

async function getGlobalData(): Promise<TStrapiResponse<TGlobal>> {
  // for error testing
  // throw new Error("Test error");

  const query = qs.stringify({
    populate: [
      "header.logoText",
      "header.ctaButton",
      "footer.logoText",
      "footer.socialLink"
    ]
  });

  const url = new URL("/api/global", baseUrl);
  url.search = query;
  return api.get<TGlobal>(url.href);
}

async function getMetaData(): Promise<TStrapiResponse<TMetaData>> {
  const query = qs.stringify({
    fields: ["title", "description"]
  });

  // console.log("////// getMetaData", query);

  const url = new URL("/api/global", baseUrl);
  url.search = query;
  return api.get<TMetaData>(url.href);
}

// summaries
async function getSummaries(
  queryString: string
): Promise<TStrapiResponse<TSummary[]>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const query = qs.stringify({
    sort: ["createdAt:desc"],
    ...(QueryString && {
      filters: {
        $or: [
          { title: { $containsi: queryString } },
          { content: { $containsi: queryString } }
        ]
      }
    })
  });

  const url = new URL("/api/summaries", baseUrl);
  url.search = query;
  return api.get<TSummary[]>(url.href, { authToken });
}

async function getSummaryByDocumentId(
  documentId: string
): Promise<TStrapiResponse<TSummary>> {
  const authToken = await actions.auth.getAuthTokenAction();
  if (!authToken) throw new Error("You are not authorized");

  const path = `/api/summaries/${documentId}`;
  const url = new URL(path, baseUrl);

  return api.get<TSummary>(url.href, { authToken });
}

export const loaders = {
  getHomePageData,
  getGlobalData,
  getMetaData,
  getSummaries,
  getSummaryByDocumentId
};
