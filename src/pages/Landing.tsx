
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EnvVarsForm from "@/components/EnvVarsForm";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Lucky Chat</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            A modern and secure real-time chat application
          </p>
        </div>
        
        <div className="space-y-8">
          <EnvVarsForm />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
