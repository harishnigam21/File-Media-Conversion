import { FiUpload } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import Process from "./assets/Site_Details/Secondary/process";
import Nav from "./assets/Site_Details/Primary/nav";
import siteInfo from "./assets/Site_Details/Primary/siteInfo";
import FAQ from "./assets/Site_Details/Secondary/faq";
import { useState } from "react";
export default function Home() {
  const category = Nav().filter((item) => item.name === "Converters")[0]
    .submenu;
  const [faq, setFAQ] = useState(FAQ());
  return (
    <section className="flex flex-col items-center gap-4 p-4 text-center py-12">
      <h1 className="text-4xl">Online File Converter</h1>
      <p className="text-gray-600 text-xl">Select File to convert</p>
      {/* upload section */}
      <article className="p-8 w-full md:w-[75%] lg:w-1/2 rounded-md bg-[#8e949b]">
        <article className="p-4 rounded-md flex flex-col items-center gap-4 bg-[#565f69]">
          <FiUpload className="text-5xl text-primary" />
          <p className="text-white">Drag your files here or upload</p>
          <div className="flex relative w-full text-[#8e949b] justify-center items-center">
            <p className="p-2 z-[1] bg-[#565f69]">OR</p>
            <p className="absolute border-t-2 w-1/2 border-black"></p>
          </div>
          <button className="py-2 px-4 rounded-md bg-primary text-white">
            Choose File
          </button>
          <p className="text-[#8e949b]">Up to 50MB</p>
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
              <article
                key={`category/index`}
                className="flex flex-col gap-2 items-center border-2 rounded-md shadow-[0.1rem_0.1rem_0.5rem_0.05rem_gray] p-4 grow"
              >
                <item.icon className="text-6xl text-gray-500" />
                <p className="">{item.name}</p>
              </article>
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
    </section>
  );
}
