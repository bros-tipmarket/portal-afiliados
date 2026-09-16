// Publica o build estático do portal na branch `gh-pages`, servida pelo
// GitHub Pages em https://bros-tipmarket.github.io/portal-afiliados/.
//
// O caminho base precisa bater com o nome do repositório: o portal não fica
// na raiz do domínio, então os arquivos de `public/` são resolvidos por
// `asset()` a partir de `import.meta.env.BASE_URL`.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.PORTAL_BASE ?? "/portal-afiliados/";
const out = path.join(root, "dist-static");
const stage = path.join(root, ".pages-worktree");

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32", ...options });
  if (result.status !== 0) {
    throw new Error(`Falhou: ${cmd} ${args.join(" ")}`);
  }
}

run("npx", ["vite", "build", "--config", "vite.static.config.ts"], {
  env: { ...process.env, PORTAL_BASE: base },
});

// `.nojekyll` impede que o GitHub Pages ignore arquivos iniciados por "_".
writeFileSync(path.join(out, ".nojekyll"), "");

rmSync(stage, { recursive: true, force: true });
run("git", ["worktree", "prune"]);

const branches = spawnSync("git", ["ls-remote", "--heads", "origin", "gh-pages"], { cwd: root, encoding: "utf8" });
const exists = Boolean(branches.stdout?.trim());
run("git", exists
  ? ["worktree", "add", stage, "-B", "gh-pages", "origin/gh-pages"]
  : ["worktree", "add", stage, "--orphan", "-b", "gh-pages"]);

for (const entry of readdirSync(stage)) {
  if (entry !== ".git") rmSync(path.join(stage, entry), { recursive: true, force: true });
}
mkdirSync(stage, { recursive: true });
cpSync(out, stage, { recursive: true });

run("git", ["add", "-A"], { cwd: stage });
const status = spawnSync("git", ["status", "--porcelain"], { cwd: stage, encoding: "utf8" });
if (status.stdout?.trim()) {
  run("git", ["commit", "-m", `Publicar portal (base ${base})`], { cwd: stage });
  run("git", ["push", "origin", "gh-pages"], { cwd: stage });
  console.log(`\nPublicado. Pode levar cerca de um minuto para o GitHub Pages atualizar.`);
} else {
  console.log("\nNada mudou desde a última publicação.");
}

run("git", ["worktree", "remove", stage, "--force"]);
