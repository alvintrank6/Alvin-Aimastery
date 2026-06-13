import { useState } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
}

interface GalleryLabels {
  companyWebsite?: string;
  affiliateCampaign?: string;
  liveSellingResult?: string;
  product?: string;
  beforeAfter?: string;
  flatLay?: string;
  byeByePimpleWebsite?: string;
  resultAfterCampaign?: string;
  serum?: string;
  routine?: string;
  liveResult?: string;
}

export default function ProjectMediaGallery({
  media,
  color,
  labels = {},
}: {
  media: MediaItem[];
  color: string;
  labels?: GalleryLabels;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mainImage = media[0];
  const secondaryImage = media[1];

  const openLightbox = (index: number) => {
    if (media[index].type === 'image') {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex === null) return;
    const imageIndices = media
      .map((_, i) => i)
      .filter((i) => media[i].type === 'image');
    const currentPos = imageIndices.indexOf(lightboxIndex);
    const nextPos = (currentPos + 1) % imageIndices.length;
    setLightboxIndex(imageIndices[nextPos]);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    const imageIndices = media
      .map((_, i) => i)
      .filter((i) => media[i].type === 'image');
    const currentPos = imageIndices.indexOf(lightboxIndex);
    const prevPos = (currentPos - 1 + imageIndices.length) % imageIndices.length;
    setLightboxIndex(imageIndices[prevPos]);
  };

  return (
    <>
      {/* Gallery row */}
      {media.length >= 4 && media.length <= 6 ? (
        /* Layout for 4–6 portrait images */
        media.length === 5 ? (
          /* 5 images: 3 on top row + 2 centered on bottom row */
          <div className="flex flex-col gap-3 w-full p-2">
            {/* Top row: 3 images */}
            <div className="grid grid-cols-3 gap-3">
              {media.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={item.src}
                    alt={item.alt || ''}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                    {labels.affiliateCampaign ?? 'Affiliate Campaign'}
                  </div>
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                    <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom row: 2 centered images */}
            <div className="flex justify-center gap-3">
              {media.slice(3, 5).map((item, idx) => (
                <div
                  key={idx + 3}
                  className="relative w-[calc(33.333%-8px)] aspect-[9/16] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                  onClick={() => openLightbox(idx + 3)}
                >
                  <img
                    src={item.src}
                    alt={item.alt || ''}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                    {idx === 0 ? (labels.byeByePimpleWebsite ?? 'Bye Bye Pimple Website') : (labels.resultAfterCampaign ?? 'Result after campaign')}
                  </div>
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                    <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : media.length === 6 ? (
          /* 6 images: 4 on top row + 2 centered on bottom row */
          <div className="flex flex-col gap-3 w-full p-2">
            {/* Top row: 4 images */}
            <div className="grid grid-cols-4 gap-3">
              {media.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={item.src}
                    alt={item.alt || ''}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                    {idx === 0 ? (labels.liveResult ?? 'Live Result') : idx === 1 ? (labels.product ?? 'Product') : idx === 2 ? (labels.beforeAfter ?? 'Before/After') : (labels.flatLay ?? 'Flat Lay')}
                  </div>
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                    <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
                  </div>
                </div>
              ))}
            </div>
            {/* Bottom row: 2 centered images */}
            <div className="flex justify-center gap-3">
              {media.slice(4, 6).map((item, idx) => (
                <div
                  key={idx + 4}
                  className="relative w-1/4 aspect-[9/16] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                  onClick={() => openLightbox(idx + 4)}
                >
                  <img
                    src={item.src}
                    alt={item.alt || ''}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                    {idx === 0 ? (labels.serum ?? 'Serum') : (labels.routine ?? 'Routine')}
                  </div>
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                    <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 4 images: simple 2-col grid */
          <div className="flex flex-wrap justify-center gap-3 w-full p-2">
            {media.map((item, idx) => (
              <div
                key={idx}
                className="relative w-[calc(50%-6px)] aspect-[9/16] rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={item.src}
                  alt={item.alt || ''}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                  {idx === 0 ? (labels.liveResult ?? 'Live Result') : idx === 1 ? (labels.product ?? 'Product') : idx === 2 ? (labels.beforeAfter ?? 'Before/After') : (labels.flatLay ?? 'Flat Lay')}
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                  <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : media.length === 3 ? (
        /* 3 images: all 9:16 portrait, center stands out */
        <div className="flex w-full h-full gap-2 md:gap-4 p-2 py-2 md:py-4 items-center justify-center">
          {media.map((item, idx) => (
            <div
              key={idx}
              className={`relative aspect-[9/16] h-full rounded-xl overflow-hidden cursor-pointer group transition-transform duration-300
                ${idx === 1 ? 'scale-[1.04] md:scale-[1.06] shadow-[0_12px_40px_rgba(0,0,0,0.18)] border-[3px] border-white z-10' : 'border border-gray-100'}`}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={item.src}
                alt={item.alt || ''}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                {idx === 0 ? (labels.affiliateCampaign ?? 'Affiliate Campaign') : idx === 1 ? (labels.liveSellingResult ?? 'Live Selling Result') : (labels.liveResult ?? 'Live Result')}
              </div>
              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Existing single-row layout for 1–2 items */
        <div className={`flex w-full h-full p-2 items-center justify-center ${media.length === 1 ? 'gap-0' : 'gap-3'}`}>
          {/* Item 1: main image */}
          {mainImage && (
            <div
              className={`relative ${media.length === 1 ? 'w-full' : 'w-1/2 aspect-video'} h-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer group`}
              onClick={() => openLightbox(0)}
            >
              <img
                src={mainImage.src}
                alt={mainImage.alt || ''}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {/* Frame badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                {labels.companyWebsite ?? 'Company Website'}
              </div>
              {/* Zoom hint */}
              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
              </div>
            </div>
          )}

          {/* Item 2: secondary image */}
          {secondaryImage && (
            <div
              className={`relative ${media.length === 1 ? 'w-full' : 'w-1/2 aspect-video'} h-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer group`}
              onClick={() => openLightbox(1)}
            >
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt || ''}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[10px] font-medium text-[#3E4A52] border border-white/40">
                {labels.affiliateCampaign ?? 'Affiliate Campaign'}
              </div>
              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/40">
                <i className="ri-zoom-in-line text-sm text-[#1C2526]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <i className="ri-close-line text-xl" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous image"
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>

          {/* Image */}
          <img
            src={media[lightboxIndex].src}
            alt={media[lightboxIndex].alt || ''}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
        </div>
      )}
    </>
  );
}