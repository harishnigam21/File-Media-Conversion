import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import SignIn from "./Auth_Component/SignIn";
import SignUp from "./Auth_Component/SignUp";
import SignOut from "./Auth_Component/SignOut";
import ForgotPassword from "./Auth_Component/ForgotPassword";
import Plan from "./Plans/Plan";

// separate converter pages
import DOCXconverter from "./Separate_Converter_Page/docxConverter";
import PDFconverter from "./Separate_Converter_Page/pdfConverter";
import PDFeditor from "./Separate_Converter_Page/pdfEditor";
import PDFmerger from "./Separate_Converter_Page/pdfMerger";
import PPTconverter from "./Separate_Converter_Page/pptConverter";
import XLSXconverter from "./Separate_Converter_Page/xlsxConverter";

//only testing purpose
import FileUploader from "./Plans/Testing";

function Root() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/:email/home",
      element: <App />,
    },
    {
      path: "/signin",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/:email/:something/plans",
      element: <Plan />,
    },
    {
      path: "/:email/:something/docx_converter",
      element: <DOCXconverter />,
    },
    {
      path: "/:email/:something/pdf_converter",
      element: <PDFconverter />,
    },
    {
      path: "/:email/:something/pdf_editor",
      element: <PDFeditor />,
    },
    {
      path: "/:email/:something/pdf_merger",
      element: <PDFmerger />,
    },
    {
      path: "/:email/:something/ppt_converter",
      element: <PPTconverter />,
    },
    {
      path: "/:email/:something/xlsx_converter",
      element: <XLSXconverter />,
    },
    {
      path: "/signout",
      element: <SignOut />,
    },
    {
      path: "/forgot_password",
      element: <ForgotPassword />,
    },
    // delete after final build
    {
      path: "/testing",
      element: <FileUploader />,
    },
  ]);
  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
