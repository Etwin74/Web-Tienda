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
    const { imageData, fileName, folder } = await req.json();

    if (!imageData || !fileName) {
      throw new Error('Image data and filename are required');
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Extraer datos base64
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];

    // Convertir base64 a binario
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Generar ruta de storage
    const timestamp = Date.now();
    const folderPath = folder || 'general';
    const storagePath = `${folderPath}/${timestamp}-${fileName}`;

    // Subir a Supabase Storage
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/ferreteria-wilmer/${storagePath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    // Obtener URL pública
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/ferreteria-wilmer/${storagePath}`;

    return new Response(JSON.stringify({
      data: { publicUrl, storagePath }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: { code: 'UPLOAD_ERROR', message: error.message }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
