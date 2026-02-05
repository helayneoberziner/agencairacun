 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Label } from '@/components/ui/label';
 import { toast } from 'sonner';
 import { Loader2, Lock } from 'lucide-react';
 
 const AdminLogin = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const { signIn } = useAuth();
   const navigate = useNavigate();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const { error } = await signIn(email, password);
       
       if (error) {
         toast.error('Credenciais inválidas');
         setIsLoading(false);
         return;
       }
 
       toast.success('Login realizado com sucesso!');
       navigate('/admin');
     } catch (err) {
       toast.error('Erro ao fazer login');
       setIsLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-background p-4">
       <div className="w-full max-w-md">
         <div className="glass-card p-8">
           {/* Header */}
           <div className="text-center mb-8">
             <Link to="/" className="inline-block mb-6">
               <span className="text-3xl font-display font-bold text-gradient-neon">
                 RACUN
               </span>
             </Link>
             <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
               <Lock className="w-8 h-8 text-primary" />
             </div>
             <h1 className="text-2xl font-display font-bold">Admin Login</h1>
             <p className="text-muted-foreground mt-2">
               Acesse o painel administrativo
             </p>
           </div>
 
           {/* Form */}
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
               <Label htmlFor="email">E-mail</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="admin@racun.com.br"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="bg-background/50"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">Senha</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="bg-background/50"
               />
             </div>
 
             <Button 
               type="submit" 
               className="w-full"
               disabled={isLoading}
             >
               {isLoading ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Entrando...
                 </>
               ) : (
                 'Entrar'
               )}
             </Button>
           </form>
 
           <div className="mt-6 text-center">
             <Link 
               to="/" 
               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
             >
               ← Voltar ao site
             </Link>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default AdminLogin;