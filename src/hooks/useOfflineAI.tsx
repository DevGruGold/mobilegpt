import { useState, useEffect, useCallback } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

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
  const [generator, setGenerator] = useState<any>(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelStatus('downloading');
      setError(null);

      const pipe = await pipeline(
        'text-generation',
        'Xenova/TinyLlama-1.1B-Chat-v1.0',
        {
          progress_callback: (progress: any) => {
            if (progress.status === 'progress') {
              const percent = (progress.loaded / progress.total) * 100;
              setDownloadProgress(Math.round(percent));
            }
          }
        }
      );

      setGenerator(pipe);
      setModelStatus('ready');
      setDownloadProgress(100);
    } catch (err) {
      console.error('Failed to load model:', err);
      setError(err instanceof Error ? err.message : 'Failed to load model');
      setModelStatus('error');
    }
  };

  const generate = useCallback(async (prompt: string): Promise<string> => {
    if (!generator) {
      throw new Error('Model not loaded');
    }

    try {
      const result = await generator(prompt, {
        max_new_tokens: 256,
        temperature: 0.7,
        do_sample: true,
        top_k: 50,
      });

      return result[0].generated_text;
    } catch (err) {
      console.error('Generation error:', err);
      throw err;
    }
  }, [generator]);

  return {
    generate,
    modelStatus,
    downloadProgress,
    error,
  };
}
