
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <AuthForm mode="signup" />
      </main>
    </div>
  );
};

export default Signup;
