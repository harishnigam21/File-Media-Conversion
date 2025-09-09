import { SiConvertio } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa";
import { PiArrowsMergeBold } from "react-icons/pi";
import { FaFileWaveform } from "react-icons/fa6";
import { MdEditDocument } from "react-icons/md";
import { FaFileWord } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";
import { AiFillFilePpt } from "react-icons/ai";
import { LuFiles } from "react-icons/lu";
import { IoIosLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
export default function Nav() {
  const list = [
    {
      id: 1,
      name: "Converters",
      path: "/converters",
      icon: SiConvertio,
      submenu: [
        {
          id: 1,
          name: "PDF Converter",
          path: "/pdf_converter",
          icon: FaFilePdf,
        },
        {
          id: 2,
          name: "PDF Merger",
          path: "/pdf_merger",
          icon: PiArrowsMergeBold,
        },
        {
          id: 3,
          name: "PDF Editor",
          path: "/pdf_editor",
          icon: MdEditDocument,
        },
        {
          id: 4,
          name: "DOCX Converter",
          path: "/docx_converter",
          icon: FaFileWord,
        },
        {
          id: 5,
          name: "XLSX Converter",
          path: "/xlsx_converter",
          icon: FaFileExcel,
        },
        {
          id: 6,
          name: "Presentation Converter",
          path: "/presentation_converter",
          icon: AiFillFilePpt,
        },
      ],
    },
    {
      id: 2,
      name: "File Formats",
      path: "file_formats",
      icon: FaFileWaveform,
    },
    {
      id: 3,
      name: "My Files",
      path: "my_files",
      icon: LuFiles,
    },
    {
      id: 4,
      name: "Sign In",
      path: "signIn",
      icon: IoIosLogIn,
    },
    {
      id: 5,
      name: "Sign Up",
      path: "signUp",
      icon: MdAppRegistration,
    },
  ];
  return list;
}
