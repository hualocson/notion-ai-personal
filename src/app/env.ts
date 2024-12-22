// src/env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NOTION_TOKEN: z.string().min(1),
    GEMINI_TOKEN: z.string().min(1),
  },
  runtimeEnv: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    GEMINI_TOKEN: process.env.GEMINI_TOKEN,
  },
});
