import { FiUpload } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import Process from "./assets/Site_Details/Secondary/process";
import Nav from "./assets/Site_Details/Primary/nav";
import siteInfo from "./assets/Site_Details/Primary/siteInfo";
import FAQ from "./assets/Site_Details/Secondary/faq";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Home({
  tempUses,
  limitExceeded,
  params,
  tempUser,
  fingerprint,
  setLimitExceeded,
  setTempUser,
}) {
  const category = Nav().filter((item) => item.name === "Converters")[0]
    .submenu;
  const [faq, setFAQ] = useState(FAQ());
  const [file, setFile] = useState(null);
  const [inputFormat, setInputFormat] = useState("pdf");
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [downloadUrl, setDownloadUrl] = useState("");
  const messageRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl("");
  };
  const handleSubmit = async (e) => {
    if (!file) {
      e.target.style.boxShadow = "0.1rem 0.1rem 2rem 0.5rem red inset";
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

      const url = `${process.env.REACT_APP_BACKEND_HOST}/user_entry`;
      const response = await fetch(url, {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ fingerprint, tempUser, params }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 402) {
          setLimitExceeded(true);
          setTempUser({ used: tempUser.max, max: tempUser.max });
        }
        if (response.status === 401) {
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
        messageRef.current.style.color = "red";
        messageRef.current.textContent = `Upload failed : ${data.message}`;
        return;
      }
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_HOST}/api/convert`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok) {
          tempUses();
          messageRef.current.style.color = "#008000";
          messageRef.current.textContent = data.message;
          setDownloadUrl(data.fileUrl || "");
        } else {
          e.target.style.boxShadow = "0.1rem 0.1rem 2rem 0.5rem red inset";
          messageRef.current.style.color = "red";
          messageRef.current.textContent = `Upload failed : ${data.message}`;
        }
      } catch (error) {
        e.target.style.boxShadow = "0.1rem 0.1rem 2rem 0.5rem red inset";
        messageRef.current.style.color = "red";
        messageRef.current.textContent = `Error : ${error.message}`;
        setDownloadUrl("");
      }
    } catch (error) {
      console.log(error);
      e.target.style.boxShadow = "0.1rem 0.1rem 2rem 0.5rem red inset";
      messageRef.current.style.color = "red";
      messageRef.current.textContent = `Error : ${error.message}`;
    }
  };
  return (
    <section className="flex flex-col items-center gap-4 p-4 text-center py-12">
      <h1 className="text-4xl">Online File Converter</h1>
      <p className="text-gray-600 text-xl">Select File to convert</p>
      {/* upload section */}
      <article className="p-8 w-full md:w-[75%] lg:w-1/2 rounded-md bg-secondary1">
        <article className="p-4 rounded-md flex flex-col items-center gap-4 bg-secondary2">
          {limitExceeded ? (
            <article className="p-4 min-h-[20vh] rounded-md flex flex-col items-center justify-center gap-4 bg-secondary2 grow">
              <strong className="text-red-800 text-2xl animate-pulse font-georgia">
                You have excedded your free trial !
              </strong>
              <Link to={params.email ? "plans" : "/signin"}>
                <button className="border-2 border-secondary1 rounded-md py-2 px-4 font-bold focus:shadow-[0.1rem_0.1rem_2rem_0.5rem_green_inset] bg-primary text-white">
                  Choose Plan
                </button>
              </Link>
            </article>
          ) : (
            <article className="flex flex-col items-center gap-4">
              <FiUpload className="text-5xl text-primary" />
              <p className="text-white">Drag your files here or upload</p>
              <div className="flex relative w-full text-secondary1 justify-center items-center">
                <p className="p-2 z-[1] bg-secondary2">OR</p>
                <p className="absolute border-t-2 w-1/2 border-black"></p>
              </div>
              <article className="flex flex-wrap gap-4 justify-center items-center shrink">
                <input
                  id="chooseFile"
                  name="chooseFile"
                  type="file"
                  accept={`.${inputFormat}`}
                  onChange={handleFileChange}
                  className="py-2 px-4 rounded-md bg-secondary1 cursor-pointer w-full shrink"
                />
                <button
                  onClick={(e) => handleSubmit(e)}
                  className={`${
                    downloadUrl.length >= 2 ? "hidden" : "inline-block"
                  } border-2 border-secondary1 rounded-md py-2 px-4 font-bold focus:shadow-[0.1rem_0.1rem_2rem_0.5rem_green_inset] bg-primary text-white`}
                >
                  Convert
                </button>
              </article>
              <article className="flex gap-2 flex-wrap w-full justify-center items-center">
                <div className="flex flex-nowrap items-center gap-2">
                  <label
                    htmlFor="from"
                    className="whitespace-nowrap text-white font-bold"
                  >
                    From :{" "}
                  </label>
                  <select
                    id="from"
                    name="from"
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    className="bg-secondary1 p-2 rounded-md"
                  >
                    <option value="pdf">PDF</option>{" "}
                    <option value="docx">DOCX</option>
                    <option value="xlsx">XLSX</option>{" "}
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
                <div className="flex flex-nowrap items-center gap-2">
                  <label
                    htmlFor="from"
                    className="whitespace-nowrap text-white font-bold"
                  >
                    To :{" "}
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="bg-secondary1 p-2 rounded-md"
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
          )}
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
          <p
            ref={messageRef}
            className="text-secondary1 animate-pulse duration-200 font-bold"
          >
            Up to 50MB
          </p>
        </article>
      </article>
      {/* process section */}
      <article className="p-8 w-full rounded-md flex flex-col md:flex-row md:flex-wrap gap-4">
        {Process().map((item, index) => (
          <article
            key={`process/${index}`}
            className="flex p-2 flex-col items-center gap-2 grow"
          >
            <item.icon
              className={`text-primary text-7xl ${
                item.id === 2 ? "animate-spin" : "animate-pulse"
              } animationDuration`}
            />
            <p>Step {index + 1} :</p>
            <p className="text-gray-600">{item.name}</p>
          </article>
        ))}
      </article>
      {/* categories */}
      {category && (
        <article className="p-8 w-full rounded-md flex flex-col gap-4">
          <h3 className="text-2xl font-semibold">File Converter Categories</h3>
          <article className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 w-full gap-4">
            {category.map((item, index) => (
              <Link
                to={item.path}
                key={`category/${index}`}
                className="flex flex-col gap-2 items-center border-2 rounded-md shadow-[0.1rem_0.1rem_0.5rem_0.05rem_gray] p-4 grow"
              >
                <item.icon className="text-6xl text-gray-500" />
                <p className="">{item.name}</p>
              </Link>
            ))}
          </article>
        </article>
      )}
      {/* about */}
      <article className="w-full flex flex-col md:w-[80%] lg:w-[70%] gap-4">
        <h3 className="text-2xl font-semibold text-left">About ConvertFiles</h3>
        {siteInfo().about.map((para, index) => (
          <p
            key={`aboutPara/${index}`}
            className="text-left leading-loose text-gray-600"
          >
            {para}
          </p>
        ))}
      </article>
      {/* FAQ */}
      <article className="w-full flex flex-col md:w-[80%] lg:w-[70%] gap-4">
        <h3 className="text-2xl font-semibold text-left">
          Frequently Asked Questions
        </h3>
        {faq.map((item, index) => (
          <article
            key={`faq/${index}`}
            className="p-4 rounded-md flex flex-col gap-1 border-2 shadow-[0.01rem_0.01rem_0.2rem_0.01rem_black] transition-all"
          >
            <div
              className="flex gap-8 justify-between items-center cursor-pointer"
              onClick={() =>
                setFAQ((prev) =>
                  prev.map((inthere) => {
                    if (inthere.id === item.id) {
                      return { ...inthere, status: !inthere.status };
                    } else {
                      return inthere;
                    }
                  })
                )
              }
            >
              <h3 className="text-left">{item.question}</h3>
              <IoMdArrowDropdown
                className={`cursor-pointer text-3xl text-gray-600 hover:text-gray-800 transition-all ${
                  item.status ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <p
              className={`${
                item.status ? "inline" : "hidden"
              } text-left text-gray-600 w-[90%]`}
            >
              {item.answer}
            </p>
          </article>
        ))}
      </article>
      {/* testing */}
      <article className="w-full flex flex-col items-center md:w-[80%] lg:w-[70%] gap-4">
        <article className="flex justify-center items-center gap-4">
          <button
            className="py-2 px-4 rounded-md bg-primary text-white"
            onClick={tempUses}
          >
            Testing
          </button>
          <strong>
            Used {tempUser.used} : Remaining {tempUser.max - tempUser.used} :{" "}
            {`${limitExceeded}`}
          </strong>
        </article>
      </article>
    </section>
  );
}
