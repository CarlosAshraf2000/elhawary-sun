/**
 * Generates sitemap.xml at build time.
 * Run: node scripts/generate-sitemap.js
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.VITE_SITE_URL || "https://elhawary-sun.vercel.app";

const STATIC_ROUTES = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/about", priority: "0.8", changefreq: "monthly" },
    { path: "/services", priority: "0.8", changefreq: "monthly" },
    { path: "/projects", priority: "0.8", changefreq: "weekly" },
    { path: "/contact", priority: "0.7", changefreq: "monthly" },
    { path: "/quote", priority: "0.9", changefreq: "monthly" },
    { path: "/products", priority: "0.9", changefreq: "daily" },
    { path: "/courses", priority: "0.7", changefreq: "weekly" },
];

const lastmod = new Date().toISOString().split("T")[0];

const urls = STATIC_ROUTES.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path === "/" ? "/" : path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
).join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>
`;

writeFileSync(join(__dirname, "../public/sitemap.xml"), sitemap, "utf8");
console.log("Generated public/sitemap.xml with", STATIC_ROUTES.length, "URLs");
