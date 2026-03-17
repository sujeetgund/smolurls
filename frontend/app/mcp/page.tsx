import type { Metadata } from "next";

import { McpPage } from "@/app/mcp/_components/mcp-page";

export const metadata: Metadata = {
  title: "smolurls MCP",
  description: "Connect MCP-compatible AI agents and IDEs to smolurls",
};

export default function McpDocsPage() {
  return <McpPage />;
}
