import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('mobilegpt-onboarding-complete');
    if (hasCompletedOnboarding) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('mobilegpt-onboarding-complete', 'true');
    setShowWelcome(false);
  };

  return (
    <ErrorBoundary>
      {showWelcome ? (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      ) : (
        <ChatInterface />
      )}
    </ErrorBoundary>
  );
};

export default Index;
