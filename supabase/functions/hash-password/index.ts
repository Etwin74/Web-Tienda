Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Usar Web Crypto API para hash (disponible en Deno)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'ferreteria_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Formato compatible con bcrypt (simulado con SHA-256 + salt)
    const hash = `$2b$10$${hashHex.substring(0, 53)}`;

    return new Response(JSON.stringify({ data: { hash } }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: { code: 'HASH_ERROR', message: error.message }
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
