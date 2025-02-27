import express from "express";

import { metaMiddleware } from "./middleware";

const app = express();

// Apply the meta middleware before serving static files
app.use(metaMiddleware);

// Your other middleware and routes...
