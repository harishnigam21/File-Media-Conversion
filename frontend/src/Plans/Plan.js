import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Plans from "../assets/Site_Details/Secondary/plan";
import { MdDelete } from "react-icons/md";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import siteInfo from "../assets/Site_Details/Primary/siteInfo";
export default function Plan() {
  const navigate = useNavigate();
  const plans = Plans();
  const [choosePlan, setChoosePlan] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [Address, setAddress] = useState([
    {
      street: "64, Rajawat Building, new Dewas Road",
      city: "Indore",
      state: "Madhya Pradesh",
      pin: "452003",
    },
    {
      street: "89AB, RK Complex, near hanuman mandir",
      city: "Munirka, New Delhi",
      state: "Delhi",
      pin: "110067",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState({
    status: false,
    address: null,
  });
  const errorRef = useRef(null);
  const handlePurchase = async (e) => {
    e.currentTarget?.childNodes[1].classList.remove("hidden");
    try {
      //get key
      const getKeyUrl = `${process.env.REACT_APP_BACKEND_HOST}/getKey`;
      const KeyResponse = await fetch(getKeyUrl, {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      const KeyData = await KeyResponse.json();
      if (!KeyResponse.ok) {
        e.currentTarget?.childNodes[1].classList.add("hidden");
        console.log(KeyData);
        errorRef.current.style.color = "red";
        errorRef.current.textContent = KeyData.message;
        return;
      }
      console.log(KeyData.message);
      errorRef.current.style.color = "green";
      errorRef.current.textContent = KeyData.message;

      //get Plan details
      const getPlanDetailsUrl = `${process.env.REACT_APP_BACKEND_HOST}/get_unique_plan`;
      const PlanDetailsResponse = await fetch(getPlanDetailsUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: choosePlan.id }),
        credentials: "include",
      });
      const PlanDetailsData = await PlanDetailsResponse.json();
      if (!PlanDetailsResponse.ok) {
        e.currentTarget?.childNodes[1].classList.add("hidden");
        console.log(PlanDetailsData);
        errorRef.current.style.color = "red";
        errorRef.current.textContent = PlanDetailsData.message;
        return;
      }
      console.log(PlanDetailsData.message);
      errorRef.current.style.color = "green";
      errorRef.current.textContent = PlanDetailsData.message;

      //create Order
      const createOrderUrl = `${process.env.REACT_APP_BACKEND_HOST}/createOrder`;
      const createOrderResponse = await fetch(createOrderUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: PlanDetailsData.plans.price }),
        credentials: "include",
      });
      const createOrderData = await createOrderResponse.json();
      if (!createOrderResponse.ok) {
        e.currentTarget?.childNodes[1].classList.add("hidden");
        console.log(createOrderData.message);
        errorRef.current.style.color = "red";
        errorRef.current.textContent = createOrderData.message;
        return;
      }

      console.log(createOrderData.message);
      errorRef.current.style.color = "green";
      errorRef.current.textContent = createOrderData.message;

      //make payment
      const options = {
        key: KeyData.key,
        amount: parseInt(PlanDetailsData.plans.price) * 100,
        currency: "INR",
        name: "FileFlip",
        description: "Test Transaction",
        image: siteInfo().logo,
        order_id: createOrderData.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${process.env.REACT_APP_BACKEND_HOST}/verify_payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...response,
                  plan_id: PlanDetailsData.plans.id,
                  amount_in_paise_to_refund:
                    parseInt(PlanDetailsData.plans.price) * 100,
                }),
                credentials: "include",
              }
            );
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              e.currentTarget?.childNodes[1].classList.add("hidden");
              console.log(verifyData.message);
              errorRef.current.style.color = "red";
              errorRef.current.textContent = verifyData.message;
              setShowCart(false);
              alert(verifyData.message);
              return;
            }
            e.currentTarget?.childNodes[1].classList.add("hidden");
            console.log(verifyData.message);
            window.localStorage.setItem(
              "tempUser",
              JSON.stringify(verifyData.data)
            );
            errorRef.current.style.color = "green";
            errorRef.current.textContent = verifyData.message;
            setChoosePlan({});
            setTimeout(() => {
              setShowCart(false);
              navigate("templates/template1", {
                state: {
                  user: {
                    name: KeyData.user.name,
                    company_name: "",
                    address: {
                      ...selectedAddress.address,
                      mobile_no: KeyData.user.contact,
                    },
                    item_purchased: [
                      {
                        id: 1,
                        name: PlanDetailsData.plans.name,
                        description: `${PlanDetailsData.plans.name} : ${PlanDetailsData.plans.description}`,
                        quantity: 1,
                        price: PlanDetailsData.plans.price,
                      },
                    ],
                    paid: PlanDetailsData.plans.price,
                    invoice: response.razorpay_payment_id.slice(4),
                    expires: PlanDetailsData.plans.name
                      .toLowerCase()
                      .includes("month")
                      ? 30
                      : PlanDetailsData.plans.name
                          .toLowerCase()
                          .includes("year")
                      ? 365
                      : PlanDetailsData.plans.name
                          .toLowerCase()
                          .includes("unlimited")
                      ? 365 * 10
                      : 0,
                  },
                },
              });
            }, 2000);
          } catch (error) {
            e.currentTarget?.childNodes[1].classList.add("hidden");
            console.log(error.message);
            errorRef.current.style.color = "red";
            errorRef.current.textContent = error.message;
            setShowCart(false);
            alert(error.message);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay window closed by user.");
            errorRef.current.style.color = "red";
            errorRef.current.textContent =
              "recent payment was canceled. Please try again to complete your purchase.";
            setShowCart(false);
          },
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        prefill: {
          name: KeyData.user.name, // Optional: Prefill user name
          email: KeyData.user.email, // Optional: Prefill user email
          contact: KeyData.user.contact[0], // **Mandatory for prefilling mobile number**
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      e.currentTarget?.childNodes[1].classList.add("hidden");
      console.log(error);
      errorRef.current.style.color = "red";
      errorRef.current.textContent = error.message;
    }
  };
  return !plans ? (
    <h1 className="text-center text-red-500 text-3xl font-georgia">
      Text it later
    </h1>
  ) : (
    <section className="w-screen h-screen overflow-scroll noscrollbar p-2 xsm:p-8 flex flex-col gap-8">
      <p
        className="flex items-center gap-2"
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowAltCircleLeft className="text-2xl cursor-pointer" />
        Go back
      </p>
      <h1 className="text-center font-georgia text-4xl">Choose your Plan</h1>
      {/* trial */}
      {plans.trial && (
        <article className="flex flex-wrap gap-4">
          <h1 className="flex basis-full text-xl">Trial Plan</h1>
          {plans.trial.map((item, index) => (
            <article
              key={`plan/trial/${index}`}
              className="border-2 py-4 px-12 rounded-lg flex flex-col gap-2 shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between md:w-[45%] lg:w-[30%]"
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
                  {JSON.parse(item.formats).map((item, index) => (
                    <li key={`plan/trial/formats/${index}`}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-col gap-1">
                <strong>Advantages : </strong>
                <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                  {JSON.parse(item.advantages).map((item, index) => (
                    <li key={`plan/trial/advantages/${index}`}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
                <button
                  disabled={choosePlan.id ? true : false}
                  className="px-8 py-2 bg-primary rounded-md text-white"
                  onClick={(e) => {
                    e.target.textContent = "Selected";
                    setChoosePlan(item);
                  }}
                >
                  Select
                </button>
                {choosePlan.id === item.id && (
                  <MdDelete
                    className="text-2xl text-red-600 cursor-pointer"
                    onClick={(e) => {
                      e.currentTarget.parentElement.childNodes[0].textContent =
                        "Select";
                      setChoosePlan({});
                    }}
                  />
                )}
              </div>
            </article>
          ))}
        </article>
      )}
      {/* monthly */}
      <article className="flex flex-wrap gap-4">
        <h1 className="flex basis-full text-xl">Monthly Plan</h1>
        {plans.monthly.map((item, index) => (
          <article
            key={`plan/monthly/${index}`}
            className="border-2 p-4 rounded-lg flex flex-col gap-2 grow shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between md:w-[45%] lg:w-[30%]"
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
                {JSON.parse(item.formats).map((item, index) => (
                  <li key={`plan/monthly/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {JSON.parse(item.advantages).map((item, index) => (
                  <li key={`plan/monthly/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={(e) => {
                  e.target.textContent = "Selected";
                  setChoosePlan(item);
                }}
              >
                Select
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.currentTarget.parentElement.childNodes[0].textContent =
                      "Select";
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
        {plans.yearly.map((item, index) => (
          <article
            key={`plan/yearly/${index}`}
            className="border-2 p-4 rounded-lg flex flex-col gap-2 grow shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between md:w-[45%] lg:w-[30%]"
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
                {JSON.parse(item.formats).map((item, index) => (
                  <li key={`plan/yearly/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {JSON.parse(item.advantages).map((item, index) => (
                  <li key={`plan/yearly/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={(e) => {
                  e.target.textContent = "Selected";
                  setChoosePlan(item);
                }}
              >
                Select
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.currentTarget.parentElement.childNodes[0].textContent =
                      "Select";
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
        {plans.unlimited.map((item, index) => (
          <article
            key={`plan/unlimited/${index}`}
            className={`border-2 p-4 rounded-lg flex flex-col ${
              plans.unlimited.length > 1 && "grow"
            } gap-2 shadow-[0.1rem_0.1rem_1rem_0.1rem_gray_inset] justify-between md:w-[45%] lg:w-[30%]`}
          >
            <div className="flex justify-between items-center text-xl">
              <strong>{item.name}</strong>
              <strong>₹{item.price}</strong>
            </div>
            <p className="break-words">{`${
              plans.unlimited.length > 1
                ? `${item.description.slice(0, 50)}...`
                : item.description
            }`}</p>
            <span className="flex gap-2">
              <strong>Max Conversion : </strong>
              <p>{item.maxConversions === 0 ? "unlimited" : "..."}</p>
            </span>
            <span className="flex gap-2">
              <strong>Max FileSize (MB) : </strong>
              <p>{item.maxFileSizeMB === 0 ? "unlimited" : "..."}</p>
            </span>
            <span className="flex gap-2">
              <strong>Batch Limit : </strong>
              <p>{item.batchLimit === 0 ? "unlimited" : "..."}</p>
            </span>
            <span className="flex gap-2">
              <strong>Support : </strong>
              <p>{item.support}</p>
            </span>
            <div className="flex flex-col gap-1">
              <strong>Formats : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {JSON.parse(item.formats).map((item, index) => (
                  <li key={`plan/unlimited/formats/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Advantages : </strong>
              <ol className="flex flex-col gap-2 pl-4 list-disc list-inside">
                {JSON.parse(item.advantages).map((item, index) => (
                  <li key={`plan/unlimited/advantages/${index}`}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-nowrap gap-2 self-center justify-center items-center mt-4">
              <button
                disabled={choosePlan.id ? true : false}
                className="px-8 py-2 bg-primary rounded-md text-white"
                onClick={(e) => {
                  e.target.textContent = "Selected";
                  setChoosePlan(item);
                }}
              >
                Select
              </button>
              {choosePlan.id === item.id && (
                <MdDelete
                  className="text-2xl text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.currentTarget.parentElement.childNodes[0].textContent =
                      "Select";
                    setChoosePlan({});
                  }}
                />
              )}
            </div>
          </article>
        ))}
      </article>

      {/* type of add to cart */}
      {showCart && (
        <article className="absolute top-0 right-0 z-10 w-[75%] md:w-1/3 lg:w-1/4 h-screen bg-white p-4 flex flex-col gap-4 shadow-[0_0.1rem_0.8rem_0.1rem_black]">
          {/* address details */}
          <article className="flex flex-col gap-4">
            <h1>Billing Address :-</h1>
            {Address.length > 0 ? (
              <article className="flex flex-col gap-4">
                {Address.map((item, index) => (
                  <article key={`address/${index}`} className="flex gap-4">
                    <input
                      type="radio"
                      name="address"
                      id={`address/${index}`}
                      onChange={() =>
                        setSelectedAddress(() => ({
                          status: false,
                          address: item,
                        }))
                      }
                    />
                    <label htmlFor={`address/${index}`}>
                      {item.street +
                        " ," +
                        item.city +
                        " ," +
                        item.state +
                        " ," +
                        item.pin}
                    </label>
                  </article>
                ))}
              </article>
            ) : (
              <strong className="text-red text-center">No Address Found</strong>
            )}
            <span
              className="flex gap-2 items-center text-blue-500 cursor-pointer"
              onClick={() => {
                if (document.querySelectorAll('input[type="radio"]')[0]) {
                  document.querySelectorAll(
                    'input[type="radio"]'
                  )[0].checked = false;
                }
                setSelectedAddress(() => ({
                  status: true,
                  address: { street: null, city: null, state: null, pin: null },
                }));
              }}
            >
              <IoMdAdd />
              Add new Address
            </span>
            {selectedAddress.status && (
              <article className="flex flex-col">
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4 self-center">
                  <label
                    defaultValue={selectedAddress.street}
                    htmlFor="addressstreet"
                    id="addressstreetLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Street/Building No.
                  </label>
                  <input
                    defaultValue={selectedAddress.address.street}
                    type="text"
                    name="addressstreet"
                    id="addressstreet"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full flex grow"
                    aria-required
                    onChange={(e) =>
                      setSelectedAddress((props) => ({
                        ...props,
                        address: { ...props.address, street: e.target.value },
                      }))
                    }
                  />
                </article>
                <article className="flex gap-2">
                  <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                    <label
                      htmlFor="addresscity"
                      id="addresscityLabel"
                      className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                    >
                      City/District
                    </label>
                    <input
                      defaultValue={selectedAddress.address.city}
                      type="text"
                      name="addresscity"
                      id="addresscity"
                      className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                      aria-required
                      onChange={(e) =>
                        setSelectedAddress((props) => ({
                          ...props,
                          address: { ...props.address, city: e.target.value },
                        }))
                      }
                    />
                  </article>
                  <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                    <label
                      htmlFor="addressstate"
                      id="addressstateLabel"
                      className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                    >
                      State
                    </label>
                    <input
                      defaultValue={selectedAddress.state}
                      type="text"
                      name="addressstate"
                      id="addressstate"
                      className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                      aria-required
                      onChange={(e) =>
                        setSelectedAddress((props) => ({
                          ...props,
                          address: { ...props.address, state: e.target.value },
                        }))
                      }
                    />
                  </article>
                </article>
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4 self-center">
                  <label
                    htmlFor="addresspin"
                    id="addresspinLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Pin
                  </label>
                  <input
                    defaultValue={selectedAddress.pin}
                    type="number"
                    name="addresspin"
                    id="addresspin"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                    aria-required
                    onChange={(e) =>
                      setSelectedAddress((props) => ({
                        ...props,
                        address: { ...props.address, pin: e.target.value },
                      }))
                    }
                  />
                </article>
              </article>
            )}
          </article>

          {/* plan details */}
          <article className="flex flex-col">
            <h1>Plan Overview :-</h1>
            <article className="flex flex-col h-full">
              <ImCross
                className="absolute top-2 right-2 text-red-500 text-2xl cursor-pointer"
                onClick={() => setShowCart(false)}
              />
              <p>Plan Name : {choosePlan.name}</p>
              <p>
                Max Conversion :{" "}
                {choosePlan.maxConversions === 0
                  ? "unlimited"
                  : choosePlan.maxConversions}
              </p>
              <p>
                Max File Size (MB) :{" "}
                {choosePlan.maxFileSizeMB === 0
                  ? "unlimited"
                  : choosePlan.maxFileSizeMB}
              </p>
              <p>
                Batch Limit :{" "}
                {choosePlan.batchLimit === 0
                  ? "unlimited"
                  : choosePlan.batchLimit}
              </p>
              <div className="absolute bottom-0 self-center p-2">
                <button
                  disabled={
                    !(
                      selectedAddress.address?.street &&
                      selectedAddress.address?.city &&
                      selectedAddress.address?.state &&
                      selectedAddress.address?.pin
                    )
                  }
                  className="px-8 py-2 rounded-md bg-blue-600 text-white flex gap-2"
                  onClick={(e) => handlePurchase(e)}
                >
                  <p>Buy Now</p>
                  <p className="hidden w-5 h-5 self-center aspect-square rounded-full border-4 border-l-violet-500 border-r-green-500 border-b-orange-600 border-t-red-500 animate-[spin_0.3s_linear_infinite]"></p>
                </button>
                <p className="text-red-500" ref={errorRef}></p>
              </div>
            </article>
          </article>
        </article>
      )}
      {choosePlan.id && (
        <article className="absolute bottom-0 right-0 z-[2]">
          <div
            className="px-8 py-2 bg-blue-600 rounded-l-md text-white flex gap-4 cursor-pointer"
            onClick={() => setShowCart(true)}
          >
            Proceed
            <span className="animate-[fromLeft_1s_infinite_ease]">{">>>"}</span>
          </div>
        </article>
      )}
    </section>
  );
}
