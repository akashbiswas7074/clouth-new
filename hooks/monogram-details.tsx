"use client";

import { getMonogramsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Monogram/monogram.actions";
import { useEffect, useState } from "react";

// Define types for Monogram
interface Monogram {
  _id?: string;
  style: {
    name: string;
    image: {
      url: string;
      public_id: string;
    };
    price: number;
  };
  position: {
    name: string;
    image: {
      url: string;
      public_id: string;
    };
    price: number;
  };
}

// Define the main MonogramData interface
interface MonogramData {
  monogramStyle: any[];
  monogramPosition: any[];
}

const useMonogramData = () => {
  const [data, setData] = useState<MonogramData>({
    monogramStyle: [],
    monogramPosition: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const fabricId = localStorage.getItem("fabricId");
      const colorId = localStorage.getItem("colorId");

      if (fabricId && colorId) {
        setLoading(true);
        try {
          const monograms = await getMonogramsByColorAndFabric(
            fabricId,
            colorId
          );

          // const monogramStyle = monograms?.map(
          //   (monogram: Monogram) => monogram.style
          // );
          // const collarHeight = collar
          // ?.filter((collar: Collar) => collar.height?.name)
          // .map((collar: Collar) => ({
          //   ...collar.height,
          //   _id: collar._id,
          // }));
          const monogramStyle = monograms
            ?.filter((monogram: Monogram) => monogram.style)
            .map((monogram: Monogram) => ({
              ...monogram.style,
              _id: monogram._id,
            }));

          // const monogramPosition = monograms?.map(
          //   (monogram: Monogram) => monogram.position
          // );

          const monogramPosition = monograms
            ?.filter((monogram: Monogram) => monogram.position)
            .map((monogram: Monogram) => ({
              ...monogram.position,
              _id: monogram._id,
            }));

          setData({
            monogramStyle,
            monogramPosition,
          });
        } catch (error) {
          console.error("Error fetching monogram data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};

export default useMonogramData;
