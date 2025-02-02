// components/Shop.tsx
"use client"

import { FC } from "react";
import TabGroup from "@/app/components/TabGroup";
import Canvas from "@/app/components/Canvas";


interface Item {
  id: number;
  name: string;
  body: string;
  color: string;
  coller: string;
  sleeves: string;
}

interface ShopProps {
  itemsArr: Item[];
  selectedFabric: number;
  selectedCollar: number;
  selectedSleeve: number;
  selectedPocket: number;
  setSelectedCollar: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSleeve: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPocket: React.Dispatch<React.SetStateAction<number>>;
}

const Shop: FC<ShopProps> = ({
  itemsArr,
  selectedFabric,
  selectedCollar,
  selectedSleeve,
  selectedPocket,
  setSelectedCollar,
  setSelectedSleeve,
  setSelectedPocket,
}) => {
  const fabric = itemsArr[selectedFabric];

  return (
    <div className="flex flex-1 p-4">
      <TabGroup
        fabric={fabric}
        selectedCollar={selectedCollar}
        selectedSleeve={selectedSleeve}
        selectedPocket={selectedPocket}
        setSelectedCollar={setSelectedCollar}
        setSelectedSleeve={setSelectedSleeve}
        setSelectedPocket={setSelectedPocket}
      />
      <Canvas
        fabric={fabric}
        selectedCollar={selectedCollar}
        selectedSleeve={selectedSleeve}
        selectedPocket={selectedPocket}
      />
    </div>
  );
};

export default Shop;
