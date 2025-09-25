import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, Download, HardDrive, Smartphone } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

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
                <h3 className="font-medium">Gemini Nano Model</h3>
                <Badge variant="secondary">Ready</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Downloaded</span>
                  <span>4.2 GB / 4.2 GB</span>
                </div>
                <Progress value={100} className="h-2" />
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
                  <span>AI Models</span>
                  <span>4.2 GB</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Chat History</span>
                  <span>12 MB</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">65% of available space used</p>
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
                  <p className="text-muted-foreground">RAM Usage</p>
                  <p className="font-medium">2.1 GB / 8 GB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className="font-medium text-green-600">Optimal</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t">
              <Button variant="outline" className="w-full" disabled>
                <Download size={16} className="mr-2" />
                Update Model (Latest)
              </Button>
              
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