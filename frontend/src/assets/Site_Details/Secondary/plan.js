import { useState, useEffect } from "react";

export default function Plans() {
  const [fromDB, setFromDB] = useState(null);

  useEffect(() => {
    const getPlan = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_HOST}/get_plan`;
        const response = await fetch(url, {
          method: "GET",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          console.log(data.message);
          return;
        }
        setFromDB({
          trial: data.plans.filter((item) =>
            item.name.toLowerCase().includes("trial")
          ),
          monthly: data.plans.filter((item) =>
            item.name.toLowerCase().includes("month")
          ),
          yearly: data.plans.filter((item) =>
            item.name.toLowerCase().includes("year")
          ),
          unlimited: data.plans.filter((item) =>
            item.name.toLowerCase().includes("unlimited")
          ),
        });
      } catch (error) {
        console.error("Failed to fetch plan data:", error);
      }
    };
    getPlan();
  }, []);

  return fromDB;
}
