"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Button } from './button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeHighlighterProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  onCopy?: (code: string) => void;
  copyButtonText?: string;
  className?: string;
}

export function CodeHighlighter({
  code,
  language = 'tsx',
  showLineNumbers = true,
  showCopyButton = true,
  onCopy,
  copyButtonText = 'Copy',
  className = ''
}: CodeHighlighterProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = resolvedTheme === 'dark';

  const customStyle = {
    margin: 0,
    padding: '1.5rem',
    background: 'transparent',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    borderRadius: '0',
  };

  const lineNumberStyle = {
    minWidth: '3em',
    paddingRight: '1em',
    color: 'hsl(var(--muted-foreground))',
    userSelect: 'none' as const,
    opacity: 0.6
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopy) {
        onCopy(code);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`relative bg-muted/30 ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={customStyle}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={lineNumberStyle}
        wrapLongLines={true}
        PreTag="div"
        CodeTag="code"
      >
        {code}
      </SyntaxHighlighter>
      {showCopyButton && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              {copyButtonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
} 