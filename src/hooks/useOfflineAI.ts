import { useState, useEffect, useCallback } from 'react';

export type ModelStatus = 'loading' | 'downloading' | 'ready' | 'error' | 'unsupported';

interface UseOfflineAIReturn {
  generate: (prompt: string, image?: string) => Promise<string>;
  modelStatus: ModelStatus;
  downloadProgress: number;
  error: string | null;
  isSupported: boolean;
}

// Chrome Built-in AI (Gemini Nano) interface
declare global {
  interface Window {
    LanguageModel?: {
      availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;
      create(options?: {
        temperature?: number;
        topK?: number;
        signal?: AbortSignal;
        initialPrompts?: Array<{role: string; content: string}>;
        expectedInputs?: Array<{type: string; languages?: string[]}>;
        expectedOutputs?: Array<{type: string; languages?: string[]}>;
        monitor?: (monitor: any) => void;
      }): Promise<LanguageModelSession>;
      params(): Promise<{
        defaultTopK: number;
        maxTopK: number;
        defaultTemperature: number;
        maxTemperature: number;
      }>;
    };
  }
}

interface LanguageModelSession {
  prompt(input: string | Array<{role: string; content: string | Array<any>}>): Promise<string>;
  promptStreaming(input: string): AsyncIterable<string>;
  destroy(): void;
  clone(): Promise<LanguageModelSession>;
  inputUsage: number;
  inputQuota: number;
}

export function useOfflineAI(): UseOfflineAIReturn {
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<LanguageModelSession | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Check if Chrome Built-in AI is supported
  const checkSupport = useCallback(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const hasLanguageModel = typeof window.LanguageModel !== 'undefined';
    return isChrome && hasLanguageModel;
  }, []);

  // Initialize the AI model
  const initializeModel = useCallback(async () => {
    try {
      if (!checkSupport()) {
        setIsSupported(false);
        setModelStatus('unsupported');
        setError('Chrome Built-in AI is not supported in this browser. Please use Chrome 128+ on Windows, macOS, or Linux with Gemini Nano enabled.');
        return;
      }

      setIsSupported(true);
      setModelStatus('loading');

      // Check model availability
      const availability = await window.LanguageModel!.availability();
      
      switch (availability) {
        case 'available':
          // Model is ready, create session
          const readySession = await window.LanguageModel!.create();
          setSession(readySession);
          setModelStatus('ready');
          setDownloadProgress(100);
          break;
          
        case 'downloadable':
          // Model needs to be downloaded
          setModelStatus('downloading');
          setDownloadProgress(0);
          
          const downloadSession = await window.LanguageModel!.create({
            monitor: (m: any) => {
              m.addEventListener('downloadprogress', (e: any) => {
                const progress = Math.round(e.loaded * 100);
                setDownloadProgress(progress);
                if (progress === 100) {
                  setModelStatus('ready');
                }
              });
            }
          });
          
          setSession(downloadSession);
          break;
          
        case 'downloading':
          // Model is currently downloading
          setModelStatus('downloading');
          // We'll need to wait and check again
          setTimeout(initializeModel, 2000);
          break;
          
        case 'unavailable':
          setModelStatus('error');
          setError('Gemini Nano model is not available on this device. Ensure you have sufficient storage (22GB+) and meet hardware requirements.');
          break;
      }
      
    } catch (err) {
      console.error('Failed to initialize offline AI:', err);
      setModelStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [checkSupport]);

  // Generate text with the AI model
  const generate = useCallback(async (prompt: string, image?: string): Promise<string> => {
    if (!session) {
      throw new Error('AI model is not ready. Please wait for initialization to complete.');
    }

    try {
      let input;
      
      if (image) {
        // Multimodal prompt with image
        input = [
          {
            role: 'user',
            content: [
              { type: 'text', value: prompt },
              { type: 'image', value: image }
            ]
          }
        ];
      } else {
        // Text-only prompt
        input = prompt;
      }

      const response = await session.prompt(input);
      return response;
      
    } catch (err) {
      console.error('AI generation error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to generate AI response');
    }
  }, [session]);

  // Initialize on mount
  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  return {
    generate,
    modelStatus,
    downloadProgress,
    error,
    isSupported
  };
}