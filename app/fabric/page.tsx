'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import fabricsData from '@/app/utils/data/cloth';

interface Color {
  name: string;
  image: string;
  hexCode: string;
}

interface Fabric {
  id: number;
  name: string;
  colors: Color[];
}

const Page = () => {
  const [selectedColors, setSelectedColors] = useState<{ [fabricId: number]: string }>({});

  const handleColorSelect = (fabricId: number, colorName: string) => {
    setSelectedColors({
      ...selectedColors,
      [fabricId]: colorName,
    });
  };

  const getDisplayedImage = (fabric: Fabric) => {
    const selectedColor = selectedColors[fabric.id];
    const color = fabric.colors.find(c => c.name === selectedColor);
    return color ? color.image : fabric.colors[0].image;
  };

  return (
    <div className="min-h-screen pt-28">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-4xl font-semibold mb-4 text-[#646464]">Fabrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fabricsData.map((fabric: Fabric) => (
              <div key={fabric.id} className="w-full rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 overflow-hidden relative">
                <Link href={selectedColors[fabric.id] ? '/form' : ''} >
                  <Image
                    src={getDisplayedImage(fabric)}
                    alt={fabric.name}
                    width={500}
                    height={300}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-t-lg cursor-pointer"
                  />
                </Link> 
                <div className="flex flex-wrap gap-2 justify-center p-2 rounded-b-lg">
                  {fabric.colors.map((color: Color) => (
                    <div
                      key={color.name}
                      className={`rounded-full w-8 h-8 cursor-pointer shadow-md transition duration-300 ease-in-out transform hover:scale-110
                      ${selectedColors[fabric.id] === color.name ? '' : ''}`}
                      style={{ backgroundColor: color.hexCode }}
                      onClick={() => handleColorSelect(fabric.id, color.name)}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;