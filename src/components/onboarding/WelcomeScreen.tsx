import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Download, Shield, Zap, Check } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "Offline AI Intelligence",
      description: "Powered by Gemini Nano running entirely on your device"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Your conversations never leave your device"
    },
    {
      icon: Zap,
      title: "Image Analysis",
      description: "Analyze photos and images with AI vision"
    }
  ];

  const handleDownloadModel = async () => {
    setIsDownloading(true);
    setStep(1);
    
    // Simulate model download
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setDownloadProgress(i);
    }
    
    setStep(2);
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-chat rounded-full flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome to MobileGPT</CardTitle>
          <CardDescription>Your personal offline AI assistant</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 0 && (
            <>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <feature.icon size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>AI Model Download</span>
                  <Badge variant="secondary">4.2 GB</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Download the AI model to start using MobileGPT offline
                </p>
                <Button 
                  onClick={handleDownloadModel}
                  className="w-full bg-gradient-chat hover:shadow-fab"
                  disabled={isDownloading}
                >
                  <Download size={16} className="mr-2" />
                  Download AI Model
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="animate-pulse-soft">
                <Download size={48} className="mx-auto text-primary mb-4" />
              </div>
              <h3 className="font-medium">Downloading AI Model</h3>
              <p className="text-sm text-muted-foreground">
                Please keep the app open while downloading
              </p>
              <div className="space-y-2">
                <Progress value={downloadProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{downloadProgress}% complete</span>
                  <span>4.2 GB</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="font-medium">Setup Complete!</h3>
              <p className="text-sm text-muted-foreground">
                MobileGPT is ready to use offline
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}