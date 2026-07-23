import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Carrega o index.html em JSDOM e devolve a API pública dos parsers.
 * Usado pelos testes de regressão a cada melhoria.
 */
export function loadApp() {
  const html = readFileSync(join(root, "index.html"), "utf8");
  const dom = new JSDOM(html, {
    url: "https://example.test/expedicao-continua/",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });

  const app = dom.window.ExpedicaoContinua;
  if (!app) {
    throw new Error("ExpedicaoContinua não foi exportado pelo index.html");
  }

  return { dom, window: dom.window, document: dom.window.document, app };
}

export function readFixture(name) {
  return readFileSync(join(root, "tests", "fixtures", name), "utf8");
}
