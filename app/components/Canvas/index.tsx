// components/Canvas.tsx
import { FC } from "react";

interface Texture {
  body: string;
  color: string;
  coller: { url: string }[] | undefined;
  sleeves: { url: string }[] | undefined;
  pockets: { url: string }[] | undefined;
}

interface CanvasProps {
  fabric: Texture;
  selectedCollar: number;
  selectedSleeve: number;
  selectedPocket: number;
}

const Canvas: FC<CanvasProps> = ({
  fabric,
  selectedCollar,
  selectedSleeve,
  selectedPocket,
}) => {
  // Ensure fabric properties are defined and check array lengths
  const isValidCollar = fabric.coller && fabric.coller.length > 0 && selectedCollar >= 0 && selectedCollar < fabric.coller.length;
  const isValidSleeve = fabric.sleeves && fabric.sleeves.length > 0 && selectedSleeve >= 0 && selectedSleeve < fabric.sleeves.length;
  const isValidPocket = fabric.pockets && fabric.pockets.length > 0 && selectedPocket >= 0 && selectedPocket < fabric.pockets.length;

  return (
    <div className="relative w-2/3">
      {/* Body */}
      <img
        className="absolute top-0 left-0 z-1"
        src={fabric.body}
        alt={fabric.color}
      />

      {/* Collar */}
      {isValidCollar ? (
        <img
          className="absolute top-0 left-0 z-2"
          src={fabric.coller[selectedCollar]?.url}
          alt={`Collar ${selectedCollar}`}
        />
      ) : (
        <div className="absolute top-0 left-0 z-2">
          {/* Fallback for invalid collar */}
          <img
            src="/path/to/default-collar.png"
            alt="Default Collar"
            width={200}
            height={200}
          />
        </div>
      )}

      {/* Sleeve */}
      {isValidSleeve ? (
        <img
          className="absolute top-0 left-0 z-2"
          src={fabric.sleeves[selectedSleeve]?.url}
          alt={`Sleeve ${selectedSleeve}`}
        />
      ) : (
        <div className="absolute top-0 left-0 z-2">
          {/* Fallback for invalid sleeve */}
          <img
            src="/path/to/default-sleeve.png"
            alt="Default Sleeve"
            width={200}
            height={200}
          />
        </div>
      )}

      {/* Pocket */}
      {isValidPocket ? (
        <img
          className="absolute top-0 left-0 z-2"
          src={fabric.pockets[selectedPocket]?.url}
          alt={`Pocket ${selectedPocket}`}
        />
      ) : (
        <div className="absolute top-0 left-0 z-2">
          {/* Fallback for invalid pocket */}
          <img
            src="/path/to/default-pocket.png"
            alt="Default Pocket"
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  );
};

export default Canvas;
