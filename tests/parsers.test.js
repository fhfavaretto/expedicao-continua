import { describe, expect, it } from "vitest";
import { loadApp, readFixture } from "./loadApp.js";

describe("regressão — parsers TDN", () => {
  const { app } = loadApp();

  it("LIB: extrai histórico Versão LIB YYYYMMDD_P12 e define última/próxima", () => {
    const html = readFixture("lib-release-notes.html");
    const parsed = app.parseLibFromHtml(html);

    expect(parsed.error).toBeUndefined();
    expect(parsed.history.length).toBeGreaterThanOrEqual(5);
    expect(parsed.history[0].code).toMatch(/^20\d{6}$/);
    expect(parsed.latest).toBeTruthy();
    expect(parsed.latest.code).toMatch(/^20\d{6}$/);
    expect(parsed.latest.pageUrl).toContain("tdn.totvs.com");
    // URL da LIB no módulo não pode usar "|" (quebra proxy com HTTP 400).
    const libMod = app.TABS.lib.modules[0];
    expect(libMod.url).not.toMatch(/\||%7C/i);
    expect(libMod.url).toContain("pageId=152798709");
    expect(libMod.childrenUrl).toContain("152798709/child/page");
  });

  it("LIB: API de children também monta o histórico", () => {
    const json = readFixture("lib-children.json");
    const parsed = app.parseLibFromChildren(json);

    expect(parsed.error).toBeUndefined();
    expect(parsed.history.length).toBeGreaterThanOrEqual(5);
    expect(parsed.next || parsed.latest).toBeTruthy();
  });

  it("Backoffice: extrai data de corte e link de download", () => {
    const html = readFixture("backoffice-faturamento.html");
    const parsed = app.parsePackageFromHtml(html);

    expect(parsed.error).toBeUndefined();
    expect(parsed.cutoffDate).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(parsed.downloadUrl).toMatch(/^https?:\/\//);
    expect(String(parsed.packageName || "").toLowerCase()).toContain("backoffice");
  });

  it("Qualidade: lista pacotes por release", () => {
    const html = readFixture("quality.html");
    const parsed = app.parseQualityFromHtml(html);

    expect(parsed.error).toBeUndefined();
    expect(parsed.releases.length).toBeGreaterThanOrEqual(1);
    expect(parsed.releases[0].release).toBeTruthy();
    expect(parsed.releases[0].downloadUrl).toMatch(/^https?:\/\//);
  });

  it("AppServer: top 3 famílias a partir da API de children", () => {
    const json = readFixture("appserver-children.json");
    const families = app.parseAppServerFamilies(json);

    expect(families.length).toBeLessThanOrEqual(3);
    expect(families.length).toBeGreaterThanOrEqual(1);
    expect(families[0].title).toMatch(/Application Server/i);
    expect(families[0].pageUrl).toContain("pageId=");
  });

  it("AppServer: top 3 releases da página da família", () => {
    const html = readFixture("appserver-family-24.html");
    const releases = app.parseAppServerFamilyPage(html);

    expect(releases.length).toBeGreaterThanOrEqual(1);
    expect(releases.length).toBeLessThanOrEqual(3);
    expect(releases[0].name).toMatch(/Application Server\s*-\s*\d+\.\d+\.\d+\.\d+/i);
    expect(releases[0].pageUrl).toContain("tdn.totvs.com");
  });

  it("AppServer OS: agrupa sistemas operacionais homologados", () => {
    const html = readFixture("appserver-os.html");
    const parsed = app.parseAppServerOsPage(html);

    expect(parsed.error).toBeUndefined();
    expect(parsed.groups.length).toBeGreaterThanOrEqual(3);
    const names = parsed.groups.flatMap((g) => g.items.map((i) => i.name)).join(" | ");
    expect(names).toMatch(/Windows Server/i);
    expect(names).toMatch(/Oracle Linux|Red Hat|SUSE/i);
    expect(parsed.groups.some((g) => g.items.some((i) => /SUPPORTED|EOL/i.test(i.status)))).toBe(
      true
    );
  });

  it("AppServer config: lista seções do appserver.ini", () => {
    const json = readFixture("appserver-config-children.json");
    const sections = app.parseAppServerConfigSections(json);

    expect(sections.length).toBeGreaterThanOrEqual(1);
    expect(sections[0].sectionKey).toMatch(/^\[.+\]$/);
  });

  it("DBAccess: famílias ativas a partir da API de children", () => {
    const json = readFixture("dbaccess-children.json");
    const families = app.parseDbAccessFamilies(json);

    expect(families.length).toBeGreaterThanOrEqual(1);
    expect(families.length).toBeLessThanOrEqual(3);
    expect(families[0].title).toMatch(/DBAccess\s*-\s*\d+\.\d+\.y\.z/i);
  });

  it("DBAccess: releases da página da família 26.1", () => {
    const html = readFixture("dbaccess-family-26.html");
    const releases = app.parseDbAccessFamilyPage(html);

    expect(releases.length).toBeGreaterThanOrEqual(1);
    expect(releases[0].name).toMatch(/DBAccess\s*-\s*26\.1\.\d+\.\d+/i);
  });

  it("DBAccess: fallback por children da família 24.1", () => {
    const json = readFixture("dbaccess-family-24-children.json");
    const releases = app.parseDbAccessFamilyFromChildren(json);

    expect(releases.length).toBe(3);
    expect(releases[0].name).toMatch(/DBAccess\s*-\s*24\.1\.\d+\.\d+/i);
  });

  it("DBAccess config: seções e nomenclatura do ini", () => {
    const sections = app.parseDbAccessConfigSections(
      readFixture("dbaccess-config-children.json")
    );
    const intro = app.parseDbAccessConfigIntro(readFixture("dbaccess-config.html"));

    expect(sections.length).toBeGreaterThanOrEqual(5);
    expect(sections.some((s) => s.sectionKey === "[General]")).toBe(true);
    expect(intro.nomenclature.length).toBeGreaterThanOrEqual(2);
    expect(intro.nomenclature.some((n) => /dbaccess\.ini/i.test(n.file))).toBe(true);
  });

  it("DBAccess: bancos de dados homologados agrupados", () => {
    const parsed = app.parseDbAccessDatabasesPage(readFixture("dbaccess-databases.html"));

    expect(parsed.error).toBeUndefined();
    expect(parsed.groups.length).toBeGreaterThanOrEqual(3);
    const names = parsed.groups.flatMap((g) => g.items.map((i) => i.name)).join(" | ");
    expect(names).toMatch(/SQL Server|Oracle|PostgreSQL/i);
    expect(parsed.groups.some((g) => g.items.some((i) => /SUPPORTED|EOL/i.test(i.status)))).toBe(
      true
    );
  });

  it("DBAccess OS: sistemas operacionais homologados", () => {
    const parsed = app.parseAppServerOsPage(readFixture("dbaccess-os.html"));

    expect(parsed.error).toBeUndefined();
    expect(parsed.groups.length).toBeGreaterThanOrEqual(3);
    const names = parsed.groups.flatMap((g) => g.items.map((i) => i.name)).join(" | ");
    expect(names).toMatch(/Windows Server/i);
  });
});

describe("regressão — contratos da UI/config", () => {
  const { app } = loadApp();

  it("BINARIO_TABS expõe AppServer com releases, config e OS", () => {
    const mods = app.BINARIO_TABS.appserver.modules;
    expect(mods.map((m) => m.type).sort()).toEqual([
      "appserver",
      "appserver-config",
      "appserver-os",
    ].sort());
  });

  it("BINARIO_TABS expõe DBAccess completo", () => {
    const mods = app.BINARIO_TABS.dbaccess.modules;
    expect(mods.map((m) => m.type).sort()).toEqual([
      "dbaccess",
      "dbaccess-config",
      "dbaccess-databases",
      "dbaccess-os",
    ].sort());
    expect(mods.every((m) => m.url || m.pageId)).toBe(true);
  });

  it("tecDisplayUrl / parseAppServerFamilyPage não quebram sem link na lista", () => {
    const html = `
      <div id="main-content">
        <table>
          <tr><th>Apelido</th><th>x</th><th>Releases</th><th>Status</th><th>Homologado</th></tr>
          <tr>
            <td>Application Server - 24.3.9.9</td>
            <td>Teste</td>
            <td><time datetime="2026-01-01">01 Jan 2026</time></td>
            <td>HOMOLOGADO</td>
            <td>AdvPL</td>
          </tr>
        </table>
      </div>`;
    const releases = app.parseAppServerFamilyPage(html);
    expect(releases).toHaveLength(1);
    expect(releases[0].pageUrl).toContain("Application+Server+-+24.3.9.9");
  });
});
