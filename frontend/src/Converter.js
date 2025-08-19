import React, { useRef, useState } from "react";
function Converter() {
  const [file, setFile] = useState(null);
  const [inputFormat, setInputFormat] = useState("pdf");
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [downloadUrl, setDownloadUrl] = useState("");
  const messageRef = useRef(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl("");
  };

  const handleSubmit = async () => {
    if (!file) {
      messageRef.current.style.color = "red";
      messageRef.current.textContent = "Please Choose file to move forward !";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("inputFormat", inputFormat);
    formData.append("outputFormat", outputFormat);

    try {
      messageRef.current.style.color = "blue";
      messageRef.current.textContent = "Uploading and converting file...";
      setDownloadUrl("");

      const response = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        messageRef.current.style.color = "red";
        messageRef.current.textContent = `Upload failed: " + ${response.statusText}`;
      }

      const data = await response.json();

      messageRef.current.style.color = "green";
      messageRef.current.textContent =
        data.message || "File converted successfully!";
      setDownloadUrl(data.fileUrl || "");
    } catch (error) {
      messageRef.current.style.color = "red";
      messageRef.current.textContent = `Error : ${error.message}`;
      setDownloadUrl("");
    }
  };

  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center p-4">
      <article className="flex flex-col gap-4 w-full md:w-1/2 justify-center items-center border-2 rounded-md p-4 shadow-[0.1rem_0.1rem_0.8rem_black_inset] box-border">
        <h2 className="text-5xl md:text-7xl font-bold text-center">
          File Converter
        </h2>
        <article className="w-full sm:w-1/2 flex flex-wrap sm:flex-nowrap items-center justify-between box-border">
          <label
            className="p-4 text-2xl font-bold whitespace-nowrap"
            for="chooseFile"
          >
            File :{" "}
          </label>
          <input
            id="chooseFile"
            name="chooseFile"
            type="file"
            accept={`.${inputFormat}`}
            onChange={handleFileChange}
            className="cursor-pointer rounded-md bg-gray-400 border-2 max-w-full border-black p-4 text-white"
          />
        </article>
        <article className="w-full sm:w-1/2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <label
            className="p-4 text-2xl font-bold whitespace-nowrap"
            for="conversion"
          >
            Conversion :
          </label>
          <article className="flex gap-2 flex-nowrap">
            <div className="flex flex-nowrap items-center gap-2">
              <label for="from" className="whitespace-nowrap">
                From :{" "}
              </label>
              <select
                id="from"
                name="from"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="bg-gray-400 p-2 rounded-md"
              >
                <option value="pdf">PDF</option>{" "}
                <option value="docx">DOCX</option>
                <option value="xlsx">XLSX</option>{" "}
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <div className="flex flex-nowrap items-center gap-2">
              <label for="from" className="whitespace-nowrap">
                To :{" "}
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="bg-gray-400 p-2 rounded-md"
              >
                <option value="pdf">PDF</option>{" "}
                <option value="docx">DOCX</option>
                <option value="xlsx">XLSX</option>{" "}
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>
          </article>
        </article>
        <button
          onClick={handleSubmit}
          className="border-2 rounded-md p-4 shadow-[0.1rem_0.1rem_2rem_0.5rem_gray_inset] font-bold focus:shadow-[0.1rem_0.1rem_2rem_0.5rem_green_inset]"
        >
          Upload & Convert
        </button>
        <p ref={messageRef} className="animate-pulse duration-200"></p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 p-4 rounded-md border-green-500 shadow-[0.1rem_0.1rem_2rem_0.5rem_green_inset] font-bold focus:shadow-[0.1rem_0.1rem_2rem_0.5rem_blue_inset]"
          >
            Download Converted File
          </a>
        )}
      </article>
    </section>
  );
}
export default Converter;
