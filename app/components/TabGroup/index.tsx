// components/TabGroup.tsx
import { FC } from "react";

interface Texture {
  coller: { url: string; name: string }[];
  sleeves: { url: string; name: string }[];
  pockets: { url: string; name: string }[];
}

interface TabGroupProps {
  fabric: Texture;
  selectedCollar: number;
  selectedSleeve: number;
  selectedPocket: number;
  setSelectedCollar: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSleeve: React.Dispatch<React.SetStateAction<number>>;
  setSelectedPocket: React.Dispatch<React.SetStateAction<number>>;
}

const TabGroup: FC<TabGroupProps> = ({
  fabric,
  selectedCollar,
  selectedSleeve,
  selectedPocket,
  setSelectedCollar,
  setSelectedSleeve,
  setSelectedPocket,
}) => {
  return (
    <div className="flex flex-col w-1/4 mr-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Collar</h3>
        <div className="flex flex-wrap gap-2">
          {/* Fallback to an empty array if coller is undefined */}
          {(fabric.coller || []).map((collar, index) => (
            <img
              key={index}
              width="200"
              src={collar.url}
              alt={collar.name}
              className="cursor-pointer"
              onClick={() => setSelectedCollar(index)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Sleeves</h3>
        <div className="flex flex-wrap gap-2">
          {/* Fallback to an empty array if sleeves is undefined */}
          {(fabric.sleeves || []).map((sleeve, index) => (
            <img
              key={index}
              width="200"
              src={sleeve.url}
              alt={sleeve.name}
              className="cursor-pointer"
              onClick={() => setSelectedSleeve(index)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Pockets</h3>
        <div className="flex flex-wrap gap-2">
          {/* Fallback to an empty array if pockets is undefined */}
          {(fabric.pockets || []).map((pocket, index) => (
            <img
              key={index}
              width="200"
              src={pocket.url}
              alt={pocket.name}
              className="cursor-pointer"
              onClick={() => setSelectedPocket(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
