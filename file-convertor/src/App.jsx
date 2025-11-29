import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("jpg");
  const [resultUrl, setResultUrl] = useState(null);

  const server = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function handleImageConvert(e) {
    e.preventDefault();
    if (!file) return alert("Choose a file");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("target", target);
    const resp = await fetch(`${server}/convert/image`, {
      method: "POST",
      body: fd,
    });
    if (!resp.ok) {
      const err = await resp.json();
      return alert(err.message || "Conversion failed");
    }
    // get blob and create download link
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    setResultUrl(url);
  }

  const handleCsvToJson = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a CSV");
    const fd = new FormData();
    fd.append("file", file);
    const resp = await fetch(`${server}/convert/csv-to-json`, { method: "POST", body: fd });
    const json = await resp.json();
    // show pretty JSON in new tab
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">File Convertor</h1>

        <label className="block mb-2 text-sm font-medium">Choose file</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0] || null)}
          className="mb-4"
        />

        <div className="space-y-4">
          <form onSubmit={handleImageConvert} className="space-y-2">
            <div>
              <label className="block text-sm">Image target format</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="border p-2 rounded">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">Convert Image</button>
          </form>

          <form onSubmit={handleCsvToJson} className="space-y-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded">CSV → JSON</button>
          </form>

          {resultUrl && (
            <div>
              <a href={resultUrl} download className="text-indigo-600 underline">Download converted file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
