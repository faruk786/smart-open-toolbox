export type ToolStatus = "live" | "soon";

export type Tool = {
  name: string;
  description: string;
  path?: string;
  status: ToolStatus;
};

export type ToolCategory = {
  category: string;
  tools: Tool[];
};

export const toolTree: ToolCategory[] = [
  {
    category: "Generators",
    tools: [
      {
        name: "AI Mock Data",
        description: "Describe a schema in plain English and get SQL, JSON, or CSV rows instantly.",
        path: "/mock-data",
        status: "live",
      },
    ],
  },
  {
    category: "Formatters & Parsers",
    tools: [
      { name: "JSON Validator", description: "Validate and pretty-print JSON.", status: "soon" },
      { name: "SQL Beautifier", description: "Format messy SQL queries.", status: "soon" },
    ],
  },
  {
    category: "Converters",
    tools: [
      { name: "CSV to JSON", description: "Convert tabular data to JSON.", status: "soon" },
      { name: "Base64", description: "Encode and decode Base64 payloads.", status: "soon" },
    ],
  },
  {
    category: "Security & Web",
    tools: [
      { name: "Hash Generator", description: "MD5, SHA-1, SHA-256 digests.", status: "soon" },
      { name: "JWT Decoder", description: "Inspect JWT headers and claims.", status: "soon" },
    ],
  },
];
