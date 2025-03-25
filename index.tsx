
import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [url, setUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!apiKey || (!files.length && !url)) {
      alert("Please provide API key and either files or a URL.")
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('pdf_files', file))
    if (url) formData.append('url', url)
    formData.append('api_key', apiKey)

    setLoading(true)
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/extract', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    setResponse(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🛍️ Product Structurer Agent</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">OpenAI API Key</label>
        <input
          type="password"
          className="w-full border px-4 py-2 rounded"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Upload Product PDFs</label>
        <input
          type="file"
          multiple
          className="w-full"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Or Paste Product URL</label>
        <input
          type="text"
          className="w-full border px-4 py-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Extracting..." : "Extract"}
      </button>

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Structured Output:</h2>
          <pre className="bg-white p-4 border rounded overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
