 import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 }
 
 Deno.serve(async (req) => {
   if (req.method === 'OPTIONS') {
     return new Response(null, { headers: corsHeaders })
   }
 
   try {
     const { email, password } = await req.json()
 
     if (!email || !password) {
       return new Response(
         JSON.stringify({ error: 'Email and password are required' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
 
     const supabaseAdmin = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
       {
         auth: {
           autoRefreshToken: false,
           persistSession: false,
         },
       }
     )
 
     // Check if any admin exists
     const { data: existingAdmins } = await supabaseAdmin
       .from('user_roles')
       .select('*')
       .eq('role', 'admin')
       .limit(1)
 
     if (existingAdmins && existingAdmins.length > 0) {
       return new Response(
         JSON.stringify({ error: 'Admin already exists. Contact support to add more admins.' }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
 
     // Create the user
     const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
       email,
       password,
       email_confirm: true,
     })
 
     if (authError) {
       return new Response(
         JSON.stringify({ error: authError.message }),
         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
 
     // Add admin role
     const { error: roleError } = await supabaseAdmin
       .from('user_roles')
       .insert({ user_id: authData.user.id, role: 'admin' })
 
     if (roleError) {
       return new Response(
         JSON.stringify({ error: 'User created but failed to assign admin role' }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       )
     }
 
     return new Response(
       JSON.stringify({ 
         success: true, 
         message: 'Admin user created successfully',
         userId: authData.user.id 
       }),
       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     )
   } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
     return new Response(
      JSON.stringify({ error: errorMessage }),
       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
     )
   }
 })