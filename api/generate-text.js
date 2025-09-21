// api/generate-text.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, width = 800, height = 200, fontSize = 60 } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    // Generate SVG with metallic text effect
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Metallic gradient -->
          <linearGradient id="metallic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#E8E8E8;stop-opacity:1" />
            <stop offset="20%" style="stop-color:#FFFFFF;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#C0C0C0;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#A0A0A0;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#808080;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#606060;stop-opacity:1" />
          </linearGradient>
          
          <!-- Drop shadow filter -->
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
        </defs>
        
        <!-- Main text -->
        <text x="${width/2}" y="${height/2}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="bold" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="url(#metallic)" 
              stroke="#FF0000" 
              stroke-width="4"
              filter="url(#dropshadow)">
          ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </text>
        
        <!-- Inner highlight -->
        <text x="${width/2}" y="${height/2}" 
              font-family="Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="bold" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="none" 
              stroke="rgba(255,255,255,0.7)" 
              stroke-width="1">
          ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </text>
      </svg>
    `;

    // Convert SVG to base64
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    
    return res.status(200).json({
      success: true,
      image: dataUrl,
      downloadUrl: dataUrl,
      svg: svg
    });
    
  } catch (error) {
    console.error('Error generating text overlay:', error);
    return res.status(500).json({ error: 'Failed to generate text overlay' });
  }
}
