import InteractiveBentoGallery from "@/components/blocks/interactive-bento-gallery";
import type { MediaItemType } from "@/components/blocks/interactive-bento-gallery";

import raayanVideo from '@/assets/Raayan Short Cinematic video - ROTATE - Videobolt.net.mp4';

const mediaItems: MediaItemType[] = [
  {
    id: 1,
    type: "image",
    title: "Live Harmony",
    desc: "A focused live music setup capturing collaboration, rhythm, and creative energy in motion.",
    url: "https://cdn.designfast.io/image/2026-04-19/0214bf3e-4b92-4a9e-8d2d-4d2f5061d588.webp",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "video",
    title: "Cinematic Motion",
    desc: "High-end video editing and motion graphics.",
    url: raayanVideo,
    span: "md:col-span-2 md:row-span-2 col-span-1 sm:col-span-2 sm:row-span-2",
    // rotate: 90,
  },
  {
    id: 3,
    type: "image",
    title: "Experimental Layouts",
    desc: "Pushing the boundaries of visual hierarchy",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    span: "md:col-span-1 md:row-span-3 sm:col-span-2 sm:row-span-2 ",
  },
  {
    id: 4,
    type: "image",
    title: "Editorial Design",
    desc: "Premium typography and minimalist aesthetics",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 5,
    type: "video",
    title: "Vibrant Storytelling",
    desc: "Capturing emotion through color and motion",
    url: "https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 6,
    type: "image",
    title: "Digital Artistry",
    desc: "Where technology meets creative expression",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2 ",
  },
  {
    id: 7,
    type: "video",
    title: "Immersive Experiences",
    desc: "Building digital sanctuaries for modern brands.",
    url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 ",
  },
];

export const GallerySection = () => {
  return (
    <div className="min-h-screen overflow-y-auto bg-black py-10 px-2 md:px-12 lg:px-5">
      <InteractiveBentoGallery
        mediaItems={mediaItems}
        title="Curated Design Collection"
        description="A showcase of motion, branding, and cinematic storytelling. Drag to explore."
      />
    </div>
  );
};

export default GallerySection;
