import React, { useState } from "react";
function Converter() {
  const [file, setFile] = useState(null);
  const [inputFormat, setInputFormat] = useState("pdf");
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setDownloadUrl("");
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("inputFormat", inputFormat);
    formData.append("outputFormat", outputFormat);

    try {
      setMessage("Uploading and converting file...");
      setDownloadUrl("");

      const response = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed: " + response.statusText);
      }

      const data = await response.json();

      // ✅ use fileUrl (backend sends this, not downloadUrl)
      setMessage(data.message || "File converted successfully!");
      setDownloadUrl(data.fileUrl || "");
    } catch (error) {
      setMessage("Error: " + error.message);
      setDownloadUrl("");
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>File Converter</h2>
      <input type="file" onChange={handleFileChange} />
      <br /> {/* Format selectors */}
      <div style={{ marginTop: "15px" }}>
        <label>
          From:
          <select
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
          >
            <option value="pdf">PDF</option> <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option> <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
        </label>
        <label style={{ marginLeft: "20px" }}>
          To:
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <option value="pdf">PDF</option> <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option> <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}
      >
        Upload & Convert
      </button>
      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Download Converted File
        </a>
      )}
    </div>
  );
}
export default Converter;
