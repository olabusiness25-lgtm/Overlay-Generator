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

    // Generate SVG with System font style - white text with blue outline
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Drop shadow filter -->
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/>
          </filter>
        </defs>
        
        <!-- Background stroke (blue outline) -->
        <text x="${width/2}" y="${height/2}" 
              font-family="system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="800" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="none" 
              stroke="#1e90ff" 
              stroke-width="10"
              filter="url(#dropshadow)">
          ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </text>
        
        <!-- White text fill -->
        <text x="${width/2}" y="${height/2}" 
              font-family="system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif" 
              font-size="${fontSize}" 
              font-weight="800" 
              text-anchor="middle" 
              dominant-baseline="middle"
              fill="white">
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
