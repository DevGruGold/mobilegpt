import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

class AIModelPipeline {
  static model = 'Xenova/TinyLlama-1.1B-Chat-v1.0';
  static instance: any = null;

  static async getInstance(progress_callback?: (progress: any) => void) {
    if (!this.instance) {
      this.instance = await pipeline('text-generation' as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case 'load': {
        const generator = await AIModelPipeline.getInstance((progress) => {
          self.postMessage({
            type: 'progress',
            data: progress
          });
        });
        
        self.postMessage({
          type: 'ready',
          data: { success: true }
        });
        break;
      }

      case 'generate': {
        const generator = await AIModelPipeline.getInstance();
        const result = await generator(data.prompt, {
          max_new_tokens: 256,
          temperature: 0.7,
          do_sample: true,
          top_k: 50,
        });

        self.postMessage({
          type: 'complete',
          data: { text: result[0].generated_text }
        });
        break;
      }

      default:
        console.warn('Unknown message type:', type);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});
