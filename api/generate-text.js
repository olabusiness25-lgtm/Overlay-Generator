// api/generate-text.js
import { createCanvas } from 'canvas';

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

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);
    
    // Set font
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Create metallic gradient
    const gradient = ctx.createLinearGradient(0, centerY - fontSize/2, 0, centerY + fontSize/2);
    gradient.addColorStop(0, '#E8E8E8');
    gradient.addColorStop(0.2, '#FFFFFF');
    gradient.addColorStop(0.4, '#C0C0C0');
    gradient.addColorStop(0.6, '#A0A0A0');
    gradient.addColorStop(0.8, '#808080');
    gradient.addColorStop(1, '#606060');
    
    // Draw text shadow (black)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(text, centerX + 3, centerY + 3);
    
    // Draw red outline
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 4;
    ctx.strokeText(text, centerX, centerY);
    
    // Draw metallic fill
    ctx.fillStyle = gradient;
    ctx.fillText(text, centerX, centerY);
    
    // Add inner highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeText(text, centerX, centerY);
    
    // Convert to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = buffer.toString('base64');
    
    return res.status(200).json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      downloadUrl: `data:image/png;base64,${base64}`
    });
    
  } catch (error) {
    console.error('Error generating text overlay:', error);
    return res.status(500).json({ error: 'Failed to generate text overlay' });
  }
}
