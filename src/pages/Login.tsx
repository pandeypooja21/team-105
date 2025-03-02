
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <AuthForm mode="login" />
      </main>
    </div>
  );
};

export default Login;
