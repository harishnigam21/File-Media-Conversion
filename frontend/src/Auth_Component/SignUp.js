import siteInfo from "../assets/Site_Details/Primary/siteInfo";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const [userCredentials, setUserCredentials] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    mobile_no: "",
    email: "",
    password: "",
  });
  const [cnfPassword, setCNFPassword] = useState("");
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const checkNames = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    if (!name) {
      return "Required Name.";
    }
    if (!nameRegex.test(name)) {
      return "Invalid Name Format (hint:remove space if there any)";
    }
  };
  const checkMobNo = (number) => {
    const mobRegex = /^\d{10}$/;
    if (!number) {
      return "Mobile Number is required.";
    }
    if (!mobRegex.test(number)) {
      return "Invalid Mobile Number.";
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required.";
    }
    if (!emailRegex.test(email)) {
      return "Invalid email format.";
    }
  };

  const validatePassword = (password) => {
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const digit = /\d/;
    const specialChar = /[@$!%*?&]/;
    const noSpace = /^\S+$/;
    if (!password) {
      return "Password is required.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!lowercase.test(password)) {
      return "Password must include at least one lowercase letter.";
    }
    if (!uppercase.test(password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!digit.test(password)) {
      return "Password must include at least one number.";
    }
    if (!specialChar.test(password)) {
      return "Password must include at least one special character (@$!%*?&).";
    }
    if (!noSpace.test(password)) {
      return "Password must not contain spaces.";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    form.children[1].classList.remove("hidden");

    const verifyUser = async () => {
      form.children[1].classList.remove("hidden");
      try {
        const url = `${process.env.REACT_APP_BACKEND_HOST}/signup`;
        const response = await fetch(url, {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify(userCredentials),
        });
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 409) {
            setTimeout(() => {
              navigate("/signin", { replace: true });
            }, 2000);
          }
          errorRef.current.textContent = data.message;
          form.children[1].classList.add("hidden");
          return;
        }
        errorRef.current.style.color = "green";
        errorRef.current.textContent = data.message;
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 2000);
      } catch (error) {
        console.log(error.message);
        errorRef.current.textContent = error.message;
        form.children[1].classList.add("hidden");
      }
    };

    setTimeout(() => {
      errorRef.current.textContent = checkNames(userCredentials.first_name)
        ? checkNames(userCredentials.first_name)
        : checkNames(userCredentials.last_name)
        ? checkNames(userCredentials.last_name)
        : checkMobNo(userCredentials.mobile_no)
        ? checkMobNo(userCredentials.mobile_no)
        : validateEmail(userCredentials.email)
        ? validateEmail(userCredentials.email)
        : validatePassword(userCredentials.password)
        ? validatePassword(userCredentials.password)
        : !userCredentials.gender
        ? "Please select your gender"
        : userCredentials.password === cnfPassword
        ? null
        : "Your confirm password doesn't match with original one";
      !checkNames(userCredentials.first_name) &&
        !checkNames(userCredentials.last_name) &&
        !checkMobNo(userCredentials.mobile_no) &&
        !validateEmail(userCredentials.email) &&
        !validatePassword(userCredentials.password) &&
        userCredentials.gender &&
        userCredentials.password === cnfPassword &&
        verifyUser();
      form.children[1].classList.add("hidden");
    }, 1000);
  };
  return (
    <section className="w-screen h-screen box-border flex flex-col xsm:justify-center items-center p-8 overflow-y-scroll">
      <Link to={"/"}>
        <img
          src={siteInfo().logo}
          alt="home"
          title="back to home"
          className="aspect-square w-16 m-4"
        />
      </Link>
      <article className="w-full md:w-[75%] lg:w-[50%] flex flex-col gap-4">
        <h1 className="text-3xl font-times text-center">
          Welcome to {siteInfo().site_name}
        </h1>
        <p className="text-secondary1 tracking-wider text-center">
          Sign Up to your {siteInfo().site_name} account
        </p>
        <form
          action=""
          className="w-full flex flex-col items-center flex-nowrap gap-4"
        >
          {/* name section */}
          <article className="whitespace-nowrap w-full flex flex-col items-center xsm:flex-row xsm:flex-nowrap xsm:justify-between xsm:items-center gap-4">
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="first_name"
                id="first_name_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                First Name
              </label>
              <input
                type="first_name"
                name="first_name"
                id="first_name"
                value={userCredentials.first_name}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                placeholder="Harish"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    first_name: e.target.value,
                  }))
                }
              />
            </article>
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="middle_name"
                id="middle_name_Label"
                className="bg-white ml-4 z-[2] w-fit self-start"
              >
                Middle Name
              </label>
              <input
                type="middle_name"
                name="middle_name"
                id="middle_name"
                value={userCredentials.middle_name}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    middle_name: e.target.value,
                  }))
                }
              />
            </article>
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="last_name"
                id="last_name_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Last Name
              </label>
              <input
                type="last_name"
                name="last_name"
                id="last_name"
                value={userCredentials.last_name}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                placeholder="Nigam"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    last_name: e.target.value,
                  }))
                }
              />
            </article>
          </article>
          {/* gender & mobile number */}
          <article className="whitespace-nowrap w-full flex flex-col items-center xsm:flex-row xsm:flex-nowrap xsm:justify-between xsm:items-center gap-4">
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="gender"
                id="gender_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={userCredentials.gender}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    gender: e.target.value,
                  }))
                }
                aria-required
              >
                <option value="other">Other</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </article>
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="mobile_no"
                id="mobile_no_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600"
              >
                Mobile No.
              </label>
              <input
                type="mobile_no"
                name="mobile_no"
                id="mobile_no"
                value={userCredentials.mobile_no}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                placeholder="7894561230"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    mobile_no: e.target.value,
                  }))
                }
              />
            </article>
          </article>
          {/* email & password section */}
          <article className="whitespace-nowrap w-full flex flex-col items-center xsm:flex-row xsm:flex-nowrap xsm:justify-between xsm:items-center gap-4">
            {/* email */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="email"
                id="email_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userCredentials.email}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                placeholder="abc@gmail.com"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    email: e.target.value,
                  }))
                }
              />
            </article>
            {/* password */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="password"
                id="password_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={userCredentials.password}
                className="border-[1px] border-black rounded-md p-2 -mt-3 w-full"
                aria-required
                onChange={(e) =>
                  setUserCredentials((props) => ({
                    ...props,
                    password: e.target.value,
                  }))
                }
              />
            </article>
            {/* cnf password */}
            <article className="whitespace-nowrap w-full flex flex-col items-center grow">
              <label
                htmlFor="cnf_password"
                id="cnf_password_Label"
                className="bg-white ml-4 z-[2] w-fit self-start after:content-['*'] after:text-red-600 after:ml-1"
              >
                Confirm Password
              </label>
              <div className="relative flex flex-nowrap -mt-3 w-full items-center">
                <input
                  type="text"
                  name="cnf_password"
                  id="cnf_password"
                  value={cnfPassword}
                  className="border-[1px] border-black rounded-md p-2 w-full"
                  aria-required
                  onChange={(e) => setCNFPassword(e.target.value)}
                />
                {userCredentials.password === cnfPassword ? (
                  <small className="absolute flex items-center right-2 text-white font-extrabold bg-green-400 p-2 w-6 h-6 rounded-full">
                    ✔
                  </small>
                ) : (
                  <small className="absolute flex items-center justify-center right-2 text-white font-extrabold bg-red-400 p-2 w-6 h-6 rounded-full">
                    ✖
                  </small>
                )}
              </div>
            </article>
          </article>
        </form>
        <p ref={errorRef} className="text-red-500 font-bold text-center"></p>
        <button
          className="py-2 px-8 rounded-md bg-primary text-white self-center focus:shadow-[0.1rem_0.1rem_1rem_0.5rem_green_inset] w-fit gap-2 flex justify-center items-center"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <p>Sign Up</p>
          <p className="hidden w-5 aspect-square rounded-full border-4 border-l-violet-500 border-r-green-500 border-b-orange-600 border-t-red-500 animate-[spin_0.3s_linear_infinite]"></p>
        </button>
        <span className="text-center">
          Already have an account?{" "}
          <Link to={"/signin"} className="text-primary font-semibold">
            Sign In
          </Link>
        </span>
      </article>
    </section>
  );
}
