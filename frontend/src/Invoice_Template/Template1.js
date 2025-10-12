import { useEffect, useState } from "react";
import siteInfo from "../assets/Site_Details/Primary/siteInfo";
import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaHome } from "react-icons/fa";
export default function Template1() {
  const location = useLocation(); 
  const params = useParams();
  const navigate = useNavigate();
  const [taxRate, setTaxRate] = useState(0);
  const [validTill, setValidTill] = useState(30);
  const [userInfo, setUserInfo] = useState(
    location.state
      ? location.state.user
      : {
          name: "",
          company_name: "",
          address: {
            street: "",
            city: "",
            state: "",
            pin: "",
            mobile_no: [],
          },
          item_purchased: [
            {
              id: 1,
              name: "lorem",
              description:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit ad molestias illo error cum, officiis quidem deserunt saepe nulla et laudantium fugit quaerat fuga adipisci possimus ducimus deleniti sit maxime.",
              quantity: 1,
              price: 0,
            },
          ],
          paid: 0,
        }
  );
  const [showForm, setShowForm] = useState(location.state.user ? false : true);
  const itemTotal = () => {
    return userInfo.item_purchased.reduce((acc, curr) => {
      acc += curr.price * curr.quantity;
      return acc;
    }, 0);
  };
  const getDate = (daysToAdd = 0) => {
    const now = new Date();
    const futureDate = addDays(now, daysToAdd);
    const timeZone = "Asia/Kolkata";

    return formatInTimeZone(futureDate, timeZone, "dd/MM/yyyy");
  };
  const deleteProduct = (id) => {
    setUserInfo((props) => ({
      ...props,
      item_purchased: props.item_purchased.filter(
        (item) => parseInt(item.id) !== parseInt(id)
      ),
    }));
  };
  const addProduct = () => {
    setUserInfo((props) => ({
      ...props,
      item_purchased: [
        ...props.item_purchased,
        {
          id:
            props.item_purchased.length > 0
              ? Math.max(
                  ...userInfo.item_purchased.map((item) => parseInt(item.id))
                ) + 1
              : 1,
          name: "",
          description: "",
          quantity: 1,
          price: 0,
        },
      ],
    }));
  };
  useEffect(() => {
    if (location.state.user) {
      setValidTill(location.state.user.expires);
    }
  }, []);
  return showForm ? (
    <section className="flex flex-col w-screen h-full p-4 gap-4">
      {/* bill to */}
      <h1 className="text-center text-blue-600 text-4xl font-georgia">
        Billing
      </h1>
      <article className="flex gap-4 flex-wrap w-full md:w-[768px] md:self-center">
        {/* customer name, mobile no and its company name */}
        <article className="flex flex-nowrap gap-4 w-full">
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="name"
              id="nameLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Name
            </label>
            <input
              defaultValue={userInfo.name}
              type="text"
              name="name"
              id="name"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              placeholder="John Doe"
              aria-required
              onChange={(e) => {
                setUserInfo((props) => ({ ...props, name: e.target.value }));
              }}
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="cname"
              id="cnameLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Company Name
            </label>
            <input
              defaultValue={userInfo.company_name}
              type="text"
              name="cname"
              id="cname"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              placeholder="XYZ"
              aria-required
              onChange={(e) => {
                setUserInfo((props) => ({
                  ...props,
                  company_name: e.target.value,
                }));
              }}
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="mobile"
              id="mobileLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Mobile No
            </label>
            <input
              defaultValue={userInfo.address.mobile_no}
              type="tel"
              name="mobile"
              id="mobile"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              placeholder="7894561230"
              aria-required
              onChange={(e) => {
                setUserInfo((props) => ({
                  ...props,
                  address: {
                    ...props.address,
                    mobile_no: [e.target.value],
                  },
                }));
              }}
            />
          </article>
        </article>
        {/* address */}
        <article className="flex gap-3 basis-full">
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="addressstreet"
              id="addressstreetLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Street
            </label>
            <input
              defaultValue={userInfo.address.street}
              type="text"
              name="addressstreet"
              id="addressstreet"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              aria-required
              onChange={(e) =>
                setUserInfo((props) => ({
                  ...props,
                  address: { ...props.address, street: e.target.value },
                }))
              }
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="addresscity"
              id="addresscityLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              City
            </label>
            <input
              defaultValue={userInfo.address.city}
              type="text"
              name="addresscity"
              id="addresscity"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              aria-required
              onChange={(e) =>
                setUserInfo((props) => ({
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
              defaultValue={userInfo.address.state}
              type="text"
              name="addressstate"
              id="addressstate"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              aria-required
              onChange={(e) =>
                setUserInfo((props) => ({
                  ...props,
                  address: { ...props.address, state: e.target.value },
                }))
              }
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="addresspin"
              id="addresspinLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Pin
            </label>
            <input
              defaultValue={userInfo.address.pin}
              type="number"
              name="addresspin"
              id="addresspin"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              aria-required
              onChange={(e) =>
                setUserInfo((props) => ({
                  ...props,
                  address: { ...props.address, pin: e.target.value },
                }))
              }
            />
          </article>
        </article>

        {/* item purchased */}
        <article className="w-full flex flex-col gap-2">
          <h2 className="font-georgia text-2xl w-full">Products</h2>
          {userInfo.item_purchased.length > 0 ? (
            userInfo.item_purchased.map((item, index) => (
              <article
                key={`product/${index}`}
                className="flex flex-nowrap gap-4 items-center text-center"
              >
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                  <label
                    htmlFor="pname"
                    id="pnameLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Name
                  </label>
                  <input
                    defaultValue={item.name}
                    type="text"
                    name="pname"
                    id="pname"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                    placeholder="abcd"
                    aria-required
                    onChange={(e) => {
                      setUserInfo((props) => ({
                        ...props,
                        item_purchased: props.item_purchased.map((inthere) => {
                          if (inthere.id === item.id) {
                            return { ...inthere, name: e.target.value };
                          }
                          return inthere;
                        }),
                      }));
                    }}
                  />
                </article>
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                  <label
                    htmlFor="pdiscription"
                    id="pdiscriptionLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Description
                  </label>
                  <input
                    defaultValue={item.description}
                    type="text"
                    name="pdiscription"
                    id="pdiscription"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                    placeholder="abcd"
                    aria-required
                    onChange={(e) => {
                      setUserInfo((props) => ({
                        ...props,
                        item_purchased: props.item_purchased.map((inthere) => {
                          if (inthere.id === item.id) {
                            return { ...inthere, description: e.target.value };
                          }
                          return inthere;
                        }),
                      }));
                    }}
                  />
                </article>
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                  <label
                    htmlFor="pquantity"
                    id="pquantityLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Quantity
                  </label>
                  <input
                    defaultValue={item.quantity}
                    type="number"
                    name="pquantity"
                    id="pquantity"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                    placeholder="1"
                    min={1}
                    aria-required
                    onChange={(e) => {
                      setUserInfo((props) => ({
                        ...props,
                        item_purchased: props.item_purchased.map((inthere) => {
                          if (inthere.id === item.id) {
                            return { ...inthere, quantity: e.target.value };
                          }
                          return inthere;
                        }),
                      }));
                    }}
                  />
                </article>
                <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
                  <label
                    htmlFor="pprice"
                    id="ppriceLabel"
                    className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
                  >
                    Price
                  </label>
                  <input
                    defaultValue={item.price}
                    type="number"
                    name="pprice"
                    id="pprice"
                    className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                    placeholder="0"
                    min={1}
                    aria-required
                    onChange={(e) => {
                      setUserInfo((props) => ({
                        ...props,
                        item_purchased: props.item_purchased.map((inthere) => {
                          if (inthere.id === item.id) {
                            return { ...inthere, price: e.target.value };
                          }
                          return inthere;
                        }),
                      }));
                    }}
                  />
                </article>
                <div className="flex items-center">
                  <MdDelete
                    className="text-2xl mt-2 text-red-500 cursor-pointer"
                    onClick={() => deleteProduct(item.id)}
                  />
                </div>
              </article>
            ))
          ) : (
            <p className="text-red-600">No product added yet</p>
          )}
          <button
            className="self-start px-4 py-1 border-[1px] border-black rounded-md hover:shadow-[0.1rem_0.1rem_1rem_0.1rem_green_inset]"
            onClick={() => addProduct()}
          >
            Add
          </button>
        </article>

        {/* other info */}
        <article className="flex gap-4">
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="paid"
              id="paidLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Amount Paid
            </label>
            <input
              defaultValue={userInfo.paid}
              type="number"
              name="paid"
              id="paid"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              placeholder="0"
              aria-required
              onChange={(e) => {
                setUserInfo((props) => ({ ...props, paid: e.target.value }));
              }}
            />
          </article>
          <article className="whitespace-nowrap flex flex-col items-center w-full sm:w-3/4">
            <label
              htmlFor="expires"
              id="expiresLabel"
              className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
            >
              Bill Expires In
            </label>
            <input
              defaultValue={validTill}
              type="number"
              name="expires"
              id="expires"
              className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
              placeholder="in days"
              onChange={(e) => setValidTill(parseInt(e.target.value))}
              aria-required
            />
          </article>
        </article>
      </article>
      <button
        className="p-2 rounded-md bg-blue-600 text-white font-black self-center"
        onClick={() => setShowForm(false)}
      >
        Generate Invoice
      </button>
    </section>
  ) : (
    <section className="flex flex-col w-screen h-full p-4 overflow-x-scroll">
      <FaHome
        className="text-3xl self-center hover:text-primary cursor-pointer"
        onClick={() => navigate(`/${params.email}/home`)}
      />
      <article
        id="invoice-section"
        className="flex flex-col w-[720px] h-full gap-12 md:self-center"
      >
        <article className="flex justify-between gap-8 flex-nowrap">
          <article className="flex flex-col gap-2">
            <h1 className="text-2xl grow">
              {siteInfo().companyInfo.company_name}
            </h1>
            <p>{siteInfo().companyInfo.company_address.street}</p>
            <p>
              {siteInfo().companyInfo.company_address.city},{" "}
              {siteInfo().companyInfo.company_address.state},{" "}
              {siteInfo().companyInfo.company_address.pin}
            </p>
            <span>
              <strong>Fax : </strong>
              {siteInfo().companyInfo.company_phone_no.map((no, index) => (
                <span key={`sender/mobile/${index}`}>{no}, </span>
              ))}
            </span>
            <span>
              <strong>Website : </strong>
              {siteInfo().companyInfo.site_domain}
            </span>
          </article>
          <article className="flex flex-col gap-2">
            <h1 className="text-blue-400 text-3xl text-right grow">INVOICE</h1>
            <article className="grid grid-cols-[max-content_1fr] border-collapse">
              <p className="text-right px-4">DATE</p>
              <p className="border-[1px] text-center px-4 border-black">
                {getDate(0)}
              </p>

              <p className="text-right px-4">INVOICE #</p>
              <p className="border-[1px] text-center px-4 border-black">
                {location.state.user ? location.state.user.invoice : uuidv4()}
              </p>

              <p className="text-right px-4">CUSTOMER ID</p>
              <p className="border-[1px] text-center px-4 border-black">
                harishnigam21@gmail.com
              </p>

              <p className="text-right px-4">DUE DATE</p>
              <p className="border-[1px] text-center px-4 border-black">
                {getDate(validTill)}
              </p>
            </article>
          </article>
        </article>
        <article className="flex justify-between gap-8 flex-nowrap">
          <article className="flex flex-col gap-2 w-1/2">
            <h2 className="text-white bg-blue-600">BILL TO</h2>
            <p>{userInfo.name}</p>
            <p>{userInfo.company_name}</p>
            <p>{userInfo.address.street}</p>
            <p>
              {userInfo.address.city}, {userInfo.address.state},{" "}
              {userInfo.address.pin}
            </p>
            <p>
              {userInfo.address.mobile_no.map((no, index) => (
                <span key={`receiver/mobile/${index}`} className="">
                  {no},{" "}
                </span>
              ))}
            </p>
          </article>
          <article className="flex flex-col gap-2"></article>
        </article>
        <article className="flex justify-between w-full">
          <table className="w-full border-collapse border-2 border-black">
            <thead className="border-2 border-black">
              <tr className="text-center bg-blue-600">
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>QUNATITY</th>
                <th>PRICE</th>
              </tr>
            </thead>
            <tbody>
              {userInfo.item_purchased.map((item, index) => (
                <tr key={`table/product/${index}`}>
                  <td className="border-r-2 border-black">{item.name}</td>
                  <td className="border-r-2 border-black">
                    {item.description}
                  </td>
                  <td className="border-r-2 border-black">{item.quantity}</td>
                  <td className="border-r-2 border-black">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="flex justify-between w-full">
          <article className="flex flex-col w-1/2"></article>
          <article className="flex flex-col">
            <article className="grid grid-cols-[max-content_1fr] border-collapse">
              <p className="text-left px-4">Total</p>
              <p className="text-right px-4">₹ {itemTotal()}</p>

              <p className="text-left px-4">Tax Rate</p>
              <p className="text-right px-4">{taxRate}%</p>

              <p className="text-left px-4">Taxable</p>
              <p className="text-right px-4">
                ₹ {(itemTotal() * (taxRate / 100)).toFixed(2)}
              </p>

              <p className="text-left px-4">Sub Total</p>
              <p className="text-right px-4">
                ₹{" "}
                {parseInt(itemTotal()) +
                  parseFloat((itemTotal() * (taxRate / 100)).toFixed(2))}
              </p>

              <p className="text-left px-4">Paid</p>
              <p className="text-right px-4">₹ {userInfo.paid}</p>

              <p className="text-left px-4">Remaining</p>
              <p className="text-right px-4">
                ₹{" "}
                {(
                  parseInt(itemTotal()) +
                  parseFloat(itemTotal() * (taxRate / 100)) -
                  parseInt(userInfo.paid)
                ).toFixed(2)}
              </p>
            </article>
          </article>
        </article>
      </article>
      {!location.state.user && (
        <ImCross
          className="absolute top-2 right-10 text-red-500 text-2xl cursor-pointer"
          onClick={() => setShowForm(true)}
        />
      )}
      <button
        className="px-6 py-2 rounded-md bg-primary text-white self-center"
        onClick={() => {
          window.print();
        }}
      >
        Download Invoice
      </button>
    </section>
  );
}
