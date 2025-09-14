export default function Plans() {
  const list = {
    monthly: [
      {
        id: 1,
        name: "Monthly Basic",
        price: 9.99,
        description:
          "Perfect for individuals with occasional conversion needs.",
        maxConversions: 100,
        maxFileSizeMB: 10,
        batchLimit: 1,
        support: "Email support",
        formats: ["PDF ↔ Word", "PDF ↔ Image"],
        advantages: [
          "Affordable monthly plan",
          "Good for light users",
          "Access from any device",
        ],
      },
      {
        id: 2,
        name: "Monthly Pro",
        price: 19.99,
        description:
          "Best for students and professionals with frequent conversion needs.",
        maxConversions: 500,
        maxFileSizeMB: 25,
        batchLimit: 5,
        support: "Priority email support",
        formats: ["PDF ↔ Word", "PDF ↔ Excel", "PDF ↔ Image"],
        advantages: [
          "Batch conversion enabled",
          "Higher file size limits",
          "Supports more formats",
        ],
      },
      {
        id: 3,
        name: "Monthly Advanced",
        price: 29.99,
        description:
          "Ideal for businesses and heavy users who require large-scale conversions.",
        maxConversions: 2000,
        maxFileSizeMB: 100,
        batchLimit: 20,
        support: "24/7 priority support",
        formats: [
          "PDF ↔ Word",
          "PDF ↔ Excel",
          "PDF ↔ Image",
          "PDF ↔ PPT",
          "PDF ↔ TXT",
        ],
        advantages: [
          "Great for teams or businesses",
          "Large file support",
          "Convert multiple files at once",
        ],
      },
    ],
    yearly: [
      {
        id: 4,
        name: "Yearly Basic",
        price: 99.99,
        description: "Save more with a yearly plan for casual users.",
        maxConversions: 1200,
        maxFileSizeMB: 10,
        batchLimit: 1,
        support: "Email support",
        formats: ["PDF ↔ Word", "PDF ↔ Image"],
        advantages: ["2 months free compared to monthly"],
      },
      {
        id: 5,
        name: "Yearly Pro",
        price: 199.99,
        description: "For professionals with regular file conversion needs.",
        maxConversions: 6000,
        maxFileSizeMB: 25,
        batchLimit: 10,
        support: "Priority email support",
        formats: ["PDF ↔ Word", "PDF ↔ Excel", "PDF ↔ Image", "PDF ↔ PPT"],
        advantages: ["2 months free compared to monthly"],
      },
      {
        id: 6,
        name: "Yearly Advanced",
        price: 299.99,
        description: "Best value for teams and enterprises.",
        maxConversions: 24000,
        maxFileSizeMB: 100,
        batchLimit: 50,
        support: "24/7 dedicated support",
        formats: [
          "PDF ↔ Word",
          "PDF ↔ Excel",
          "PDF ↔ Image",
          "PDF ↔ PPT",
          "PDF ↔ TXT",
        ],
        advantages: ["2 months free compared to monthly"],
      },
    ],
    unlimited: [
      {
        id: 7,
        name: "Unlimited Plan",
        price: 499.99,
        description:
          "One-time subscription for unlimited file conversions, forever.",
        maxConversions: Infinity,
        maxFileSizeMB: Infinity,
        batchLimit: Infinity,
        support: "Lifetime 24/7 support",
        formats: [
          "PDF ↔ Word",
          "PDF ↔ Excel",
          "PDF ↔ Image",
          "PDF ↔ PPT",
          "PDF ↔ TXT",
        ],
        advantages: [
          "Unlimited conversions",
          "No file size restrictions",
          "Unlimited batch processing",
          "Early access to new features",
        ],
      },
    ],
  };

  return list;
}
