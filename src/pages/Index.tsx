import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code, MessageSquare, Users, Zap, Play, Sparkles, BookOpen, CreditCard } from 'lucide-react';
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a2068] via-[#3c1e76] to-[#491c64]">
      {/* Navigation Bar */}
      <div className="bg-[#151c3b] py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[#a2b4ff] text-2xl font-bold flex items-center">
            <Code className="mr-2" />
            <span>CodeHuddle</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <a href="#features" className="text-gray-300 hover:text-white">Features</a>
          <a href="#about" className="text-gray-300 hover:text-white">About</a>
          <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
          <Button variant="link" className="text-white" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button className="bg-[#3e87f8] hover:bg-[#2c6ee0] text-white" onClick={() => navigate('/signup')}>
            Register
          </Button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Code Together. <span className="text-[#7EB5FF]">Stuck Less</span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mb-10">
          A real-time collaborative code editor that makes pair programming 
          simple and effective.
        </p>
        
        <div className="flex gap-4">
          <Button size="lg" className="bg-[#3e87f8] hover:bg-[#2c6ee0] text-white px-8 py-6 text-lg" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#151c3b]">
            Why Choose CodeHuddle?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200">
              <div className="bg-[#e6f0ff] text-[#3e87f8] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Editor</h3>
              <p className="text-gray-600">
                Code together in real-time with syntax highlighting and auto-completion.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200">
              <div className="bg-[#e7ffe6] text-[#3ec03e] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                See who's typing in real-time and work together seamlessly.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200">
              <div className="bg-[#f2e6ff] text-[#8e3efb] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Built-in Chat</h3>
              <p className="text-gray-600">
                Discuss your code without switching to another application.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200">
              <div className="bg-[#fff8e6] text-[#fbb63e] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Play size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Run Code</h3>
              <p className="text-gray-600">
                Execute and preview your code instantly within the editor.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#151c3b]">
            About CodeHuddle
          </h2>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 mb-6">
              CodeHuddle was born from the frustration of trying to collaborate on code remotely. We've built a platform that makes it easy for developers to work together, no matter where they are in the world.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to make collaborative coding as seamless as possible, allowing teams to focus on building great software together rather than fighting with their tools.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-[#e6f5ff] text-[#3e87f8] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Open Source</h3>
                <p className="text-gray-600">
                  Built with transparency and community contribution in mind.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#fff5e6] text-[#ff9500] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovative</h3>
                <p className="text-gray-600">
                  Constantly evolving with new features and improvements.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#f0e6ff] text-[#8e3efb] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
                <p className="text-gray-600">
                  Built for developers, by developers who understand your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#151c3b]">
            Simple, Transparent Pricing
          </h2>
          
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your needs. All plans include our core collaborative features.
          </p>
          
          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <p className="text-gray-600 mb-4">Perfect for small teams and personal projects</p>
                <div className="text-4xl font-bold mb-2">$0<span className="text-xl text-gray-500 font-normal">/month</span></div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Real-time collaborative code editor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Built-in chat functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Up to 5 participants per room</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-500">Live code preview</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-500">Unlimited participants</span>
                </li>
              </ul>
              
              <Button variant="outline" className="mt-auto" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-[#f9faff] p-8 rounded-lg shadow-md border border-[#3e87f8] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#3e87f8] text-white px-4 py-1 text-sm font-medium">
                POPULAR
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-gray-600 mb-4">For teams that need advanced features</p>
                <div className="text-4xl font-bold mb-2">$9.99<span className="text-xl text-gray-500 font-normal">/month</span></div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Real-time collaborative code editor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Built-in chat functionality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited participants per room</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Live code preview</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button className="mt-auto bg-[#3e87f8] hover:bg-[#2c6ee0]" onClick={() => navigate('/signup')}>
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#151c3b] py-6 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} CodeHuddle. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;