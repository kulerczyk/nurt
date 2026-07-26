import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // CLI (migrate, studio, introspect) łączy się z bazą z pominięciem poolera -
  // stąd DIRECT_URL, nie DATABASE_URL (ten drugi jest dla runtime aplikacji).
  datasource: {
    url: env("DIRECT_URL"),
  },
});
