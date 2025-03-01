import classNames from "classnames";
import { useEffect, useState } from "react";

import { getMediaBackdrop, getMediaDetails } from "@/backend/metadata/tmdb";
import { TMDBContentTypes } from "@/backend/metadata/types/tmdb";
import { MediaItem } from "@/utils/mediaTypes";

interface InfoPopoutProps {
  media: MediaItem;
  visible: boolean;
}

function InfoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative h-40">
        <div
          className="absolute inset-0 bg-mediaCard-hoverBackground"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
          }}
        />
      </div>
      <div className="px-4 pb-4 mt-[-10px]">
        <div className="h-7 w-3/4 bg-white/10 rounded mb-2" /> {/* Title */}
        <div className="space-y-2 mb-4">
          {/* Description */}
          <div className="h-4 bg-mediaCard-hoverBackground rounded w-full" />
          <div className="h-4 bg-mediaCard-hoverBackground rounded w-full" />
          <div className="h-4 bg-mediaCard-hoverBackground rounded w-full" />
          <div className="h-4 bg-mediaCard-hoverBackground rounded w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Badges */}
          <div className="h-7 bg-mediaCard-hoverBackground rounded" />
          <div className="h-7 bg-mediaCard-hoverBackground rounded" />
        </div>
      </div>
    </div>
  );
}

export function InfoPopout({ media, visible }: InfoPopoutProps) {
  const [description, setDescription] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [backdrop, setBackdrop] = useState<string | undefined>();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchDescription() {
      if (dataLoaded) return; // Skip if already loaded

      setIsLoading(true);
      try {
        const type =
          media.type === "movie" ? TMDBContentTypes.MOVIE : TMDBContentTypes.TV;
        const details = await getMediaDetails(media.id, type);
        const backdropUrl = getMediaBackdrop(details.backdrop_path);
        setDescription(details.overview || undefined);
        setBackdrop(backdropUrl);
        setDataLoaded(true);
      } catch (err) {
        console.error("Failed to fetch media description:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Start loading data as soon as the user might need it
    // This happens when the parent component indicates a hover via media.onHoverInfoEnter
    if (media.onHoverInfoEnter && !dataLoaded) {
      fetchDescription();
    }
  }, [media.id, media.type, media.onHoverInfoEnter, dataLoaded]);

  // Determine if we should show the popout based on visible prop and data loading state
  const showPopout = visible && (dataLoaded || isLoading);

  return (
    <div
      className={classNames(
        "absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ml-1 w-[280px] rounded-xl overflow-hidden transition-all duration-300",
        "backdrop-blur-md bg-background-main/80 border border-mediaCard-hoverAccent/40",
        "z-[999]",
        showPopout
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4 pointer-events-none",
      )}
      onMouseEnter={() => media.onHoverInfoEnter?.()}
      onMouseLeave={() => media.onHoverInfoLeave?.()}
    >
      <div className="absolute inset-0 -z-10 opacity-30 bg-mediaCard-hoverBackground" />
      <div className="p-0">
        {isLoading ? (
          <InfoSkeleton />
        ) : (
          <>
            <div className="relative h-40">
              <div className="absolute inset-0" />
              {backdrop && (
                <img
                  src={backdrop}
                  alt={media.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    maskImage:
                      "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
                    WebkitMaskImage:
                      "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
                  }}
                />
              )}
            </div>
            <div className="px-4 pb-4 mt-[-10px]">
              <h3 className="text-lg font-bold text-white mb-2">
                {media.title}
              </h3>
              {description && (
                <p className="text-sm text-white/90 mb-4 line-clamp-4">
                  {description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="px-2 py-1 rounded bg-mediaCard-hoverBackground text-type-secondary">
                  Type:{" "}
                  {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                </div>
                {media.year && (
                  <div className="px-2 py-1 rounded bg-mediaCard-hoverBackground text-type-secondary">
                    Year: {media.year}
                  </div>
                )}
                {media.release_date && (
                  <div className="px-2 py-1 rounded bg-mediaCard-hoverBackground text-type-secondary">
                    Release: {media.release_date.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
