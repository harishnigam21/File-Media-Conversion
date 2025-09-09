export default function FAQ() {
  const list = [
    {
      id: 1,
      question: "What files can I convert?",
      answer: "Please refer to the Supported File Formats section.",
      status: false,
    },
    {
      id: 2,
      question: "Files of what size can I convert?",
      answer:
        "Up to 50 MB currently. If you'd like to convert larger video files please visit http://www.videotoolbox.com.",
      status: false,
    },
    {
      id: 3,
      question:
        "I received a message 'An error occurred during conversion of your file'. Should I try to convert it again?",
      answer:
        "No. This message means that there's something wrong with your input file. Trying to convert it again, even selecting another output format, makes no sense.",
      status: false,
    },
    {
      id: 4,
      question: "How will I get the converted file?",
      answer:
        "When conversion is complete, your browser will display a message with a link to download the file.",
      status: false,
    },
    {
      id: 5,
      question: "How long will the converted file be available for download?",
      answer:
        "We'll keep your file for 4 hours (non-signed-in users) or 3 days (registered users) once it's been converted. Please make sure that you get it within that period.",
      status: false,
    },
    {
      id: 6,
      question: "I've received an error message. What does it mean?",
      answer:
        "Because of the variety of file formats, containers, codecs and file attributes used out there, errors could occur with some conversions. If it happens, our support team will correct the error and let you know about the outcome of the conversion process.",
      status: false,
    },
    {
      id: 7,
      question:
        "Can I convert files using links to video-sharing sites such as Youtube.com?",
      answer:
        "No, we no longer support converting videos from video sharing websites as it is against their terms of use.",
      status: false,
    },
    {
      id: 8,
      question: "Are there PDF files that will not convert?",
      answer:
        "Yes, those protected by Acrobat security methods will not complete the conversion process.",
      status: false,
    },
    {
      id: 9,
      question: "Are there archive files that will not convert?",
      answer:
        "Yes, those password-protected will not complete the conversion process.",
      status: false,
    },
    {
      id: 10,
      question: "Will it be possible to convert multi-volume archive files?",
      answer: "No, an archive file must be comprised of a single volume.",
      status: false,
    },
  ];
  return list;
}
