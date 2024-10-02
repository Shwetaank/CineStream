import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import { Card } from "flowbite-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

// Custom renderer for code blocks
const CodeBlock = ({ node, inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter style={solarizedlight} language={match[1]} PreTag="div">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={className}>{children}</code>
  );
};

const DocsPage = async () => {
  const filePath = path.join(process.cwd(), "docs", "bookmarks-api.md");
  const markdownContent = fs.readFileSync(filePath, "utf8");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">
          API Documentation
        </h1>

        <Card className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <ReactMarkdown
              components={{
                code: CodeBlock,
              }}
              className="prose lg:prose-xl"
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocsPage;
