import { SpriteGallery } from "@/components/pixel/sprite-gallery";

export const metadata = { title: "Huacoween — sprites" };

/** Dev gallery to review every piece of pixel art at a glance. */
export default function SpritesPage() {
  return (
    <main className="min-h-dvh bg-night p-6 text-white">
      <SpriteGallery />
    </main>
  );
}
