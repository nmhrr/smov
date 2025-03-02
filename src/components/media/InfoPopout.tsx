import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

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
  const [shouldShow, setShouldShow] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start timer when user hovers
    if (visible && !shouldShow) {
      hoverTimerRef.current = setTimeout(() => {
        setShouldShow(true);
      }, 500);
    }

    // Clear timer when hover ends
    if (!visible && shouldShow) {
      setShouldShow(false);
    }

    // Clear timer on unmount or when visibility changes
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };
  }, [visible, shouldShow]);

  useEffect(() => {
    async function fetchData() {
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

    // Only fetch data after the delay has passed and the popout should be shown
    if (shouldShow && !dataLoaded && !isLoading) {
      fetchData();
    }
  }, [media.id, media.type, dataLoaded, shouldShow, isLoading]);

  // Only show popout after the hover delay has passed
  const showPopout = visible && shouldShow && (dataLoaded || isLoading);

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
      <div className="p-0">
        {isLoading ? (
          <InfoSkeleton />
        ) : (
          <div className="relative">
            {backdrop && (
              <div className="absolute top-0 left-0 right-0 h-full z-0">
                <img
                  src={backdrop}
                  alt={media.title}
                  className="w-full h-48 object-cover"
                  style={{
                    maskImage:
                      "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
                    WebkitMaskImage:
                      "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 60px)",
                  }}
                />
              </div>
            )}

            <div className="relative z-10">
              <div className="h-40" /> {/* Spacer for backdrop height */}
              <div className="px-4 pb-4 mt-[-30px]">
                <div className="flex flex-wrap gap-1 mb-2">
                  <div className="px-1.5 py-0.5 rounded bg-pill-background text-white text-xs border border-white/20">
                    {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                  </div>
                  {media.year && (
                    <div className="px-1.5 py-0.5 rounded bg-pill-background text-white text-xs border border-white/20">
                      {media.year}
                    </div>
                  )}
                  {media.release_date && (
                    <div className="px-1.5 py-0.5 rounded bg-pill-background text-white text-xs border border-white/20">
                      {media.release_date.toLocaleDateString()}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {media.title}
                </h3>
                {description && (
                  <p className="text-sm text-white/90 mb-4 line-clamp-4">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
