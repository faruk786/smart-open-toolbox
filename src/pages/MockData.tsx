import { useMemo, useState } from "react";
import { Check, Copy, Download, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
type Row = Record<string, string | number>;

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

function buildUser(index: number): Row {
  const name = `${firstNames[mod(index, firstNames.length)]} ${lastNames[mod(index * 3, lastNames.length)]}`;
  const city = cities[mod(index, cities.length)];
  return {
    id: index + 1,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}${mod(index * 7, 999)}@${domains[mod(index, domains.length)]}.com`,
    department: departments[mod(index, departments.length)],
    salary: `₹${(45000 + mod(index * 17321, 205000)).toLocaleString()}`,
    address: `${mod(index * 13, 999) + 1} ${roads[mod(index, roads.length)]}, ${city}`,
  };
}

function buildOrder(index: number): Row {
  const customer = `${firstNames[mod(index + 4, firstNames.length)]} ${lastNames[mod(index * 5 + 2, lastNames.length)]}`;
  return {
    "Order ID": `ORD-${1000 + index}`,
    Customer: customer,
    Product: products[mod(index, products.length)],
    Quantity: 1 + mod(index, 5),
    Price: `₹${(499 + mod(index * 3129, 24501)).toLocaleString()}`,
    Status: statuses[mod(index, statuses.length)],
  };
}

function buildSubscription(index: number): Row {
  const monthsAhead = 1 + mod(index, 12);
  const renewal = new Date();
  renewal.setMonth(renewal.getMonth() + monthsAhead);
  renewal.setDate(1 + mod(index, 28));
  return {
    Company: companies[mod(index, companies.length)],
    Plan: plans[mod(index, plans.length)],
    Seats: 1 + mod(index * 3, 50),
    Amount: `$${49 + mod(index * 97, 950)}`,
    "Renewal Date": renewal.toISOString().split("T")[0],
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

function formatContent(format: OutputFormat, rows: Row[]) {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]!);

  switch (format) {
    case "json":
      return JSON.stringify(rows, null, 2);
    case "csv": {
      const lines = [keys.join(",")];
      for (const row of rows) {
        lines.push(keys.map((k) => String(row[k]).replace(/,/g, " ")).join(","));
      }
      return lines.join("\n");
    }
    case "sql": {
      return rows
        .map((row) => {
          const cols = keys.join(", ");
          const vals = keys
            .map((k) =>
              typeof row[k] === "number" ? row[k] : `'${String(row[k]).replace(/'/g, "''")}'`,
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

const ROW_OPTIONS = [10, 25, 50, 100];
const PREVIEW_LIMIT = 5;

export default function MockData() {
  const [prompt, setPrompt] = useState("");
  const [rowCount, setRowCount] = useState(10);
  const [format, setFormat] = useState<OutputFormat>("table");
  const [rows, setRows] = useState<Row[]>(() => generateRows("users", PREVIEW_LIMIT));
  const [copied, setCopied] = useState(false);

  const activeCategory = useMemo(() => detectCategory(prompt), [prompt]);

  const previewRows = useMemo(() => rows.slice(0, PREVIEW_LIMIT), [rows]);
  const columns = useMemo(() => (rows.length > 0 ? Object.keys(rows[0]!) : []), [rows]);

  const downloadableContent = useMemo(() => formatContent(format, rows), [format, rows]);

  function handleGenerate() {
    setRows(generateRows(activeCategory, rowCount));
  }

  function applyPreset(category: Category) {
    setPrompt(PRESETS[category]);
    setRowCount(category === "orders" ? 25 : category === "subscriptions" ? 15 : 20);
    setRows(generateRows(category, PREVIEW_LIMIT));
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
    <div className="mx-auto w-full max-w-5xl">
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
          <h2 className="text-sm font-semibold text-foreground">Describe the data you need</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Use everyday language — columns, row count, and style are inferred from your prompt.
          </p>

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

            <Button onClick={handleGenerate} className="ml-auto gap-2">
              <Wand2 className="size-4" />
              Generate Data
            </Button>
          </div>
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
                  disabled={rows.length === 0}
                  className="gap-2"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={rows.length === 0}
                  className="gap-2"
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </div>
            </div>

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
                              {String(row[col])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {rows.length > PREVIEW_LIMIT && (
                  <p className="border-t border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    Showing {PREVIEW_LIMIT} of {rows.length} generated rows.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <pre className="max-h-[360px] overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
                {downloadableContent}
              </pre>
            </TabsContent>

            <TabsContent value="sql" className="mt-4">
              <pre className="max-h-[360px] overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
                {downloadableContent}
              </pre>
            </TabsContent>

            <TabsContent value="csv" className="mt-4">
              <pre className="max-h-[360px] overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
                {downloadableContent}
              </pre>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* How-to guide */}
      <section className="mt-10 rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="text-base font-semibold text-foreground">How to use this tool</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border border-border bg-card p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              1
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">Describe your data</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Type what you need in plain English — columns, row count, and style. Or pick a preset
              to get started instantly.
            </p>
          </li>
          <li className="rounded-lg border border-border bg-card p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              2
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">Choose format & size</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Select how many rows you want and switch between Table, JSON, SQL, or CSV outputs.
            </p>
          </li>
          <li className="rounded-lg border border-border bg-card p-4">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              3
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">Generate & export</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Hit Generate Data, then copy the result to your clipboard or download it for your
              project.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
