import { useMemo, useState } from "react";
import { Check, Copy, Download, KeyRound, Loader2, Wand2 } from "lucide-react";

import { AdSlot } from "@/components/common/AdSlot";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const PRESETS = {
  users:
    "Generate 20 Indian user profiles with name, email, department, salary, and Hyderabad address.",
  orders:
    "Generate 25 e-commerce orders with order ID, customer name, product, quantity, price, and status.",
  subscriptions:
    "Generate 15 SaaS subscription records with company, plan, seats, monthly amount, and renewal date.",
} as const;

type Category = "users" | "orders" | "subscriptions";
type OutputFormat = "table" | "json" | "sql" | "csv";
type Cell = string | number;
type Row = Record<string, Cell>;

const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Sai",
  "Rohan",
  "Priya",
  "Ananya",
  "Neha",
  "Kavya",
  "Rahul",
];
const lastNames = [
  "Sharma",
  "Reddy",
  "Nair",
  "Iyer",
  "Gupta",
  "Patel",
  "Kumar",
  "Verma",
  "Mehta",
  "Joshi",
];
const domains = ["gmail", "yahoo", "outlook", "company"];
const departments = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"];
const cities = ["Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Pune", "Kolkata"];
const roads = ["MG Road", "Ring Road", "Main Street", "Highway Road", "Park Avenue", "Lake View"];
const products = [
  "Wireless Mouse",
  "Mechanical Keyboard",
  "USB-C Hub",
  "Webcam 1080p",
  "Noise Cancelling Headphones",
  "Portable SSD",
  "Smart Watch",
  "Laptop Stand",
];
const statuses = ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"];
const companies = [
  "Acme Corp",
  "TechFlow",
  "DataPulse",
  "CloudNine",
  "ByteWorks",
  "NexGen Systems",
  "Streamline",
  "QuantumSoft",
];
const plans = ["Starter", "Growth", "Pro", "Enterprise"];

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function pick(list: readonly string[], index: number): string {
  return list[mod(index, list.length)] ?? "";
}

function buildUser(index: number): Row {
  const name = `${pick(firstNames, index)} ${pick(lastNames, index * 3)}`;
  const city = pick(cities, index);
  return {
    id: index + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${mod(index * 7, 999)}@${pick(domains, index)}.com`,
    department: pick(departments, index),
    salary: `₹${(45000 + mod(index * 17321, 205000)).toLocaleString()}`,
    address: `${mod(index * 13, 999) + 1} ${pick(roads, index)}, ${city}`,
  };
}

function buildOrder(index: number): Row {
  const customer = `${pick(firstNames, index + 4)} ${pick(lastNames, index * 5 + 2)}`;
  return {
    "Order ID": `ORD-${1000 + index}`,
    Customer: customer,
    Product: pick(products, index),
    Quantity: 1 + mod(index, 5),
    Price: `₹${(499 + mod(index * 3129, 24501)).toLocaleString()}`,
    Status: pick(statuses, index),
  };
}

function buildSubscription(index: number): Row {
  const monthsAhead = 1 + mod(index, 12);
  const renewal = new Date(2026, mod(index + monthsAhead, 12), 1 + mod(index, 28));
  return {
    Company: pick(companies, index),
    Plan: pick(plans, index),
    Seats: 1 + mod(index * 3, 50),
    Amount: `$${49 + mod(index * 97, 950)}`,
    "Renewal Date": renewal.toISOString().slice(0, 10),
  };
}

function generateRows(category: Category, count: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < count; i++) {
    if (category === "orders") rows.push(buildOrder(i));
    else if (category === "subscriptions") rows.push(buildSubscription(i));
    else rows.push(buildUser(i));
  }
  return rows;
}

function detectCategory(prompt: string): Category {
  const p = prompt.toLowerCase();
  if (p.includes("order") || p.includes("e-commerce") || p.includes("product")) return "orders";
  if (p.includes("subscription") || p.includes("saas") || p.includes("plan"))
    return "subscriptions";
  return "users";
}

function normalizeRows(raw: unknown): Row[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row: Row = {};
    if (item && typeof item === "object") {
      for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
        row[key] =
          typeof value === "number" || typeof value === "string"
            ? value
            : value === null || value === undefined
              ? ""
              : typeof value === "boolean"
                ? String(value)
                : JSON.stringify(value);
      }
    }
    return row;
  });
}

function formatContent(format: OutputFormat, rows: Row[]) {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0] ?? {});

  switch (format) {
    case "json":
      return JSON.stringify(rows, null, 2);
    case "csv": {
      const lines = [keys.join(",")];
      for (const row of rows) {
        lines.push(keys.map((k) => String(row[k] ?? "").replace(/,/g, " ")).join(","));
      }
      return lines.join("\n");
    }
    case "sql": {
      return rows
        .map((row) => {
          const cols = keys.map((k) => `"${k.replace(/"/g, "")}"`).join(", ");
          const vals = keys
            .map((k) =>
              typeof row[k] === "number" ? row[k] : `'${String(row[k] ?? "").replace(/'/g, "''")}'`,
            )
            .join(", ");
          return `INSERT INTO mock_data (${cols}) VALUES (${vals});`;
        })
        .join("\n");
    }
    default:
      return "";
  }
}

