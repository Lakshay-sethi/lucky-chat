
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-16 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Welcome to <span className="text-accent">Lucky Chat</span>
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mb-8">
          Connect with friends and family in a secure and beautiful chat experience. Share moments, send messages, and stay connected.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-full">
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="border-accent hover:bg-accent/10 px-8 py-6 text-lg rounded-full">
            <Link to="/auth?mode=login">Login</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-foreground/5 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Lucky Chat?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Real-time Messaging</h3>
              <p className="text-muted text-center">Instantly send and receive messages with friends and family.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Secure & Private</h3>
              <p className="text-muted text-center">Your conversations are encrypted and private.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Beautiful Interface</h3>
              <p className="text-muted text-center">Enjoy a clean and intuitive chat experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-8 bg-background text-muted text-center text-sm">
        <p>© {new Date().getFullYear()} Lucky Chat. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Landing;
