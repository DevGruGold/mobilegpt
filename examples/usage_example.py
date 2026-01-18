#!/usr/bin/env python3
'''
Example usage of MobileGPT model inference
'''

from src.model_loader import ModelLoader, MobileInference
from src.optimization import ModelOptimizer, MobileExporter
import numpy as np

def example_basic_inference():
    '''Basic inference example'''
    print("\n=== Basic Inference Example ===")
    
    # Load model
    model_path = "models/model.onnx"
    inference_engine = MobileInference(model_path, model_type='onnx')
    
    # Prepare dummy input
    input_data = np.random.randn(1, 3, 224, 224).astype(np.float32)
    
    # Run inference
    output = inference_engine.predict(input_data)
    print(f"Output shape: {output.shape}")
    print(f"Output sample: {output[0][:5]}")

def example_quantization():
    '''Model quantization example'''
    print("\n=== Model Quantization Example ===")
    
    input_model = "models/model.onnx"
    output_model = "models/model_quantized.onnx"
    
    # Quantize model
    ModelOptimizer.quantize_onnx_model(input_model, output_model)
    print(f"Quantized model saved to: {output_model}")

def example_model_info():
    '''Get model information'''
    print("\n=== Model Information Example ===")
    
    model_path = "models/model.onnx"
    info = ModelLoader.get_model_info(model_path)
    
    print("Model Inputs:")
    for inp in info['inputs']:
        print(f"  Name: {inp['name']}, Shape: {inp['shape']}, Type: {inp['type']}")
    
    print("\nModel Outputs:")
    for out in info['outputs']:
        print(f"  Name: {out['name']}, Shape: {out['shape']}, Type: {out['type']}")

def example_batch_inference():
    '''Batch inference example'''
    print("\n=== Batch Inference Example ===")
    
    model_path = "models/model.onnx"
    inference_engine = MobileInference(model_path, model_type='onnx')
    
    # Prepare batch of inputs
    batch_size = 4
    input_batch = [np.random.randn(1, 3, 224, 224).astype(np.float32) for _ in range(batch_size)]
    
    # Run batch inference
    outputs = inference_engine.batch_predict(input_batch)
    print(f"Processed {len(outputs)} samples")

if __name__ == "__main__":
    print("MobileGPT - Example Usage")
    print("=" * 50)
    
    # Run examples (comment out as needed)
    # example_basic_inference()
    # example_quantization()
    # example_model_info()
    # example_batch_inference()
    
    print("\nNote: Make sure you have a model file at 'models/model.onnx'")
    print("You can download pre-trained models from Hugging Face or train your own.")
