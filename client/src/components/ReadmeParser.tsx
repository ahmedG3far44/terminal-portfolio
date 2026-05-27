import React from 'react';

interface ReadmeParserProps {
  text: string;
  repoBaseUrl?: string;
}

function parseInlineMarkdown(text: string, rgb: string): string {
  if (!text) return '';
  let result = text;

  result = result.replace(/`([^`]+)`/g, (_, code: string) => {
    return `<code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${code}</code>`;
  });

  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #58a6ff; text-decoration: none;">$1</a>',
  );
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 1rem 0; display: block;" />',
  );

  return result;
}

function MarkdownRenderer({ content, rgb }: { content: string; rgb: string }) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeKey = 0;
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let tableKey = 0;

  const elements: React.ReactNode[] = [];
  const processInline = (text: string) => parseInlineMarkdown(text, rgb);

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeContent = [];
        codeKey = i;
      } else {
        elements.push(
          <pre
            key={`code-${codeKey}`}
            style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1rem',
              borderRadius: '6px',
              overflowX: 'auto',
              marginBottom: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <code style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {codeContent.join('\n')}
            </code>
          </pre>,
        );
        inCodeBlock = false;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (line.startsWith('---') || line.startsWith('***') || line.startsWith('___')) {
      elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.15)', margin: '1.5rem 0' }} />);
      return;
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} style={{ borderLeft: `3px solid rgba(${rgb}, 0.6)`, paddingLeft: '1rem', marginLeft: 0, marginBottom: '0.5rem', color: `rgba(${rgb}, 0.8)`, fontStyle: 'italic' }}>
          {processInline(line.slice(2))}
        </blockquote>,
      );
      return;
    }

    if (line.startsWith('- [ ] ') || line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
      const checked = line.startsWith('- [x]') || line.startsWith('- [X]');
      elements.push(
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <input type="checkbox" checked={checked} readOnly style={{ marginTop: '0.3rem', accentColor: `rgb(${rgb})` }} />
          <span style={{ color: checked ? `rgba(${rgb}, 0.5)` : 'inherit', textDecoration: checked ? 'line-through' : 'none' }} dangerouslySetInnerHTML={{ __html: processInline(line.slice(5)) }} />
        </div>,
      );
      return;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem', color: `rgb(${rgb})` }}>{processInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: '1.35rem', fontWeight: 600, marginTop: '1.75rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{processInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.5rem' }}>{processInline(line.slice(4))}</h3>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.35rem' }} dangerouslySetInnerHTML={{ __html: processInline(line.slice(2)) }} />);
    } else if (line.match(/^\d+\. /)) {
      elements.push(<li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.35rem' }} dangerouslySetInnerHTML={{ __html: processInline(line.replace(/^\d+\. /, '')) }} />);
    } else if (line.startsWith('| ') && line.includes('|')) {
      const cells = line.split('|').filter((c) => c.trim() !== '');
      if (cells.length > 0 && line.match(/\|[-:]+\|/)) return;
      if (!inTable) {
        inTable = true;
        tableHeaders = cells.map((c) => processInline(c.trim()));
        tableKey = i;
      } else {
        tableRows.push(cells.map((c) => processInline(c.trim())));
      }
      if (i === lines.length - 1 || !lines[i + 1]?.startsWith('| ')) {
        if (inTable && tableHeaders.length > 0) {
          elements.push(
            <div key={`table-${tableKey}`} style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    {tableHeaders.map((h, hi) => (
                      <th key={hi} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>,
          );
        }
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
      return;
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '0.75rem' }} />);
    } else {
      elements.push(<p key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: processInline(line) }} />);
    }
  });

  return <div style={{ lineHeight: 1.8, fontSize: '1rem' }}>{elements}</div>;
}

export function ReadmeParser({ text, repoBaseUrl }: ReadmeParserProps) {
  const rgb = '57, 255, 20';

  let processed = text;
  if (repoBaseUrl) {
    processed = processed.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      `![$1](${repoBaseUrl}$2)`,
    );
    processed = processed.replace(
      /\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\)/g,
      `[$1](${repoBaseUrl}$2)`,
    );
  }

  return <MarkdownRenderer content={processed} rgb={rgb} />;
}

export default ReadmeParser;
