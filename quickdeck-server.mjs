import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.QUICKDECK_PORT || 4173);
const API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_MODEL || "gpt-6-luna";
const OPENAI_URL = "https://api.openai.com/v1/responses";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(data)
  });
  res.end(data);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1500000) throw new Error("Request too large");
  }
  return raw ? JSON.parse(raw) : {};
}

function outputText(response) {
  if (typeof response?.output_text === "string") return response.output_text;
  const parts = [];
  for (const item of response?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content || []) {
      if (part?.type === "output_text" && typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("\n").trim();
}

async function openai({ instructions, input, maxOutputTokens = 1200 }) {
  if (!API_KEY) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.status = 503;
    throw error;
  }
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input,
      max_output_tokens: maxOutputTokens
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.message || ("OpenAI API error (" + response.status + ")"));
    error.status = response.status;
    throw error;
  }
  return { text: outputText(data), usage: data.usage || null, responseId: data.id || null };
}

function compactProject(project = {}) {
  return {
    projectName: String(project.projectName || "").slice(0, 100),
    sectionName: String(project.sectionName || "").slice(0, 100),
    tasks: Array.isArray(project.tasks) ? project.tasks.slice(-60).map(t => ({
      text: String(t.text || "").slice(0, 300),
      done: !!t.done,
      streamHidden: !!t.streamHidden
    })) : [],
    settings: Array.isArray(project.settings) ? project.settings.slice(-80).map(s => ({
      category: String(s.category || "").slice(0, 80),
      label: String(s.label || "").slice(0, 160),
      value: String(s.value || "").slice(0, 1200)
    })) : [],
    scenarios: Array.isArray(project.scenarios) ? project.scenarios.slice(-40).map(s => ({
      title: String(s.title || "").slice(0, 160),
      body: String(s.body || "").slice(0, 5000)
    })) : []
  };
}

function recentMessages(messages = []) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-24).map(m => ({
    role: m.author === "assistant" ? "assistant" : "user",
    content: String(m.text || "").slice(0, 6000)
  }));
}

function parseJsonObject(text) {
  const cleaned = String(text || "")
    .replace(/^\s*\x60\x60\x60(?:json)?\s*/i, "")
    .replace(/\s*\x60\x60\x60\s*$/i, "")
    .trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first < 0 || last < first) throw new Error("AI returned invalid JSON");
  return JSON.parse(cleaned.slice(first, last + 1));
}

const CHAT_INSTRUCTIONS = [
  "あなたはゲーム制作専用の共同制作者です。日本語で自然に会話してください。",
  "ユーザーと一緒にシナリオ、謎、演出、UI、実装方針を具体化します。",
  "ユーザーが提示した確定設定を尊重し、勝手に設定を変更しません。",
  "不明点があっても制作を止めず、文脈から妥当な案を提示してください。",
  "回答は制作チャットとして読みやすく、必要以上に長くしません。",
  "この回答は制作画面だけに表示され、配信画面では伏せ字化されます。"
].join("\n");

const ORGANIZE_INSTRUCTIONS = [
  "あなたはゲーム制作ログの整理担当です。",
  "「確定された文章」から、明示的に確定した情報だけを抽出してください。",
  "推測、提案段階、選択肢、未確定事項は追加しないでください。",
  "既存データと重複するものは極力返さないでください。",
  "返答はJSONオブジェクトだけにしてください。Markdownは禁止です。",
  "形式:",
  "{",
  "  \"tasks\": [{\"text\":\"残タスクまたは新規作業\",\"streamHidden\":false}],",
  "  \"completedTasks\": [{\"text\":\"完了した作業\",\"streamHidden\":false}],",
  "  \"settings\": [{\"category\":\"分類\",\"label\":\"短い項目名\",\"value\":\"確定内容\",\"streamHidden\":true}],",
  "  \"scenarios\": [{\"title\":\"章・シーン名\",\"body\":\"確定したシナリオ本文または要約\",\"streamHidden\":true}]",
  "}",
  "ネタバレになる固有情報、謎の答え、伏線、正体、事故、最終展開に関係する設定やシナリオは streamHidden=true にしてください。",
  "公開しても内容が推測できない一般的な作業タスクのみ streamHidden=false にできます。",
  "該当がなければ各配列を空にしてください。"
].join("\n");

