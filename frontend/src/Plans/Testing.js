import React, { useRef } from "react";

export default function FileUploader() {
  const fileInputRef = useRef(null);

  const handleUploadClick = (source) => {
    switch (source) {
      case "device":
        fileInputRef.current.click();
        break;
      case "url":
        const url = prompt("Enter file URL:");
        if (url) {
          console.log("File from URL:", url);
        }
        break;
      case "gdrive":
        window.gapi.load("auth", { callback: authenticate });
        window.gapi.load("picker", { callback: createPicker });
        break;

        // auth flow
        function authenticate() {
          window.gapi.auth.authorize(
            {
              client_id:
                "782728745677-8kkqs575gubomklkuohltpagg91drk95.apps.googleusercontent.com",
              scope: "https://www.googleapis.com/auth/drive.file",
              immediate: false,
            },
            (authResult) => {
              if (authResult && !authResult.error) {
                createPicker(authResult.access_token);
              }
            }
          );
        }

        function createPicker(token) {
          if (token) {
            const view = new window.google.picker.DocsView();
            const picker = new window.google.picker.PickerBuilder()
              .addView(view)
              .setOAuthToken(token)
              .setDeveloperKey("AIzaSyBDE9ku9g9iUo6CpFC__b8vXuI3PwLW6Bc")
              .setCallback((data) => {
                if (data.action === window.google.picker.Action.PICKED) {
                  const file = data.docs[0];
                  console.log("Google Drive file:", file);
                }
              })
              .build();
            picker.setVisible(true);
          }
        }

      case "dropbox":
        window.Dropbox.choose({
          linkType: "direct", // or "preview"
          multiselect: false,
          success: function (files) {
            console.log("Dropbox file:", files[0]);
          },
          cancel: function () {
            console.log("User canceled Dropbox picker");
          },
        });
        break;

      case "onedrive":
        console.log("OneDrive integration here");
        break;
      case "box":
        console.log("Box integration here");
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    console.log("File from device:", e.target.files[0]);
  };

  return (
    <div>
      <button className="bg-green-400 px-4 py-2 rounded text-white">
        Choose Files ⬇
      </button>

      <ul className="border w-60 bg-white shadow mt-2">
        <li
          onClick={() => handleUploadClick("device")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          📁 From my device
        </li>
        <li
          onClick={() => handleUploadClick("url")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          🔗 From URL
        </li>
        <li
          onClick={() => handleUploadClick("box")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          📦 From Box
        </li>
        <li
          onClick={() => handleUploadClick("dropbox")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          🗂️ From Dropbox
        </li>
        <li
          onClick={() => handleUploadClick("gdrive")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          📂 From Google Drive
        </li>
        <li
          onClick={() => handleUploadClick("onedrive")}
          className="p-2 cursor-pointer hover:bg-gray-100"
        >
          ☁️ From OneDrive
        </li>
      </ul>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
