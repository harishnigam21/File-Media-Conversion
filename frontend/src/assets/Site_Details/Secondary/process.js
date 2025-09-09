import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
export default function Process() {
  const list = [
    {
      id: 1,
      name: "Upload Files",
      icon: FaCloudUploadAlt,
      animation: "pulse",
    },
    {
      id: 2,
      name: "Select Format & Convert",
      icon: IoSettings,
      animation: "spin",
    },
    {
      id: 3,
      name: "Download Result",
      icon: FaCloudDownloadAlt,
      animation: "pulse",
    },
  ];
  return list;
}
