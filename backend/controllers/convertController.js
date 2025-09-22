import CloudConvert from "cloudconvert";
export const convertFile = async (req, res) => {
  try {
    const cloudConvert = new CloudConvert(
      process.env.CLOUDCONVERT_API_TESTING_KEY
    );
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { inputFormat, outputFormat } = req.body;
    if (!outputFormat) {
      return res.status(400).json({ message: "Missing outputFormat" });
    }

    return res.status(200).json({ message: "short circuit" }); //TODO : Delete this line after testing

    const job = await cloudConvert.jobs.create({
      tasks: {
        "import-my-file": { operation: "import/upload" },
        "convert-my-file": {
          operation: "convert",
          input: ["import-my-file"],
          ...(inputFormat ? { input_format: inputFormat } : {}),
          output_format: outputFormat,
        },
        "export-my-file": {
          operation: "export/url",
          input: ["convert-my-file"],
        },
      },
    });
    const importTask = job.tasks.find((t) => t.name === "import-my-file");
    await cloudConvert.tasks.upload(
      importTask,
      req.file.buffer,
      req.file.originalname
    );
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(
      (t) => t.operation === "export/url" && t.status === "finished"
    );
    if (!exportTask?.result?.files?.length) {
      return res.status(500).json({
        error: "File conversion failed",
        message: "No files returned from CloudConvert export task.",
        job: completedJob,
      });
    }
    const fileUrl = exportTask.result.files[0].url;
    if (!fileUrl) {
      return res
        .status(403)
        .json({ message: "Looks like we didn't get link to download" });
    }
    console.log(
      `File converted successfully from ${inputFormat} to ${outputFormat}`
    );
    return res.status(200).json({
      message: `File converted successfully from ${inputFormat} to ${outputFormat}`,
      fileUrl,
    });
  } catch (err) {
    console.log("Conversion Error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};
