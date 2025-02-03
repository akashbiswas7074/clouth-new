import { getBacksByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Back/back.actions";
import { getBottomsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Bottom/bottom.actions";
import { getCollarsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Collar/collar.actions";
import { getCuffsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Cuff/cuff.actions";
import { getFitsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Fit/fit.actions";
import { getPlacketsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Placket/placket.actions";
import { getPocketsByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Pocket/pocket.actions";
import { getSleevesByColorAndFabric } from "@/lib/database/actions/admin/ShirtArea/Sleeve/sleeve.action";
import { useEffect, useState } from "react";

interface ProductData {
  backs: any[];
  bottoms: any[];
  collars: any[];
  cuffs: any[];
  fits: any[];
  plackets: any[];
  pockets: any[];
  sleeves: any[];
}

const useProductData = () => {
  const [data, setData] = useState<ProductData>({
    backs: [],
    bottoms: [],
    collars: [],
    cuffs: [],
    fits: [],
    plackets: [],
    pockets: [],
    sleeves: [],
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const fabricId = localStorage.getItem("fabricId");
      const colorId = localStorage.getItem("colorId");

      if (fabricId && colorId) {
        setLoading(true);
        try {
          const [
            backs,
            bottoms,
            collars,
            cuffs,
            fits,
            plackets,
            pockets,
            sleeves,
          ] = await Promise.all([
            getBacksByColorAndFabric(fabricId, colorId),
            getBottomsByColorAndFabric(fabricId, colorId),
            getCollarsByColorAndFabric(fabricId, colorId),
            getCuffsByColorAndFabric(fabricId, colorId),
            getFitsByColorAndFabric(fabricId, colorId),
            getPlacketsByColorAndFabric(fabricId, colorId),
            getPocketsByColorAndFabric(fabricId, colorId),
            getSleevesByColorAndFabric(fabricId, colorId),
          ]);

          setData({
            backs,
            bottoms,
            collars,
            cuffs,
            fits,
            plackets,
            pockets,
            sleeves,
          });
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};

export default useProductData;
