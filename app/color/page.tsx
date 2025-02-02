import React from 'react';
import Image from 'next/image';

const items = [
  { image: "/c1.webp", color: "#FF0000" },
  { image: "/c3.webp", color: "#00FF00" },
  { image: "/c2.webp", color: "#0000FF" },
  { image: "/c1.webp", color: "#FFFF00" },
  { image: "/c2.webp", color: "#FF00FF" },
  { image: "/c3.webp", color: "#00FFFF" },
  { image: "/c1.webp", color: "#FFA500" },
  { image: "/c2.webp", color: "#800080" },
  { image: "/c3.webp", color: "#A0522D" },
  { image: "/c2.webp", color: "#ADD8E6" },
  { image: "/c1.webp", color: "#90EE90" },
  { image: "/c1.webp", color: "#FFB6C1" },
  { image: "/c2.webp", color: "#D3D3D3" },
  { image: "/c3.webp", color: "#EEE8AA" },
  { image: "/c1.webp", color: "#F08080" },
  { image: "/c2.webp", color: "#E6E6FA" },
];

const page = () => {
  return (
    <div className="min-h-screen pt-24 bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl text-[#646464] font-bold mb-8 text-center">Choose an image</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="w-full rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 overflow-hidden">
              <Image
                src={item.image}
                alt={`Image ${index + 1}`}
                width={500}
                height={300}
                layout="responsive"
                objectFit="cover"
                className="rounded-t-lg"
              />
              <div
                className="h-12 w-full rounded-b-lg"
                style={{ backgroundColor: item.color }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;