const ROW_OPTIONS = [10, 15, 20, 25, 50, 100];
const PREVIEW_LIMIT = 5;
const API_KEY_STORAGE = "sot:gemini-api-key";

const MSW_SNIPPET = `import { http, HttpResponse } from "msw";
import users from "./mock-users.json";

export const handlers = [
  http.get("/api/users", () => HttpResponse.json(users)),
];`;

export default function MockData() {
  const [prompt, setPrompt] = useState("");
  const [rowCount, setRowCount] = useState(10);
  const [format, setFormat] = useState<OutputFormat>("table");
  const [rows, setRows] = useState<Row[]>(() => generateRows("users", PREVIEW_LIMIT));
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [hasCustomKey, setHasCustomKey] = useState(false);

  const activeCategory = useMemo(() => detectCategory(prompt), [prompt]);
  const columns = useMemo(() => Object.keys(rows[0] ?? {}), [rows]);
  const previewRows = useMemo(() => rows.slice(0, PREVIEW_LIMIT), [rows]);
  const downloadableContent = useMemo(() => formatContent(format, rows), [format, rows]);

  function readStoredKey() {
    try {
      return localStorage.getItem(API_KEY_STORAGE) ?? "";
    } catch {
      return "";
    }
  }

  async function handleGenerate() {
    const activePrompt = prompt.trim() || PRESETS[activeCategory];
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt, rowCount, apiKey: readStoredKey() }),
      });
      const payload = (await response.json()) as { rows?: unknown; error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Generation failed. Please try again.");
        return;
      }
      const next = normalizeRows(payload.rows);
      if (next.length === 0) {
        setError("No rows came back. Try describing the data differently.");
        return;
      }
      setRows(next);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(category: Category) {
    setPrompt(PRESETS[category]);
    setRowCount(category === "orders" ? 25 : category === "subscriptions" ? 15 : 20);
    setRows(generateRows(category, PREVIEW_LIMIT));
    setError(null);
  }

  function openKeyDialog() {
    setKeyDraft(readStoredKey());
    setKeyDialogOpen(true);
  }

  function saveKey() {
    try {
      const value = keyDraft.trim();
      if (value) localStorage.setItem(API_KEY_STORAGE, value);
      else localStorage.removeItem(API_KEY_STORAGE);
      setHasCustomKey(Boolean(value));
    } catch {
      // storage unavailable — ignore
    }
    setKeyDialogOpen(false);
  }

  async function handleCopy() {
    const text = format === "table" ? formatContent("csv", rows) : downloadableContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  function handleDownload() {
    const text = format === "table" ? formatContent("csv", rows) : downloadableContent;
    if (!text) return;
    const extension = format === "table" ? "csv" : format;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <header className="border-b border-border pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Generators
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          AI Mock Data Engine
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Generate realistic SQL, JSON, and CSV mock data from plain-language prompts.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Input section */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Describe the data you need</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Use everyday language — columns, row count, and style are inferred from your prompt.
              </p>
            </div>
            <Dialog open={keyDialogOpen} onOpenChange={setKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" onClick={openKeyDialog}>
                  <KeyRound className="size-4" />
                  {hasCustomKey ? "Key saved" : "Custom key"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Use your own API key</DialogTitle>
                  <DialogDescription>
                    Optional. Paste a Google Gemini API key to run generations on your own quota. It
                    is stored only in this browser and never saved on our servers.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="AIza..."
                  type="password"
                  className="font-mono text-sm"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setKeyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveKey}>Save key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 20 users with name, email, department, salary, and Hyderabad address"
            className="mt-4 min-h-[120px] resize-y font-mono text-sm"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {(["users", "orders", "subscriptions"] as Category[]).map((key) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(key)}
                className={
                  activeCategory === key && !prompt ? "bg-accent text-accent-foreground" : ""
                }
              >
                {key === "users" && "Indian User Profiles"}
                {key === "orders" && "E-commerce Orders"}
                {key === "subscriptions" && "SaaS Subscriptions"}
              </Button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="row-count" className="text-xs font-medium text-muted-foreground">
                Row count
              </label>
              <Select
                value={String(rowCount)}
                onValueChange={(value) => setRowCount(Number(value))}
              >
                <SelectTrigger id="row-count" className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROW_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="ml-auto gap-2">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {loading ? "Generating…" : "Generate Data"}
            </Button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {error}
            </p>
          )}
        </section>

        {/* Output section */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <Tabs
            value={format}
            onValueChange={(value) => setFormat(value as OutputFormat)}
            className="w-full"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="sql">SQL</TabsTrigger>
                <TabsTrigger value="csv">CSV</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={rows.length === 0 || loading}
                  className="gap-2"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={rows.length === 0 || loading}
                  className="gap-2"
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="mt-4 space-y-2 rounded-lg border border-border p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="table" className="mt-4">
                  <div className="overflow-hidden rounded-lg border border-border">
                    <div className="max-h-[360px] overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-muted">
                          <TableRow>
                            {columns.map((col) => (
                              <TableHead
                                key={col}
                                className="font-mono text-xs uppercase tracking-wide"
                              >
                                {col}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewRows.map((row, idx) => (
                            <TableRow key={idx}>
                              {columns.map((col) => (
                                <TableCell key={col} className="font-mono text-xs">
                                  {String(row[col] ?? "")}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {rows.length > PREVIEW_LIMIT && (
                      <p className="border-t border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                        Showing {PREVIEW_LIMIT} of {rows.length} generated rows. Copy or download to
                        get the full set.
                      </p>
                    )}
                  </div>
                </TabsContent>

                {(["json", "sql", "csv"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <pre className="max-h-[360px] overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
                      {downloadableContent}
                    </pre>
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </section>
      </div>

      <AdSlot width={728} height={90} mobileHeight={50} label="Advertisement" className="my-10" />

      {/* Documentation */}
      <article className="mt-10 space-y-8">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Why synthetic mock data matters in modern engineering
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cloning a production database into a development environment is still the most common
            way teams get realistic test data — and the riskiest. A single restored dump can carry
            names, emails, payment references, and health records into laptops, CI runners, and
            screenshots. Under GDPR that is a processing activity with no lawful basis, and under
            HIPAA it is an unmanaged disclosure of protected health information. Even with masking
            scripts, one missed column or free-text notes field is enough to leak PII.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Synthetic data removes the risk at the source: nothing generated here maps back to a
            real person, so it can be committed to fixtures, shared with contractors, and pasted
            into bug reports freely.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">Local migration seeds</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Fill freshly migrated tables with hundreds of plausible rows so indexes,
                constraints, and joins are exercised before staging.
              </p>
            </li>
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">Frontend stress tests</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Render 100-row tables and long-string cells to catch virtualization bugs, overflow,
                and layout shifts that ten hand-written rows never reveal.
              </p>
            </li>
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">Edge-case unit tests</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Ask for empty fields, unicode names, zero quantities, or expired dates to build
                fixtures around the cases that break parsers.
              </p>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Format guide: JSON, SQL, and CSV
          </h2>

          <div className="mt-5 space-y-6">
            <div>
              <h3 className="font-mono text-sm font-semibold text-foreground">JSON</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The default for mocking REST and GraphQL endpoints, priming client-side stores
                (Redux, Zustand, TanStack Query caches), and driving Mock Service Worker handlers.
                Save the output as a fixture file and serve it straight from a handler:
              </p>
              <pre className="mt-3 overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
                {MSW_SNIPPET}
              </pre>
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold text-foreground">SQL</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Output is emitted as one <code className="font-mono">INSERT INTO</code> statement
                per row, which is the safest form to paste into a migration or psql session. To seed
                faster, wrap the batch in a single transaction. Dialect notes: PostgreSQL prefers
                double-quoted identifiers and supports <code className="font-mono">RETURNING</code>;
                MySQL uses backticks and <code className="font-mono">INSERT IGNORE</code>. When
                tables have foreign keys, insert parents first, or generate the child rows with IDs
                you already know exist — never disable constraint checks on a shared staging
                database.
              </p>
            </div>

            <div>
              <h3 className="font-mono text-sm font-semibold text-foreground">CSV</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Best for data pipelines and analytics: load it with{" "}
                <code className="font-mono">COPY … FROM</code> in Postgres, read it in Python with{" "}
                <code className="font-mono">pandas.read_csv()</code>, feed it into a warehouse
                staging bucket, or drop it into a spreadsheet to populate client-facing reporting
                templates.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Writing effective data prompts
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The generator follows your wording closely. Name the columns, the locale, and the ranges
            you expect.
          </p>
          <ol className="mt-4 space-y-3">
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Localized names
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-foreground">
                30 South Indian employee records with full_name, official_email on the acme.co
                domain, and a Hyderabad postal address including a 6-digit pincode.
              </p>
            </li>
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Realistic numeric ranges
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-foreground">
                50 payroll rows with department, annual_salary between 600000 and 2800000 INR as
                integers, and bonus_percent between 0 and 15 with one decimal.
              </p>
            </li>
            <li className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Valid ISO dates
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-foreground">
                25 subscription records with created_at as ISO 8601 timestamps in 2025 and
                renewal_date as YYYY-MM-DD strictly after created_at.
              </p>
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-sm">
                Is the generated data stored or logged anywhere?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                No. SmartOpenTools processes each request in memory and returns the result without
                persistence — there is no database of prompts or datasets. Every query is stateless,
                and a custom API key you add stays in your own browser storage.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-sm">
                Can I export datasets larger than 100 rows?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                The row selector stops at 100 because a single model response has a token ceiling
                and latency climbs sharply past that point — large requests are also more likely to
                return truncated JSON. For bigger sets, batch: generate 100 rows at a time, vary the
                prompt slightly (different cities, date ranges, or ID offsets), and concatenate the
                files before seeding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-sm">
                What database engines are compatible with the SQL output?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                The statements use standard ANSI SQL, so they run on PostgreSQL, MySQL, SQLite, and
                MariaDB. Rename the target table and adjust identifier quoting if your dialect
                requires backticks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-sm">
                Is this tool free for commercial use?
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Yes — 100% free under MIT-style open tooling terms. Individual developers, teams,
                and agencies can use the generated datasets in commercial projects with no signup
                and no attribution requirement.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </article>
    </div>
  );
}
