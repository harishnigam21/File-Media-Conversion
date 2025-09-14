import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Plans from "../assets/Site_Details/Secondary/plan";
import { MdDelete } from "react-icons/md";
import { FaArrowAltCircleLeft } from "react-icons/fa";
export default function Plan() {
  const navigate = useNavigate();
  const [choosePlan, setChoosePlan] = useState({});
  return (
    <section className="w-screen min-h-screen p-2 xsm:p-8 flex flex-col gap-8">
      <p
        className="flex items-center gap-2 absolute"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowAltCircleLeft className="text-2xl cursor-pointer" />
        Go back
      </p>
      <h1 className="text-center font-georgia text-4xl">Choose your Plan</h1>

      {/* monthly */}
      <article className="flex flex-wrap gap-4">
        <h1 className="flex basis-full text-xl">Monthly Plan</h1>
        {Plans().monthly.map((item, index) => (
          <article
            key={`plan/monthly/${index}`}
            className="border-2 p-4 rounded-lg flex flex-col gap-2 grow shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between"
          >
            <div className="flex justify-between items-center text-xl">
              <strong>{item.name}</strong>
              <strong>₹{item.price}</strong>
            </div>
            <p className="break-words">{item.description.slice(0, 50)}...</p>
            <span className="flex gap-2">
              <strong>Max Conversion : </strong>
              <p>{item.maxConversions}</p>
            </span>
            <span className="flex gap-2">
              <strong>Max FileSize (MB) : </strong>
              <p>{item.maxFileSizeMB}</p>
            </span>
            <span className="flex gap-2">
              <strong>Batch Limit : </strong>
              <p>{item.batchLimit}</p>
            </span>
            <span className="flex gap-2">
              <strong>Support : </strong>
              <p>{item.support}</p>
            </span>
            <div className="flex flex-col gap-1">
              <strong>Formats : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.formats.map((item, index) => (
                  <li key={`plan/monthly/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.advantages.map((item, index) => (
                  <li key={`plan/monthly/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={() => setChoosePlan({ plan: "monthly", id: item.id })}
              >
                Buy
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={() => {
                    setChoosePlan({});
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </article>

      {/* yearly */}
      <article className="flex flex-wrap gap-4">
        <h1 className="flex basis-full text-xl">Yearly Plan</h1>
        {Plans().yearly.map((item, index) => (
          <article
            key={`plan/yearly/${index}`}
            className="border-2 p-4 rounded-lg flex flex-col gap-2 grow shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between"
          >
            <div className="flex justify-between items-center text-xl">
              <strong>{item.name}</strong>
              <strong>₹{item.price}</strong>
            </div>
            <p className="break-words">{item.description.slice(0, 50)}...</p>
            <span className="flex gap-2">
              <strong>Max Conversion : </strong>
              <p>{item.maxConversions}</p>
            </span>
            <span className="flex gap-2">
              <strong>Max FileSize (MB) : </strong>
              <p>{item.maxFileSizeMB}</p>
            </span>
            <span className="flex gap-2">
              <strong>Batch Limit : </strong>
              <p>{item.batchLimit}</p>
            </span>
            <span className="flex gap-2">
              <strong>Support : </strong>
              <p>{item.support}</p>
            </span>
            <div className="flex flex-col gap-1">
              <strong>Formats : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.formats.map((item, index) => (
                  <li key={`plan/yearly/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.advantages.map((item, index) => (
                  <li key={`plan/yearly/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={() => setChoosePlan({ plan: "yearly", id: item.id })}
              >
                Buy
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={() => {
                    setChoosePlan({});
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </article>

      {/* Unlimited */}
      <article className="flex flex-wrap gap-4">
        <h1 className="flex basis-full text-xl">Unlimited Plan</h1>
        {Plans().unlimited.map((item, index) => (
          <article
            key={`plan/unlimited/${index}`}
            className={`border-2 p-4 rounded-lg flex flex-col ${
              Plans().unlimited.length > 1 && "grow"
            } gap-2 shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between`}
          >
            <div className="flex justify-between items-center text-xl">
              <strong>{item.name}</strong>
              <strong>₹{item.price}</strong>
            </div>
            <p className="break-words">{`${
              Plans().unlimited.length > 1
                ? `${item.description.slice(0, 50)}...`
                : item.description
            }`}</p>
            <span className="flex gap-2">
              <strong>Max Conversion : </strong>
              <p>{item.maxConversions}</p>
            </span>
            <span className="flex gap-2">
              <strong>Max FileSize (MB) : </strong>
              <p>{item.maxFileSizeMB}</p>
            </span>
            <span className="flex gap-2">
              <strong>Batch Limit : </strong>
              <p>{item.batchLimit}</p>
            </span>
            <span className="flex gap-2">
              <strong>Support : </strong>
              <p>{item.support}</p>
            </span>
            <div className="flex flex-col gap-1">
              <strong>Formats : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.formats.map((item, index) => (
                  <li key={`plan/unlimited/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {item.advantages.map((item, index) => (
                  <li key={`plan/unlimited/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={() =>
                  setChoosePlan({ plan: "unlimited", id: item.id })
                }
              >
                Buy
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={() => {
                    setChoosePlan({});
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </article>
    </section>
  );
}
