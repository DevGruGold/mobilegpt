import torch
import onnxruntime as ort
import numpy as np
from typing import Optional, Union
import logging

logger = logging.getLogger(__name__)

class ModelLoader:
    '''
    Unified model loader for various formats (PyTorch, ONNX, TFLite)
    '''
    
    @staticmethod
    def load_pytorch_model(model_path: str, device: str = 'cpu'):
        '''Load PyTorch model'''
        try:
            model = torch.load(model_path, map_location=device)
            model.eval()
            logger.info(f"Successfully loaded PyTorch model from {model_path}")
            return model
        except Exception as e:
            logger.error(f"Error loading PyTorch model: {e}")
            raise
    
    @staticmethod
    def load_onnx_model(model_path: str):
        '''Load ONNX model'''
        try:
            session = ort.InferenceSession(model_path)
            logger.info(f"Successfully loaded ONNX model from {model_path}")
            return session
        except Exception as e:
            logger.error(f"Error loading ONNX model: {e}")
            raise
    
    @staticmethod
    def load_quantized_model(model_path: str):
        '''Load quantized model (INT8)'''
        try:
            # For ONNX quantized models
            session_options = ort.SessionOptions()
            session_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
            
            session = ort.InferenceSession(model_path, session_options)
            logger.info(f"Successfully loaded quantized model from {model_path}")
            return session
        except Exception as e:
            logger.error(f"Error loading quantized model: {e}")
            raise
    
    @staticmethod
    def get_model_info(model_path: str):
        '''Get model information'''
        try:
            session = ort.InferenceSession(model_path)
            
            input_info = []
            for input_meta in session.get_inputs():
                input_info.append({
                    'name': input_meta.name,
                    'shape': input_meta.shape,
                    'type': input_meta.type
                })
            
            output_info = []
            for output_meta in session.get_outputs():
                output_info.append({
                    'name': output_meta.name,
                    'shape': output_meta.shape,
                    'type': output_meta.type
                })
            
            return {
                'inputs': input_info,
                'outputs': output_info
            }
        except Exception as e:
            logger.error(f"Error getting model info: {e}")
            raise

class MobileInference:
    '''
    Optimized inference engine for mobile devices
    '''
    
    def __init__(self, model_path: str, model_type: str = 'onnx'):
        self.model_type = model_type
        
        if model_type == 'onnx':
            self.model = ModelLoader.load_onnx_model(model_path)
        elif model_type == 'pytorch':
            self.model = ModelLoader.load_pytorch_model(model_path)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
    
    def predict(self, input_data: np.ndarray):
        '''Run inference'''
        try:
            if self.model_type == 'onnx':
                input_name = self.model.get_inputs()[0].name
                outputs = self.model.run(None, {input_name: input_data})
                return outputs[0]
            elif self.model_type == 'pytorch':
                with torch.no_grad():
                    input_tensor = torch.from_numpy(input_data)
                    output = self.model(input_tensor)
                    return output.numpy()
        except Exception as e:
            logger.error(f"Error during inference: {e}")
            raise
    
    def batch_predict(self, input_batch: list):
        '''Batch inference for multiple inputs'''
        results = []
        for input_data in input_batch:
            result = self.predict(input_data)
            results.append(result)
        return results
