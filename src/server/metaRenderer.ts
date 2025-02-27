import axios from "axios";

import { conf } from "@/setup/config";

interface MetaRenderOptions {
  type: string;
  id: string;
  seasonID?: string;
  episodeID?: string;
}

export async function renderMetaTags({
  type,
  id,
}: MetaRenderOptions): Promise<string> {
  try {
    const tmdbType = type === "tmdb-tv" ? "tv" : "movie";
    const response = await axios.get(
      `https://api.themoviedb.org/3/${tmdbType}/${id}?api_key=${conf().TMDB_READ_API_KEY}&language=en-US`,
    );

    const media = response.data;
    let mediaTitle = media.title || media.name;

    // Truncate title if longer than 22 characters
    if (mediaTitle.length > 22) {
      mediaTitle = `${mediaTitle.substring(0, 22)}...`;
    }
    const overview = media.overview
      ? media.overview.substring(0, 200) +
        (media.overview.length > 200 ? "..." : "")
      : "";
    const imageUrl = `https://image.tmdb.org/t/p/original${media.backdrop_path || media.poster_path}`;

    return `
      <title>${mediaTitle} | P-Stream - Stream Your Favorite Movies & TV Shows For Free</title>
      <meta name="description" content="${overview}" />
      <meta property="og:title" content="${mediaTitle} | P-Stream - Stream Movies & TV Shows For Free" />
      <meta property="og:description" content="${overview}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${mediaTitle} | P-Stream - Stream Movies & TV Shows For Free" />
      <meta name="twitter:description" content="${overview}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;
  } catch (error) {
    console.error("Error fetching meta data:", error);
    return ""; // Return empty string on error
  }
}
