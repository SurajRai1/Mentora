import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
      className="prose prose-purple max-w-none"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative group">
              <pre className={`${className} rounded-lg !bg-gray-900 !p-4`}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className={`${className} px-1 py-0.5 rounded-md bg-gray-100`} {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <pre className="!p-0">{children}</pre>;
        },
        p({ children }) {
          return <p className="mb-4 last:mb-0">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-4">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-3">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold mb-2">{children}</h3>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-6 mb-4">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-purple-300 pl-4 italic my-4">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">{children}</table>
            </div>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
};