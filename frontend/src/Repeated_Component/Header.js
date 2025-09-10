import Nav from "../assets/Site_Details/Primary/nav";
import siteInfo from "../assets/Site_Details/Primary/siteInfo";
import { FaAngleDown } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export default function Header({ size }) {
  const [showConverter, setShowConverter] = useState(false);
  const [slidebar, setSlidebar] = useState(false);
  const converterArrowRef = useRef(null);
  useEffect(() => {
    if (showConverter) {
      converterArrowRef.current?.classList.add("rotate-180");
    } else {
      converterArrowRef.current?.classList.remove("rotate-180");
    }
  }, [showConverter]);
  return size.width > 950 ? (
    <header className="sticky top-0 bg-white flex flex-nowrap gap-4 py-2 px-4 items-center shadow-[0.1rem_0.1rem_0.2rem_0.1rem_gray] whitespace-nowrap z-10">
      <Link to={"/"} className="flex gap-2 items-center">
        <img
          src={siteInfo().logo}
          alt="site_logo"
          className="w-14 aspect-square"
        />
        <strong className="font-times text-2xl tracking-wider ">
          {siteInfo().site_name}
        </strong>
      </Link>
      <input
        type="search"
        name="search"
        id="search"
        className="p-2 rounded-2xl border-2 border-black grow"
        placeholder="Search Converters (e.g. PDF to DOCX)"
      />
      <article className="flex gap-4 items-center">
        {Nav()
          .slice(0, -2)
          .map((item, index) => (
            <div
              key={`navbar/firsthalf/item/${index}`}
              className="relative flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Link to={item.path}>{item.name}</Link>
                {item.submenu && (
                  <FaAngleDown
                    ref={converterArrowRef}
                    className="transition-all"
                    onMouseEnter={() => {
                      setShowConverter(!showConverter);
                    }}
                  />
                )}
              </div>
              {item.submenu && (
                <div
                  className={`absolute right-0 bg-white ${
                    showConverter ? "flex" : "hidden"
                  } flex-wrap items-center p-4 rounded-lg gap-4 w-[500px] mt-14 border-2 box-border shrink animate-[visibleIn_1s_ease] border-black whitespace-normal`}
                  onMouseLeave={() => setShowConverter(!showConverter)}
                >
                  {item.submenu.map((inthere, index) => (
                    <div
                      key={`navbar/firsthalf/item/${item.name}/sub/${index}`}
                      className="flex flex-col justify-between p-2 gap-2 items-center w-24 aspect-square text-center"
                    >
                      <inthere.icon className="text-4xl text-primary" />
                      <p>{inthere.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </article>
      <div className="min-h-full border-r-2 border-black">
        <p className="text-white">.</p>
      </div>
      <article className="flex gap-4 items-center">
        {Nav()
          .slice(-2)
          .map((item, index) => (
            <Link
              key={`navbar/secondhalf/item/${index}`}
              to={item.path}
              className="bg-primary px-4 py-2 rounded-md text-white"
            >
              {item.name}
            </Link>
          ))}
      </article>
    </header>
  ) : (
    <header className="sticky top-0 bg-white flex flex-nowrap gap-4 py-2 px-4 items-center shadow-[0.1rem_0.1rem_0.2rem_0.1rem_gray] whitespace-nowrap justify-between z-10">
      <Link to={"/"} className="flex gap-2 items-center">
        <img
          src={siteInfo().logo}
          alt="site_logo"
          className="w-14 aspect-square"
        />
        <strong className="font-times text-2xl tracking-wider ">
          {siteInfo().site_name}
        </strong>
      </Link>
      <article className="relative flex flex-col">
        {!slidebar ? (
          <HiOutlineMenuAlt3
            className="text-5xl font-extrabold cursor-pointer transition-all"
            onMouseEnter={() => setSlidebar(true)}
          />
        ) : (
          <RxCross2
            className="text-5xl text-red-600 cursor-pointer transition-all"
            onClick={() => setSlidebar(false)}
          />
        )}
        {slidebar && (
          <article
            className="fixed top-0 right-0 flex flex-col gap-8 mt-[72px] py-4 px-8 h-screen overflow-y-scroll noscrollbar bg-white z-10 shadow-[-0.2rem_0_0_0_#a0a0a0] transition-all animate-[fromRight_1s_ease]"
            onMouseLeave={() => {
              setSlidebar(false);
            }}
          >
            {Nav().map((item, index) => (
              <div
                key={`SlideMenuItem/item/${index}`}
                className="flex flex-col gap-4"
              >
                <div
                  key={`SlideMenuItem/${index}`}
                  className="flex gap-4 items-center"
                >
                  <item.icon className="text-2xl text-primary" />
                  <Link to={item.path} className="grow">
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <FaAngleDown
                      className="cursor-pointer"
                      ref={converterArrowRef}
                      onClick={() => {
                        setShowConverter(!showConverter);
                      }}
                    />
                  )}
                </div>
                {item.submenu && (
                  <article
                    className={`${
                      showConverter ? "flex" : "hidden"
                    } flex-col gap-4 ml-8`}
                  >
                    {item.submenu.map((inthere, index) => (
                      <Link
                        to={inthere.path}
                        key={`SlideMenuItem/item/${item.name}/sub/${index}`}
                        className="flex gap-2 items-center"
                      >
                        <inthere.icon className="text-xl text-primary" />
                        <p className="grow">{inthere.name}</p>
                      </Link>
                    ))}
                  </article>
                )}
              </div>
            ))}
          </article>
        )}
      </article>
    </header>
  );
}
