import fs from "fs/promises";
import path from "path";

import { NextFunction, Request, Response } from "express";

import { renderMetaTags } from "./metaRenderer";

export async function metaMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const match = req.path.match(
    /^\/media\/(tmdb-tv|tmdb-movie)-(\d+)-([^/]+)(?:\/(\d+))?(?:\/(\d+))?$/,
  );

  if (!match) {
    return next();
  }

  const [, type, id, , seasonID, episodeID] = match;

  try {
    // Read the index.html template
    const indexPath = path.resolve(__dirname, "../index.html");
    let html = await fs.readFile(indexPath, "utf-8");

    // Generate meta tags
    const metaTags = await renderMetaTags({
      type,
      id,
      seasonID,
      episodeID,
    });

    // Replace the meta tags placeholder
    html = html.replace("<!--META_TAGS-->", metaTags);

    // Send the modified HTML
    res.send(html);
  } catch (error) {
    console.error("Error in meta middleware:", error);
    next();
  }
}
