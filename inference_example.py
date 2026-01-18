#!/usr/bin/env python3
"""
MobileGPT - Mobile-optimized AI inference
Based on insights from xmrt-pocketpal-ai
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import json

class MobileGPT:
    def __init__(self, model_name="microsoft/phi-2", device="cpu"):
        """
        Initialize MobileGPT with a specified model
        
        Supported models:
        - microsoft/phi-2 (2.7B parameters)
        - TinyLlama/TinyLlama-1.1B-Chat-v1.0
        - google/gemma-2b
        """
        print(f"Loading model: {model_name}")
        self.device = device
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Load model with mobile optimizations
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            low_cpu_mem_usage=True
        )
        self.model.to(device)
        self.model.eval()
        
        print(f"Model loaded successfully on {device}")
    
    def generate(self, prompt, max_length=100, temperature=0.7):
        """Generate text from prompt"""
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=max_length,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)

def main():
    # Load configuration
    try:
        with open('model_config.json', 'r') as f:
            config = json.load(f)
        print("Configuration loaded")
    except:
        print("No configuration found, using defaults")
        config = {}
    
    # Initialize model
    print("Initializing MobileGPT...")
    gpt = MobileGPT()
    
    # Example inference
    prompt = "Hello, I am a mobile AI assistant. I can help you with"
    print(f"\nPrompt: {prompt}")
    print("Generating response...\n")
    
    response = gpt.generate(prompt, max_length=100)
    print(f"Response: {response}")

if __name__ == "__main__":
    main()
