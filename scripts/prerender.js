import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "../dist");
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
    "/",
    "/about",
    "/services",
    "/projects",
    "/contact",
    "/quote",
    "/products",
    "/courses",
];

function waitForServer(url, timeout = 30000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const check = async () => {
            try {
                const res = await fetch(url);
                if (res.ok) return resolve();
            } catch {
                /* retry */
            }
            if (Date.now() - start > timeout) reject(new Error("Preview server timeout"));
            else setTimeout(check, 500);
        };
        check();
    });
}

async function main() {
    const preview = spawn("npm run preview -- --port " + PORT + " --strictPort", {
        shell: true,
        stdio: "ignore",
        cwd: join(__dirname, ".."),
    });

    try {
        await waitForServer(BASE);
        const browser = await chromium.launch();
        const page = await browser.newPage();

        for (const route of ROUTES) {
            await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
            await page.waitForTimeout(1500);
            const html = await page.content();
            const outDir = route === "/" ? DIST : join(DIST, route.slice(1));
            mkdirSync(outDir, { recursive: true });
            const outFile = route === "/" ? join(DIST, "index.html") : join(outDir, "index.html");
            writeFileSync(outFile, html, "utf8");
            console.log("Prerendered:", route);
        }

        await browser.close();
    } finally {
        preview.kill();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
