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
      <div className="h-7 w-3/4 bg-white/10 rounded mb-2" /> {/* Title */}
      <div className="space-y-2 mb-4">
        {" "}
        {/* Description */}
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-3/4" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {" "}
        {/* Badges */}
        <div className="h-7 bg-white/10 rounded" />
        <div className="h-7 bg-white/10 rounded" />
        <div className="h-7 bg-white/10 rounded" />
        <div className="h-7 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function InfoPopout({ media, visible }: InfoPopoutProps) {
  const [description, setDescription] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [backdrop, setBackdrop] = useState<string | undefined>();

  useEffect(() => {
    async function fetchDescription() {
      setIsLoading(true);
      try {
        const type =
          media.type === "movie" ? TMDBContentTypes.MOVIE : TMDBContentTypes.TV;
        const details = await getMediaDetails(media.id, type);
        const backdropUrl = getMediaBackdrop(details.backdrop_path);
        setDescription(details.overview || undefined);
        setBackdrop(backdropUrl);
      } catch (err) {
        console.error("Failed to fetch media description:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (visible && !description) {
      fetchDescription();
    }
  }, [media.id, media.type, visible, description]);

  return (
    <div
      className={classNames(
        "absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 ml-1 w-[280px] rounded-xl overflow-hidden transition-all duration-300",
        "backdrop-blur-md bg-background-main/80 border border-mediaCard-hoverAccent/20",
        "z-[999]",
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4 pointer-events-none",
      )}
      onMouseEnter={() => media.onHoverInfoEnter?.()}
      onMouseLeave={() => media.onHoverInfoLeave?.()}
    >
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: media.poster ? `url(${media.poster})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px)",
        }}
      />

      <div className="p-4">
        {isLoading ? (
          <InfoSkeleton />
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-2">{media.title}</h3>
            <div className="relative h-36 mb-4">
              <div className="absolute inset-0 bg-white/10 rounded" />
              {backdrop && (
                <img
                  src={backdrop}
                  alt={media.title}
                  className="absolute inset-0 w-full h-full object-cover rounded"
                />
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-200 mb-4 line-clamp-4">
                {description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="px-2 py-1 rounded bg-white/10 text-gray-200">
                <span className="text-gray-400">Type: </span>
                {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
              </div>
              {media.year && (
                <div className="px-2 py-1 rounded bg-white/10 text-gray-200">
                  <span className="text-gray-400">Year: </span>
                  {media.year}
                </div>
              )}
              {media.release_date && (
                <div className="px-2 py-1 rounded bg-white/10 text-gray-200">
                  <span className="text-gray-400">Release: </span>
                  {media.release_date.toLocaleDateString()}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
