 import { useEffect, useState } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { User, Session } from '@supabase/supabase-js';
 
 interface AuthState {
   user: User | null;
   session: Session | null;
   isLoading: boolean;
   isAdmin: boolean;
 }
 
 export const useAuth = () => {
   const [authState, setAuthState] = useState<AuthState>({
     user: null,
     session: null,
     isLoading: true,
     isAdmin: false,
   });
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         const user = session?.user ?? null;
         let isAdmin = false;
         
         if (user) {
           const { data } = await supabase
             .from('user_roles')
             .select('role')
             .eq('user_id', user.id)
             .eq('role', 'admin')
             .single();
           
           isAdmin = !!data;
         }
         
         setAuthState({
           user,
           session,
           isLoading: false,
           isAdmin,
         });
       }
     );
 
     supabase.auth.getSession().then(async ({ data: { session } }) => {
       const user = session?.user ?? null;
       let isAdmin = false;
       
       if (user) {
         const { data } = await supabase
           .from('user_roles')
           .select('role')
           .eq('user_id', user.id)
           .eq('role', 'admin')
           .single();
         
         isAdmin = !!data;
       }
       
       setAuthState({
         user,
         session,
         isLoading: false,
         isAdmin,
       });
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signIn = async (email: string, password: string) => {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     return { data, error };
   };
 
   const signOut = async () => {
     const { error } = await supabase.auth.signOut();
     return { error };
   };
 
   return {
     ...authState,
     signIn,
     signOut,
   };
 };