export const MCP_SERVER_URL = "https://smolurls.sujeetbuilds.xyz/mcp";
export const MCP_TRANSPORT = "HTTP";

export const MCP_COMPATIBILITY_NOTE =
  "Streamable HTTP transport — compatible with Claude Desktop, Cursor, Windsurf, and any MCP client supporting HTTP.";

export type CodeTone =
  | "plain"
  | "keyword"
  | "property"
  | "string"
  | "type"
  | "comment"
  | "punctuation";

export interface CodeToken {
  text: string;
  tone?: CodeTone;
}

export interface SetupSnippet {
  id: "claude" | "cursor" | "generic";
  title: string;
  fileName: string;
  language: "json" | "python";
  rawCode: string;
  lines: CodeToken[][];
}

export const MCP_SETUP_SNIPPETS: SetupSnippet[] = [
  {
    id: "claude",
    title: "Claude Desktop",
    fileName: "claude_desktop_config.json",
    language: "json",
    rawCode: `{
  "mcpServers": {
    "smolurls": {
      "type": "http",
      "url": "https://smolurls.sujeetbuilds.xyz/mcp"
    }
  }
}`,
    lines: [
      [{ text: "{", tone: "punctuation" }],
      [
        { text: "  " },
        { text: '"mcpServers"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: "{", tone: "punctuation" },
      ],
      [
        { text: "    " },
        { text: '"smolurls"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: "{", tone: "punctuation" },
      ],
      [
        { text: "      " },
        { text: '"type"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: '"http"', tone: "string" },
        { text: ",", tone: "punctuation" },
      ],
      [
        { text: "      " },
        { text: '"url"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: '"https://smolurls.sujeetbuilds.xyz/mcp"', tone: "string" },
      ],
      [{ text: "    " }, { text: "}", tone: "punctuation" }],
      [{ text: "  " }, { text: "}", tone: "punctuation" }],
      [{ text: "}", tone: "punctuation" }],
    ],
  },
  {
    id: "cursor",
    title: "Cursor",
    fileName: ".cursor/mcp.json",
    language: "json",
    rawCode: `{
  "mcpServers": {
    "smolurls": {
      "type": "http",
      "url": "https://smolurls.sujeetbuilds.xyz/mcp"
    }
  }
}`,
    lines: [
      [{ text: "{", tone: "punctuation" }],
      [
        { text: "  " },
        { text: '"mcpServers"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: "{", tone: "punctuation" },
      ],
      [
        { text: "    " },
        { text: '"smolurls"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: "{", tone: "punctuation" },
      ],
      [
        { text: "      " },
        { text: '"type"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: '"http"', tone: "string" },
        { text: ",", tone: "punctuation" },
      ],
      [
        { text: "      " },
        { text: '"url"', tone: "property" },
        { text: ": ", tone: "punctuation" },
        { text: '"https://smolurls.sujeetbuilds.xyz/mcp"', tone: "string" },
      ],
      [{ text: "    " }, { text: "}", tone: "punctuation" }],
      [{ text: "  " }, { text: "}", tone: "punctuation" }],
      [{ text: "}", tone: "punctuation" }],
    ],
  },
  {
    id: "generic",
    title: "Generic HTTP",
    fileName: "python",
    language: "python",
    rawCode: `from mcp import ClientSession
from mcp.client.http import http_client

# Connect to SmolURLs MCP server
async with http_client("https://smolurls.sujeetbuilds.xyz/mcp") as (r, w):
    async with ClientSession(r, w) as session:
        await session.initialize()
        tools = await session.list_tools()`,
    lines: [
      [
        { text: "from ", tone: "keyword" },
        { text: "mcp", tone: "type" },
        { text: " import ", tone: "keyword" },
        { text: "ClientSession", tone: "type" },
      ],
      [
        { text: "from ", tone: "keyword" },
        { text: "mcp.client.http", tone: "type" },
        { text: " import ", tone: "keyword" },
        { text: "http_client", tone: "type" },
      ],
      [{ text: "" }],
      [{ text: "# Connect to SmolURLs MCP server", tone: "comment" }],
      [
        { text: "async with ", tone: "keyword" },
        { text: "http_client", tone: "type" },
        { text: "(", tone: "punctuation" },
        { text: '"https://smolurls.sujeetbuilds.xyz/mcp"', tone: "string" },
        { text: ") as ", tone: "punctuation" },
        { text: "(r, w)", tone: "punctuation" },
        { text: ":", tone: "punctuation" },
      ],
      [
        { text: "    " },
        { text: "async with ", tone: "keyword" },
        { text: "ClientSession", tone: "type" },
        { text: "(r, w) as session", tone: "punctuation" },
        { text: ":", tone: "punctuation" },
      ],
      [
        { text: "        " },
        { text: "await", tone: "keyword" },
        { text: " session.initialize()", tone: "plain" },
      ],
      [
        { text: "        tools ", tone: "plain" },
        { text: "=", tone: "punctuation" },
        { text: " ", tone: "plain" },
        { text: "await", tone: "keyword" },
        { text: " session.list_tools()", tone: "plain" },
      ],
    ],
  },
];

export interface McpToolDefinition {
  name: string;
  category: "urls" | "analytics";
  description: string;
  params: string[];
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: "shorten_url",
    category: "urls",
    description: "Shorten a long URL with an optional custom alias",
    params: ["url", "custom_alias?"],
  },
  {
    name: "list_urls",
    category: "urls",
    description: "List all previously shortened URLs",
    params: [],
  },
  {
    name: "get_short_url",
    category: "urls",
    description: "Get details about a specific short URL",
    params: ["short_id"],
  },
  {
    name: "get_analytics",
    category: "analytics",
    description: "Fetch click analytics and events for a URL",
    params: ["short_id"],
  },
];

export const MCP_COMPATIBLE_CLIENTS = [
  "Claude Desktop",
  "Cursor",
  "Windsurf",
  "Zed",
  "Any MCP HTTP Client",
] as const;
