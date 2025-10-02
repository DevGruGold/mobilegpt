import { useState, useEffect, useCallback, useRef } from 'react';

type ModelStatus = 'idle' | 'downloading' | 'ready' | 'error';

interface UseOfflineAIReturn {
  generate: (prompt: string) => Promise<string>;
  modelStatus: ModelStatus;
  downloadProgress: number;
  error: string | null;
}

export function useOfflineAI(): UseOfflineAIReturn {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const worker = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (value: any) => void>>(new Map());

  useEffect(() => {
    // Create the worker
    worker.current = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
      type: 'module'
    });

    // Handle messages from worker
    const onMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      switch (type) {
        case 'progress':
          if (data.status === 'progress') {
            const percent = (data.loaded / data.total) * 100;
            setDownloadProgress(Math.round(percent));
          }
          break;

        case 'ready':
          setModelStatus('ready');
          setDownloadProgress(100);
          break;

        case 'complete':
          const resolver = pendingRequests.current.get('generate');
          if (resolver) {
            resolver(data.text);
            pendingRequests.current.delete('generate');
          }
          break;

        case 'error':
          setError(data.message);
          setModelStatus('error');
          const errorResolver = pendingRequests.current.get('generate');
          if (errorResolver) {
            errorResolver(null);
            pendingRequests.current.delete('generate');
          }
          break;
      }
    };

    worker.current.addEventListener('message', onMessage);

    // Start loading the model
    setModelStatus('downloading');
    worker.current.postMessage({ type: 'load' });

    // Cleanup
    return () => {
      worker.current?.removeEventListener('message', onMessage);
      worker.current?.terminate();
    };
  }, []);

  const generate = useCallback(async (prompt: string): Promise<string> => {
    if (!worker.current || modelStatus !== 'ready') {
      throw new Error('Model not ready');
    }

    return new Promise((resolve, reject) => {
      pendingRequests.current.set('generate', resolve);
      
      worker.current!.postMessage({
        type: 'generate',
        data: { prompt }
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingRequests.current.has('generate')) {
          pendingRequests.current.delete('generate');
          reject(new Error('Generation timeout'));
        }
      }, 30000);
    });
  }, [modelStatus]);

  return {
    generate,
    modelStatus,
    downloadProgress,
    error,
  };
}
