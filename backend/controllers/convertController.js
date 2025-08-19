import CloudConvert from "cloudconvert";
export const convertFile = async (req, res) => {
  const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY1);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { inputFormat, outputFormat } = req.body;
    if (!outputFormat) {
      return res.status(400).json({ error: "Missing outputFormat" });
    }
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
        details: "No files returned from CloudConvert export task.",
        job: completedJob,
      });
    }
    const fileUrl = exportTask.result.files[0].url;
    res.json({ message: "File converted successfully!", fileUrl });
  } catch (err) {
    console.log("Conversion Error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};
