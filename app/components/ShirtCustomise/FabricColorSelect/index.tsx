"use client";
import { useState, useEffect } from "react";
import { getAllFabrics } from "@/lib/database/actions/admin/ShirtArea/Fabric/fabric.actions";
import { getColorByFabric } from "@/lib/database/actions/admin/ShirtArea/Color/color.actions";

interface Color {
  _id: string;
  hexCode: string;
  image: {
    url: string;
    public_id: string;
  };
}

interface Fabric {
  _id: string;
  fabricName: string;
}

const FabricsWithColors = () => {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [colors, setColors] = useState<{ [fabricId: string]: Color[] }>({});
  const [selectedColorImages, setSelectedColorImages] = useState<{
    [fabricId: string]: string | null;
  }>({});

  // Fetch fabrics and colors on component mount
  useEffect(() => {
    const fetchFabrics = async () => {
      const fabricsData = await getAllFabrics();
      setFabrics(fabricsData);

      // Fetch colors for each fabric
      fabricsData.forEach(async (fabric: Fabric) => {
        const colorData = await getColorByFabric(fabric._id);
        setColors((prev) => ({
          ...prev,
          [fabric._id]: colorData,
        }));

        // Set default image to the first color if available
        if (colorData.length > 0) {
          setSelectedColorImages((prev) => ({
            ...prev,
            [fabric._id]: colorData[0].image.url,
          }));
        }
      });
    };

    fetchFabrics();
  }, []);

  // Handle color click to display the image and save to localStorage
  const handleColorClick = (fabricId: string, color: Color) => {
    setSelectedColorImages((prev) => ({
      ...prev,
      [fabricId]: color.image.url,
    }));

    // Save colorId and fabricId to localStorage
    localStorage.setItem("colorId", color._id);
    localStorage.setItem("fabricId", fabricId);
  };

  return (
    <div className="min-h-screen pt-28 font-play">
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h2 className="text-4xl font-semibold mb-4 text-[#646464]">
            Fabrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {fabrics.map((fabric) => (
              <div
                key={fabric._id}
                className="w-full rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full bg-white text-center p-2 font-semibold text-gray-800">
                  {fabric.fabricName}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Default image or selected image for each fabric */}
                    <div className="w-full mb-4">
                      <img
                        src={
                          selectedColorImages[fabric._id] || "defaultImage.jpg" // Provide a fallback if no color is selected
                        }
                        alt="Selected Color"
                        className="w-full max-w-xs rounded-lg shadow-lg"
                      />
                    </div>

                    {/* Color selection circles */}
                    {colors[fabric._id]?.map((color) => (
                      <div
                        key={color._id}
                        className="w-8 h-8 rounded-full cursor-pointer"
                        style={{ backgroundColor: color.hexCode }}
                        onClick={() => handleColorClick(fabric._id, color)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="absolute bottom-8 right-8">
            <button
              onClick={() => (window.location.href = "/form-new")} // Navigate to the form-new page
              className="bg-[#C40600] mt-10 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricsWithColors;
