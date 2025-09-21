import logo from "../../images/logo.png";
export default function siteInfo() {
  const site_name = "FileFlips";
  const info = {
    site_name: site_name,
    logo: logo,
    about: [
      `FileFlips provides a robust online file conversion platform designed for seamless and quick transitions between various file formats. Whether it\'s documents, images, presentations or archives.
    FileFlips caters to all your conversion needs. Supporting over 10 file formats and handling files up to 50 MB, the platform allows users to select the output quality and format for their converted files, offering instant downloads. Aside from its convenience, FileFlips prioritizes security and reliability. Utilizing SSL encryption for data protection and automatically deleting files from the server after 4 hours for non-signed-in users (3 days for registered users), it ensures user privacy without the need for software installations or account registrations. Compatible across different browsers, devices, and network connections, FileFlips ensures a smooth user experience. As the ultimate online file converter, FileFlips streamlines tasks in minutes. Be it converting a PDF to Word or a JPG to PNG the platform handles a wide range of formats, continuously updating its list to accommodate new conversions.`,
      `Users can even request additional formats by contacting FileFlips through their site. Experience the efficiency of FileFlips firsthand and witness how it simplifies your file conversion process.`,
    ],
    companyInfo: {
      site_domain: "fileflip.com",
      company_logo: logo,
      company_name: site_name,
      company_address: {
        street: "Street no. 6",
        city: "New Delhi",
        state: "Delhi",
        pin: "110084",
        country: "India",
      },
      company_phone_no: ["8962008472", "8462978184"],
    },
  };
  return info;
}
