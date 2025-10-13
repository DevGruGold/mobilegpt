import { useState, useEffect, useCallback } from 'react';

export type ModelStatus = 'loading' | 'downloading' | 'ready' | 'error' | 'unsupported';
export type AIEngine = 'chrome-builtin' | 'transformers' | 'ollama' | 'webllm';

interface UseOfflineAIReturn {
  generate: (prompt: string, image?: string) => Promise<string>;
  modelStatus: ModelStatus;
  downloadProgress: number;
  error: string | null;
  isSupported: boolean;
  currentEngine: AIEngine | null;
  switchEngine: (engine: AIEngine) => Promise<void>;
  availableEngines: AIEngine[];
}

// Chrome Built-in AI types
declare global {
  interface Window {
    LanguageModel?: {
      availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;
      create(options?: any): Promise<LanguageModelSession>;
      params(): Promise<any>;
    };
  }
}

interface LanguageModelSession {
  prompt(input: any): Promise<string>;
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
  const [isSupported, setIsSupported] = useState(false);
  const [currentEngine, setCurrentEngine] = useState<AIEngine | null>(null);
  const [session, setSession] = useState<any>(null);
  const [availableEngines, setAvailableEngines] = useState<AIEngine[]>([]);

  // Check Chrome Built-in AI support
  const checkChromeAI = useCallback((): boolean => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const hasLanguageModel = typeof window.LanguageModel !== 'undefined';
    return isChrome && hasLanguageModel;
  }, []);

  // Check transformers.js support
  const checkTransformersJS = useCallback((): boolean => {
    // Check if we can dynamically import transformers.js
    return typeof window !== 'undefined' && 'Worker' in window;
  }, []);

  // Check WebLLM support
  const checkWebLLM = useCallback((): boolean => {
    return typeof window !== 'undefined' && 'WebAssembly' in window && 'Worker' in window;
  }, []);

  // Check Ollama support (requires local server)
  const checkOllama = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Detect available engines
  const detectEngines = useCallback(async () => {
    const engines: AIEngine[] = [];
    
    if (checkChromeAI()) engines.push('chrome-builtin');
    if (checkTransformersJS()) engines.push('transformers');
    if (checkWebLLM()) engines.push('webllm');
    if (await checkOllama()) engines.push('ollama');
    
    setAvailableEngines(engines);
    return engines;
  }, [checkChromeAI, checkTransformersJS, checkWebLLM, checkOllama]);

  // Initialize Chrome Built-in AI
  const initializeChromeAI = useCallback(async () => {
    if (!checkChromeAI()) {
      throw new Error('Chrome Built-in AI not supported');
    }

    setModelStatus('loading');
    const availability = await window.LanguageModel!.availability();
    
    switch (availability) {
      case 'available':
        const readySession = await window.LanguageModel!.create({
          expectedInputs: [
            { type: 'text', languages: ['en'] },
            { type: 'image' }
          ],
          expectedOutputs: [{ type: 'text', languages: ['en'] }]
        });
        setSession(readySession);
        setModelStatus('ready');
        setDownloadProgress(100);
        break;
        
      case 'downloadable':
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
          },
          expectedInputs: [
            { type: 'text', languages: ['en'] },
            { type: 'image' }
          ],
          expectedOutputs: [{ type: 'text', languages: ['en'] }]
        });
        
        setSession(downloadSession);
        break;
        
      case 'downloading':
        setModelStatus('downloading');
        setTimeout(() => initializeChromeAI(), 2000);
        break;
        
      case 'unavailable':
        throw new Error('Gemini Nano model unavailable. Ensure you have sufficient storage (22GB+) and meet hardware requirements.');
    }
  }, [checkChromeAI]);

  // Initialize Transformers.js
  const initializeTransformersJS = useCallback(async () => {
    setModelStatus('downloading');
    setDownloadProgress(0);

    try {
      // Dynamic import to avoid bundle bloat
      const { pipeline, env } = await import('@huggingface/transformers');
      
      env.allowLocalModels = true;
      env.allowRemoteModels = true;
      env.useBrowserCache = true;

      // Use a small but capable model for mobile
      const textGenerator = await pipeline(
        'text-generation', 
        'Xenova/Qwen2.5-0.5B-Instruct',
        {
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              setDownloadProgress(percent);
            }
          }
        }
      );

      setSession(textGenerator);
      setModelStatus('ready');
      setDownloadProgress(100);
    } catch (err) {
      throw new Error(`Transformers.js initialization failed: ${err}`);
    }
  }, []);

  // Initialize WebLLM
  const initializeWebLLM = useCallback(async () => {
    setModelStatus('downloading');
    setDownloadProgress(0);

    try {
      // Dynamic import WebLLM
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
      
      const engine = await CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC', {
        initProgressCallback: (progress) => {
          setDownloadProgress(Math.round(progress.progress * 100));
        }
      });

      setSession(engine);
      setModelStatus('ready');
      setDownloadProgress(100);
    } catch (err) {
      throw new Error(`WebLLM initialization failed: ${err}`);
    }
  }, []);

  // Initialize Ollama
  const initializeOllama = useCallback(async () => {
    setModelStatus('loading');
    
    try {
      // Check if a lightweight model is available
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      
      if (!data.models || data.models.length === 0) {
        throw new Error('No Ollama models available. Please install a model (e.g., ollama pull llama3.2:1b)');
      }

      // Use the first available model
      const modelName = data.models[0].name;
      setSession({ modelName, apiUrl: 'http://localhost:11434/api/generate' });
      setModelStatus('ready');
      setDownloadProgress(100);
    } catch (err) {
      throw new Error(`Ollama initialization failed: ${err}`);
    }
  }, []);

  // Switch between AI engines
  const switchEngine = useCallback(async (engine: AIEngine) => {
    try {
      setError(null);
      setCurrentEngine(engine);
      
      // Clean up current session
      if (session && typeof session.destroy === 'function') {
        session.destroy();
      }
      setSession(null);

      switch (engine) {
        case 'chrome-builtin':
          await initializeChromeAI();
          break;
        case 'transformers':
          await initializeTransformersJS();
          break;
        case 'webllm':
          await initializeWebLLM();
          break;
        case 'ollama':
          await initializeOllama();
          break;
      }
      
      setCurrentEngine(engine);
      setIsSupported(true);
    } catch (err) {
      console.error(`Failed to initialize ${engine}:`, err);
      setModelStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to initialize AI engine');
      setIsSupported(false);
    }
  }, [session, initializeChromeAI, initializeTransformersJS, initializeWebLLM, initializeOllama]);

  // Generate text using current engine
  const generate = useCallback(async (prompt: string, image?: string): Promise<string> => {
    if (!session || modelStatus !== 'ready') {
      throw new Error('AI model is not ready. Please wait for initialization to complete.');
    }

    try {
      switch (currentEngine) {
        case 'chrome-builtin':
          return await generateWithChromeAI(session, prompt, image);
        case 'transformers':
          return await generateWithTransformers(session, prompt);
        case 'webllm':
          return await generateWithWebLLM(session, prompt);
        case 'ollama':
          return await generateWithOllama(session, prompt);
        default:
          throw new Error('No AI engine selected');
      }
    } catch (err) {
      console.error('Generation error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to generate AI response');
    }
  }, [session, modelStatus, currentEngine]);

  // Engine-specific generation functions
  const generateWithChromeAI = async (session: LanguageModelSession, prompt: string, image?: string) => {
    if (image) {
      const input = [{
        role: 'user',
        content: [
          { type: 'text', value: prompt },
          { type: 'image', value: image }
        ]
      }];
      return await session.prompt(input);
    }
    return await session.prompt(prompt);
  };

  const generateWithTransformers = async (pipeline: any, prompt: string) => {
    const result = await pipeline(`Human: ${prompt}\n\nAssistant:`, {
      max_new_tokens: 150,
      temperature: 0.7,
      do_sample: true,
      pad_token_id: 0,
    });

    if (result?.[0]?.generated_text) {
      let response = result[0].generated_text;
      const assistantIndex = response.indexOf('Assistant:');
      if (assistantIndex !== -1) {
        response = response.substring(assistantIndex + 10).trim();
      }
      return response.replace(/Human:.*$/s, '').trim() || 
        'I apologize, but I was unable to generate a proper response.';
    }
    throw new Error('No response generated');
  };

  const generateWithWebLLM = async (engine: any, prompt: string) => {
    const response = await engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || 'No response generated';
  };

  const generateWithOllama = async (config: any, prompt: string) => {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.modelName,
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    return data.response || 'No response generated';
  };

  // Auto-detect and initialize best available engine
  useEffect(() => {
    const initializeBestEngine = async () => {
      try {
        const engines = await detectEngines();
        
        if (engines.length === 0) {
          setModelStatus('unsupported');
          setError('No offline AI engines available. Please ensure you have Chrome 128+ or install required dependencies.');
          return;
        }

        // Preference order: Chrome AI > WebLLM > Transformers.js > Ollama
        const enginePriority: AIEngine[] = ['chrome-builtin', 'webllm', 'transformers', 'ollama'];
        const bestEngine = enginePriority.find(engine => engines.includes(engine));
        
        if (bestEngine) {
          await switchEngine(bestEngine);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setModelStatus('error');
        setError('Failed to initialize any AI engine');
      }
    };

    initializeBestEngine();
  }, [detectEngines, switchEngine]);

  return {
    generate,
    modelStatus,
    downloadProgress,
    error,
    isSupported,
    currentEngine,
    switchEngine,
    availableEngines
  };
}