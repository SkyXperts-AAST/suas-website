import type { Metadata } from "next";
import ScrollGallery from "@/components/gallery/ScrollGallery";
import { GALLERY_ITEMS } from "@/lib/gallery/items";

export const metadata: Metadata = {
  title: "Gallery | SkyXperts",
  description:
    "Scroll through SkyXperts SUAS build moments, field tests, and competition preparation.",
};

export default function GalleryPage() {
  return <ScrollGallery items={GALLERY_ITEMS} />;
}
