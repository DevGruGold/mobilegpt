import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, HardDrive, Smartphone } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  modelStatus: 'idle' | 'downloading' | 'ready' | 'error';
  downloadProgress: number;
  modelError: string | null;
}

export function SettingsPanel({ isOpen, onClose, modelStatus, downloadProgress, modelError }: SettingsPanelProps) {
  if (!isOpen) return null;

  const getStatusBadge = () => {
    switch (modelStatus) {
      case 'ready': return <Badge className="bg-green-600">Ready</Badge>;
      case 'downloading': return <Badge className="bg-yellow-600">Downloading</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="secondary">Initializing</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4">
      <div className="max-w-md mx-auto mt-8">
        <Card className="shadow-card">
          <CardHeader className="text-center border-b">
            <div className="mx-auto w-12 h-12 bg-gradient-chat rounded-full flex items-center justify-center mb-3">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <CardTitle>MobileGPT Settings</CardTitle>
            <CardDescription>Manage your offline AI models</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {/* Model Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">TinyLlama 1.1B</h3>
                {getStatusBadge()}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Download Progress</span>
                  <span>{downloadProgress}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
                {modelError && (
                  <p className="text-xs text-red-600 mt-2">{modelError}</p>
                )}
              </div>
            </div>

            {/* Storage Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive size={16} />
                <h3 className="font-medium">Storage Usage</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>AI Model</span>
                  <span>~600 MB</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Chat History</span>
                  <span>Local Storage</span>
                </div>
              </div>
            </div>

            {/* Device Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone size={16} />
                <h3 className="font-medium">Device Optimization</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Mode</p>
                  <p className="font-medium">Browser</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className="font-medium text-green-600">
                    {modelStatus === 'ready' ? 'Optimal' : 'Loading'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-chat hover:shadow-fab"
              >
                Close Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
