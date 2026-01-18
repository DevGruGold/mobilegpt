import onnx
from onnxruntime.quantization import quantize_dynamic, QuantType
import torch
import logging

logger = logging.getLogger(__name__)

class ModelOptimizer:
    '''
    Utilities for optimizing models for mobile deployment
    '''
    
    @staticmethod
    def quantize_onnx_model(input_model_path: str, output_model_path: str):
        '''Quantize ONNX model to INT8'''
        try:
            quantize_dynamic(
                input_model_path,
                output_model_path,
                weight_type=QuantType.QUInt8
            )
            logger.info(f"Model quantized successfully: {output_model_path}")
            
            # Compare model sizes
            import os
            original_size = os.path.getsize(input_model_path) / (1024 * 1024)  # MB
            quantized_size = os.path.getsize(output_model_path) / (1024 * 1024)  # MB
            
            logger.info(f"Original size: {original_size:.2f} MB")
            logger.info(f"Quantized size: {quantized_size:.2f} MB")
            logger.info(f"Compression ratio: {original_size/quantized_size:.2f}x")
            
        except Exception as e:
            logger.error(f"Error quantizing model: {e}")
            raise
    
    @staticmethod
    def convert_pytorch_to_onnx(model, dummy_input, output_path: str):
        '''Convert PyTorch model to ONNX'''
        try:
            torch.onnx.export(
                model,
                dummy_input,
                output_path,
                export_params=True,
                opset_version=12,
                do_constant_folding=True,
                input_names=['input'],
                output_names=['output'],
                dynamic_axes={
                    'input': {0: 'batch_size'},
                    'output': {0: 'batch_size'}
                }
            )
            logger.info(f"Model converted to ONNX: {output_path}")
        except Exception as e:
            logger.error(f"Error converting to ONNX: {e}")
            raise
    
    @staticmethod
    def optimize_onnx_model(model_path: str, output_path: str):
        '''Optimize ONNX model for inference'''
        try:
            import onnx
            from onnxruntime.transformers import optimizer
            
            # Load model
            model = onnx.load(model_path)
            
            # Optimize
            optimized_model = optimizer.optimize_model(model)
            
            # Save
            onnx.save(optimized_model, output_path)
            logger.info(f"Model optimized: {output_path}")
            
        except Exception as e:
            logger.error(f"Error optimizing model: {e}")
            raise

class MobileExporter:
    '''
    Export models for mobile platforms
    '''
    
    @staticmethod
    def export_to_tflite(model_path: str, output_path: str):
        '''Export ONNX model to TensorFlow Lite'''
        logger.info("TFLite export functionality to be implemented")
        # This would require onnx-tf and tensorflow packages
        pass
    
    @staticmethod
    def export_to_coreml(model_path: str, output_path: str):
        '''Export model to CoreML for iOS'''
        logger.info("CoreML export functionality to be implemented")
        # This would require coremltools package
        pass
