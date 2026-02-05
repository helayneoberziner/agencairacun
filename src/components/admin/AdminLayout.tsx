 import { Link, useLocation, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { 
   LayoutDashboard, 
   FolderOpen, 
   Mail, 
   Image, 
   Settings, 
   LogOut,
   Menu,
   X
 } from 'lucide-react';
 import { useState } from 'react';
 
 interface AdminLayoutProps {
   children: React.ReactNode;
   title: string;
 }
 
 const AdminLayout = ({ children, title }: AdminLayoutProps) => {
   const { signOut, user } = useAuth();
   const location = useLocation();
   const navigate = useNavigate();
   const [sidebarOpen, setSidebarOpen] = useState(false);
 
   const navItems = [
     { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
     { name: 'Projetos', path: '/admin/projects', icon: FolderOpen },
     { name: 'Mensagens', path: '/admin/messages', icon: Mail },
     { name: 'Mídia', path: '/admin/media', icon: Image },
     { name: 'Configurações', path: '/admin/settings', icon: Settings },
   ];
 
   const handleSignOut = async () => {
     await signOut();
     navigate('/admin/login');
   };
 
   return (
     <div className="min-h-screen bg-background flex">
       {/* Mobile overlay */}
       {sidebarOpen && (
         <div 
           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
           onClick={() => setSidebarOpen(false)}
         />
       )}
 
       {/* Sidebar */}
       <aside className={`
         fixed lg:static inset-y-0 left-0 z-50
         w-64 bg-card border-r border-border
         transform transition-transform duration-300
         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       `}>
         <div className="flex flex-col h-full">
           {/* Logo */}
           <div className="p-6 border-b border-border flex items-center justify-between">
             <Link to="/admin" className="text-2xl font-display font-bold text-gradient-neon">
               RACUN
             </Link>
             <button 
               onClick={() => setSidebarOpen(false)}
               className="lg:hidden p-2 hover:bg-muted rounded-lg"
             >
               <X className="w-5 h-5" />
             </button>
           </div>
 
           {/* Navigation */}
           <nav className="flex-1 p-4 space-y-2">
             {navItems.map((item) => (
               <Link
                 key={item.path}
                 to={item.path}
                 onClick={() => setSidebarOpen(false)}
                 className={`
                   flex items-center gap-3 px-4 py-3 rounded-lg
                   transition-colors duration-200
                   ${location.pathname === item.path
                     ? 'bg-primary text-primary-foreground'
                     : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                   }
                 `}
               >
                 <item.icon className="w-5 h-5" />
                 {item.name}
               </Link>
             ))}
           </nav>
 
           {/* User & Logout */}
           <div className="p-4 border-t border-border space-y-3">
             <div className="px-4 py-2 text-sm text-muted-foreground truncate">
               {user?.email}
             </div>
             <button
               onClick={handleSignOut}
               className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
             >
               <LogOut className="w-5 h-5" />
               Sair
             </button>
             <Link
               to="/"
               className="flex items-center justify-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
             >
               ← Voltar ao site
             </Link>
           </div>
         </div>
       </aside>
 
       {/* Main content */}
       <main className="flex-1 flex flex-col min-h-screen">
         {/* Header */}
         <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
           <button 
             onClick={() => setSidebarOpen(true)}
             className="lg:hidden p-2 hover:bg-muted rounded-lg"
           >
             <Menu className="w-5 h-5" />
           </button>
           <h1 className="text-xl font-display font-semibold">{title}</h1>
         </header>
 
         {/* Page content */}
         <div className="flex-1 p-6 overflow-auto">
           {children}
         </div>
       </main>
     </div>
   );
 };
 
 export default AdminLayout;