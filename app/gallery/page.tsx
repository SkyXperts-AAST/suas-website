import type { Metadata } from "next";
import ScrollGallery from "@/components/gallery/ScrollGallery";
import { GALLERY_ITEMS } from "@/lib/gallery/items";

export const metadata: Metadata = {
  title: "Gallery | SkyXperts",
  description:
    "Field tests, competitions and the people behind SkyXperts.",
};

export default function GalleryPage() {
  return <ScrollGallery items={GALLERY_ITEMS} />;
}
