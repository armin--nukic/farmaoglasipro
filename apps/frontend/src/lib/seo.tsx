import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
};

const SITE_URL = "https://farma.ice.lol";

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function Seo({ title, description, canonicalPath = "/", image = "/og-image.svg" }: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${canonicalPath}`;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", absoluteImage);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  }, [canonicalPath, description, image, title]);

  return null;
}
