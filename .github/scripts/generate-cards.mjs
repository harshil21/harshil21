import statsApi from "github-readme-stats/api/index.js";
import topLangsApi from "github-readme-stats/api/top-langs.js";
import repoApi from "github-readme-stats/api/pin.js";
import { writeFile, mkdir } from "node:fs/promises";

/**
 * Call a github-readme-stats API handler and return the rendered SVG string.
 * The handlers use an Express-like (req, res) interface, so we pass a mock res
 * that captures the value passed to res.send().
 *
 * @param {Function} handler
 * @param {Record<string, string>} query
 * @returns {Promise<string>}
 */
const render = async (handler, query) => {
  let svg = "";
  const res = {
    setHeader: () => { },
    send: (v) => {
      svg = v;
    },
  };
  await handler({ query }, res);
  if (!svg) throw new Error(`Empty output for query: ${JSON.stringify(query)}`);
  return svg;
};

await mkdir("profile", { recursive: true });

const USER = "harshil21";
const MOCHA = "catppuccin_mocha";
const LATTE = "catppuccin_latte";

/** @type {Array<[Function, Record<string, string>, string]>} */
const cards = [
  // ── Stats ────────────────────────────────────────────────────────────────
  [
    statsApi,
    { username: USER, show_icons: "true", rank_icon: "percentile", show: "reviews,prs_merged", theme: MOCHA },
    "profile/stats-dark.svg",
  ],
  [
    statsApi,
    { username: USER, show_icons: "true", rank_icon: "percentile", show: "reviews,prs_merged", theme: LATTE },
    "profile/stats-light.svg",
  ],

  // ── Top languages ─────────────────────────────────────────────────────────
  [
    topLangsApi,
    { username: USER, layout: "compact", langs_count: "6", theme: MOCHA },
    "profile/top-langs-dark.svg",
  ],
  [
    topLangsApi,
    { username: USER, layout: "compact", langs_count: "6", theme: LATTE },
    "profile/top-langs-light.svg",
  ],

  // ── Pin cards ─────────────────────────────────────────────────────────────
  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "AirbrakesV2", show_owner: "false", theme: MOCHA }, "profile/pin-AirbrakesV2-dark.svg"],
  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "AirbrakesV2", show_owner: "false", theme: LATTE }, "profile/pin-AirbrakesV2-light.svg"],

  [repoApi, { username: USER, repo: "carbonpy", show_owner: "false", theme: MOCHA }, "profile/pin-carbonpy-dark.svg"],
  [repoApi, { username: USER, repo: "carbonpy", show_owner: "false", theme: LATTE }, "profile/pin-carbonpy-light.svg"],

  [repoApi, { username: "python-telegram-bot", repo: "python-telegram-bot", show_owner: "false", theme: MOCHA }, "profile/pin-python-telegram-bot-dark.svg"],
  [repoApi, { username: "python-telegram-bot", repo: "python-telegram-bot", show_owner: "false", theme: LATTE }, "profile/pin-python-telegram-bot-light.svg"],

  [repoApi, { username: USER, repo: "TGDates", show_owner: "false", theme: MOCHA }, "profile/pin-TGDates-dark.svg"],
  [repoApi, { username: USER, repo: "TGDates", show_owner: "false", theme: LATTE }, "profile/pin-TGDates-light.svg"],

  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "FIRM", show_owner: "false", theme: MOCHA }, "profile/pin-FIRM-dark.svg"],
  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "FIRM", show_owner: "false", theme: LATTE }, "profile/pin-FIRM-light.svg"],

  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "airbrakes-pi-hat", show_owner: "false", theme: MOCHA }, "profile/pin-airbrakes-pi-hat-dark.svg"],
  [repoApi, { username: "NCSU-High-Powered-Rocketry-Club", repo: "airbrakes-pi-hat", show_owner: "false", theme: LATTE }, "profile/pin-airbrakes-pi-hat-light.svg"],

  [repoApi, { username: USER, repo: "Aloft", show_owner: "false", theme: MOCHA }, "profile/pin-Aloft-dark.svg"],
  [repoApi, { username: USER, repo: "Aloft", show_owner: "false", theme: LATTE }, "profile/pin-Aloft-light.svg"],
];

const results = await Promise.allSettled(
  cards.map(async ([handler, query, outPath]) => {
    const svg = await render(handler, query);
    await writeFile(outPath, svg, "utf8");
    console.log(`✓ ${outPath}`);
  }),
);

let failed = false;
for (const [i, result] of results.entries()) {
  if (result.status === "rejected") {
    console.error(`✗ ${cards[i][2]}: ${result.reason}`);
    failed = true;
  }
}

if (failed) process.exit(1);
