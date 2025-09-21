export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Text Overlay Generator</h1>
      <p>API is running at: <code>/api/generate-text</code></p>
      <p>Send POST requests with JSON: <code>{`{"text": "Your Text"}`}</code></p>
    </div>
  )
}
