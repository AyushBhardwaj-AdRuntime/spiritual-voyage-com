import haramArchesImg from "@/assets/haram-arches.jpg";
import makkahMadinaViewImg from "@/assets/makkah-madina-view.jpg";
import heroVideoSrc from "@/assets/hero-video.mp4";
import makkahMadinaImg from "@/assets/makkah-madina.jpg";
import madinahGateImg from "@/assets/madinah-gate.jpg";
import makkahImg from "@/assets/makkah.jpg";
import image1 from "@/assets/image1.jpg";
import image2 from "@/assets/image2.jpg";
import image3 from "@/assets/image3.jpg";
import image4 from "@/assets/image4.jpg";
import image5 from "@/assets/image5.jpg";
import video2 from "@/assets/vedio2.mp4";
import video3 from "@/assets/vedio3.mp4";
import video4 from "@/assets/vedio4.mp4";

/** Real client-supplied media. Add more entries here as new photos arrive. */
export const media = {
  // Using vedio2.mp4 as it's a smaller optimized video than the 10mb one, but keeping heroVideoSrc as fallback
  heroVideo: video2 || heroVideoSrc,
  heroPoster: makkahMadinaViewImg,
  haramDawn: makkahMadinaImg,
  haramArches: haramArchesImg,
  kabah: makkahImg,
  madinahGate: madinahGateImg,
  madinahDomes: image3,
} as const;

/** Ordered pool used to fill gallery grids until every slot has its own photo. */
export const photoPool: string[] = [
  image1,
  image2,
  image3,
  image4,
  image5,
  makkahImg,
  media.haramDawn,
  media.madinahGate,
  media.kabah,
  media.madinahDomes,
  media.haramArches,
];

/** Deterministic photo for a grid index. */
export function photoAt(index: number): string {
  return photoPool[index % photoPool.length]!;
}
