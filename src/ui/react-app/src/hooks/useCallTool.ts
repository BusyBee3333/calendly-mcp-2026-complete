import { useState } from 'react';

export function useCallTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callTool = async (name: string, args: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/mcp/call-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, arguments: args }),
      });
      const data = await response.json();
      if (data.isError) {
        throw new Error(data.content[0]?.text || 'Unknown error');
      }
      return JSON.parse(data.content[0]?.text || '{}');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { callTool, loading, error };
}