const REVIEW_INSTRUCTIONS = [
  "あなたは配信向けのゲーム開発レビュアーです。",
  "内部では制作データ全体を読んで進捗と品質を評価しますが、出力は配信にそのまま表示されます。",
  "絶対ルール:",
  "- 謎の答え、暗号、パスワード、具体的な台詞、人物の正体、伏線の意味、事故の詳細、後の展開、固有の秘密を出さない。",
  "- 新しく確定した内容を具体名で列挙しない。",
  "- 「重要なシーン」「関係性」「導入」「会話」「演出」「後半への接続」など抽象化した言葉を使う。",
  "- 原文を引用しない。",
  "- 2〜4段落、合計180〜320文字程度。",
  "- 良くなった点と、まだ調整余地のある点を両方含める。",
  "- 採点や点数化はしない。",
  "- 日本語のみ。"
].join("\n");

async function handleApi(req, res, url) {
  if (url.pathname === "/api/game-dev/status" && req.method === "GET") {
    sendJson(res, 200, { ok: true, aiConfigured: !!API_KEY, model: MODEL, mode: "local" });
    return true;
  }

  if (url.pathname === "/api/game-dev/chat" && req.method === "POST") {
    const body = await readJson(req);
    const project = compactProject(body.project);
    const messages = recentMessages(body.messages);
    const context = "プロジェクト情報:\n" + JSON.stringify(project, null, 2);
    const result = await openai({
      instructions: CHAT_INSTRUCTIONS,
      input: [{ role: "user", content: context }, ...messages],
      maxOutputTokens: 1800
    });
    sendJson(res, 200, { ok: true, reply: result.text, model: MODEL, usage: result.usage });
    return true;
  }

  if (url.pathname === "/api/game-dev/organize" && req.method === "POST") {
    const body = await readJson(req);
    const project = compactProject(body.project);
    const confirmedText = String(body.confirmedText || "").slice(0, 10000);
    const result = await openai({
      instructions: ORGANIZE_INSTRUCTIONS,
      input: [{
        role: "user",
        content: "既存プロジェクト:\n" + JSON.stringify(project, null, 2) + "\n\n今回確定した文章:\n" + confirmedText
      }],
      maxOutputTokens: 1600
    });
    sendJson(res, 200, { ok: true, organized: parseJsonObject(result.text), model: MODEL, usage: result.usage });
    return true;
  }

  if (url.pathname === "/api/game-dev/review" && req.method === "POST") {
    const body = await readJson(req);
    const project = compactProject(body.project);
    const confirmed = Array.isArray(body.confirmed)
      ? body.confirmed.slice(-50).map(v => String(v).slice(0, 4000))
      : [];
    const result = await openai({
      instructions: REVIEW_INSTRUCTIONS,
      input: [{
        role: "user",
        content: "制作状況を配信用にレビューしてください。\n\nプロジェクト:\n" + JSON.stringify(project, null, 2) + "\n\n確定事項:\n" + JSON.stringify(confirmed, null, 2)
      }],
      maxOutputTokens: 700
    });
    sendJson(res, 200, { ok: true, review: result.text, model: MODEL, usage: result.usage });
    return true;
  }

  return false;
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const cleaned = normalize(pathname).replace(/^([.][.][/\\])+/, "");
  const path = join(ROOT, cleaned.replace(/^[/\\]+/, ""));

  if (!path.startsWith(ROOT)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  try {
    const info = await stat(path);
    if (!info.isFile()) throw new Error("Not file");
    const content = await readFile(path);
    res.writeHead(200, {
      "Content-Type": MIME[extname(path).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    if (req.method === "HEAD") res.end();
    else res.end(content);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1:" + PORT);
  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) sendJson(res, 404, { ok: false, error: "Not found" });
      return;
    }
    if (!["GET", "HEAD"].includes(req.method || "")) {
      res.writeHead(405); res.end("Method Not Allowed"); return;
    }
    await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, error.status || 500, { ok: false, error: error.message || "Server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("Quick Deck GAME DEV");
  console.log("  Workspace: http://127.0.0.1:" + PORT + "/game-dev.html");
  console.log("  OBS:       http://127.0.0.1:" + PORT + "/game-dev-overlay.html");
  console.log("  AI model:  " + MODEL);
  console.log("  API key:   " + (API_KEY ? "configured" : "NOT configured"));
  console.log("");
});
