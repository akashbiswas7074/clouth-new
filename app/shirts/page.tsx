// pages/shop.tsx
"use client"
import { useState } from "react";
import Shop from "@/app/components/shop";

interface Texture {
  color: string;
  body: string;
  coller: { name: string; url: string }[];
  sleeves: { name: string; url: string }[];
  pockets: { name: string; url: string }[];
  collar_type: string;
  button_holder: string;
  buttons: string;
}

interface Item {
  texture: Texture;
}

const itemsArr: Item[] = [
  {
    texture: {
      color: "White",
      body: "/assets/images/white/body.png",
      coller: [
        { name: "first", url: "/assets/images/white/collar_1.png" },
        { name: "second", url: "/assets/images/white/collar_2.png" },
        { name: "third", url: "/assets/images/white/collar_3.png" },
        { name: "forth", url: "/assets/images/white/collar_4.png" },
      ],
      sleeves: [
        { name: "first", url: "/assets/images/white/sleeves_1.png" },
        { name: "second", url: "/assets/images/white/sleeves_2.png" },
        { name: "third", url: "/assets/images/white/sleeves_3.png" },
      ],
      pockets: [
        { name: "first", url: "/assets/images/white/pocket_1.png" },
        { name: "second", url: "/assets/images/white/pocket_2.png" },
        { name: "third", url: "/assets/images/white/pocket_3.png" },
      ],
      collar_type: "/assets/images/white/collar_type.png",
      button_holder: "/assets/images/white/buttons_holder.png",
      buttons: "/assets/images/white/buttons",
    },
  },
  {
    texture: {
      color: "Blue",
      body: "/assets/images/blue/body.png",
      coller: [
        { name: "first", url: "/assets/images/blue/collar_1.png" },
        { name: "second", url: "/assets/images/blue/collar_2.png" },
        { name: "third", url: "/assets/images/blue/collar_3.png" },
        { name: "forth", url: "/assets/images/blue/collar_4.png" },
      ],
      sleeves: [
        { name: "first", url: "/assets/images/blue/sleeves_1.png" },
        { name: "second", url: "/assets/images/blue/sleeves_2.png" },
        { name: "third", url: "/assets/images/blue/sleeves_3.png" },
      ],
      pockets: [
        { name: "first", url: "/assets/images/blue/pocket_1.png" },
        { name: "second", url: "/assets/images/blue/pocket_2.png" },
        { name: "third", url: "/assets/images/blue/pocket_3.png" },
      ],
      collar_type: "/assets/images/blue/collar_type.png",
      button_holder: "/assets/images/blue/buttons_holder.png",
      buttons: "/assets/images/blue/buttons",
    },
  },
];

const ShopPage = () => {
  const [selectedFabric, setSelectedFabric] = useState<number>(0);
  const [selectedCollar, setSelectedCollar] = useState<number>(0);
  const [selectedSleeve, setSelectedSleeve] = useState<number>(0);
  const [selectedPocket, setSelectedPocket] = useState<number>(0);

  return (
    <div className="flex">
      <div className="w-1/5 p-4">
        <h3 className="text-lg font-semibold mb-4">Fabric</h3>
        <div>
          {itemsArr.map((fabric, index) => (
            <div
              key={index}
              className="cursor-pointer mb-2"
              onClick={() => setSelectedFabric(index)}
            >
              <img
                width="200"
                src={fabric.texture.body}
                alt={fabric.texture.color}
              />
              <p className="text-center">{fabric.texture.color}</p>
            </div>
          ))}
        </div>
      </div>

      <Shop
        itemsArr={itemsArr}
        selectedFabric={selectedFabric}
        selectedCollar={selectedCollar}
        selectedSleeve={selectedSleeve}
        selectedPocket={selectedPocket}
        setSelectedCollar={setSelectedCollar}
        setSelectedSleeve={setSelectedSleeve}
        setSelectedPocket={setSelectedPocket}
      />
    </div>
  );
};

export default ShopPage;
