"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useMonogramData from "@/hooks/monogram-details";

const sections = ["monogramStyle", "monogramPosition"];

interface ProductItem {
  _id: string;
  name: string;
  icon?: { url: string };
  image?: { url: string };
  price?: number;
}

interface ProductData {
  monogramStyle?: ProductItem[];
  monogramPosition?: ProductItem[];
}

const MonogramCustomiser = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, loading } = useMonogramData() as {
    data: ProductData;
    loading: boolean;
  };
  const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: ProductItem;
  }>({});
  const [isBackPopupOpen, setIsBackPopupOpen] = useState(false);
  const [selectedBackImage, setSelectedBackImage] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleConfirmAndProceed = () => {
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex !== -1 && currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]); // Move to the next section
    } else {
      setActiveSection(null); // Close the box if it's the last section
    }
  };

  const handleAddMonogram = () => {
    router.push("/monogram");
  };

  const handleSkipMonogram = () => {
    router.push("/measurement");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const calculateTotalPrice = (items: Record<string, ProductItem>) => {
    return Object.values(items).reduce(
      (total, item) => total + (item.price || 0),
      0
    );
  };

  useEffect(() => {
    // Set default selections without localStorage
    sections.forEach((section) => {

      if (data && data[section as keyof ProductData]?.length) {
        const defaultItem = data[section as keyof ProductData]![0];

        setSelectedItems((prev) => {
          const updatedItems = { ...prev, [section]: defaultItem };
          const newTotalPrice = calculateTotalPrice(updatedItems);
          setTotalPrice(newTotalPrice);
          return updatedItems;
        });
      }
    });
  }, [data]);

 const handleSelect = (section: keyof ProductData, item: ProductItem) => {
  setSelectedItems((prev) => {
    const isSelected = prev[section]?._id === item._id;
    const updatedItems = {
      ...prev,
      [section]: isSelected ? null : item, // Deselect if already selected, otherwise select
    };
    const newTotalPrice = calculateTotalPrice(updatedItems);
    setTotalPrice(newTotalPrice);
    return updatedItems;
  });
};


  const getZIndex = (section: string, index: number) => {
    if (section === "collarStyle") return 50;
    if (section === "collarButton") return 60;
    if (section === "cuffStyle") return 70;
    if (section === "cuffLinks") return 80;
    if (section === "placket" || section === "pocket") return 40;
    if (section === "sleeves") return 30;
    if (section === "fit") return 20;
    if (section === "bottom") return 20;
    return index;
  };

  const closeBackPopup = () => {
    setIsBackPopupOpen(false);
    setSelectedBackImage(null);
  };

  return (
    <div className="mt-[5rem] flex-row justify-between items-start flex w-full h-fit">
      <div className="relative flex justify-center items-center w-full h-[89vh]">
        {Object.entries(selectedItems).map(([section, item], index) =>
          item.image?.url ? (
            <img
              key={index}
              src={item.image.url}
              alt={item.name}
              className="absolute top-0 left-0 w-[40vw] h-auto object-cover rounded-none"
              style={{
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%",
                zIndex: getZIndex(section, index),
              }}
            />
          ) : null
        )}
      </div>

      <div>
        <div className="fixed bottom-4 right-[20rem] bg-white p-4 shadow-lg rounded-lg flex items-center space-x-4">
          <div className="text-xl font-bold">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Next
          </button>
        </div>

        {/* {isModalOpen && (
          <div className="z-[100] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
              <h2 className="text-2xl font-bold mb-4">Confirm Shirt Details</h2>

              <div className="space-y-2">
                {Object.entries(shirt).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value.name}</span>
                      </div>
                    )
                )}
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total Price:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleCreateShirt}
                  className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                  Submit
                </button>
              ) : (
                <div className="flex justify-between space-x-4">
                  <button
                    onClick={handleAddMonogram}
                    className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Add Monogram
                  </button>
                  <button
                    onClick={handleSkipMonogram}
                    className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Don't Add
                  </button>
                </div>
              )}
            </div>
          </div>
        )} */}
      </div>

      <div className="p-[.5rem] mt-[1.5rem] w-[20%] bg-white h-full flex flex-col justify-start items-center">
        <h2 className="text-xl font-bold">Shirt Customizer</h2>
        <div className="flex flex-col justify-center w-full">
          {sections.map((section) => (
            <div
              key={section}
              className={`flex flex-col justify-center items-center w-full p-2 cursor-pointer rounded hover:bg-gray-200 ${
                activeSection === section ? "bg-gray-300" : ""
              }`}
              onClick={() => setActiveSection(section as keyof ProductData)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {activeSection && (
        <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-2xl overflow-y-auto transition-transform transform translate-x-0 z-[100] border-l border-gray-200">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-bold capitalize text-gray-800">
              {activeSection}
            </h3>
            <button
              onClick={() => setActiveSection(null)}
              className="text-gray-500 hover:text-red-500 text-2xl transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {data[activeSection]?.length === 0 ? (
              <p className="text-center text-gray-500">
                No items available in {activeSection}.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {data[activeSection]?.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelect(activeSection, item)}
                    className={`p-4 border rounded-lg cursor-pointer transition shadow-sm ${
                      selectedItems[activeSection]?._id === item._id
                        ? "bg-blue-100 border-blue-500 ring-2 ring-blue-400"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon?.url && (
                      <img
                        src={item.icon.url}
                        alt={item.name}
                        className="w-20 h-20 object-cover mx-auto rounded-md"
                      />
                    )}
                    <p className="text-center font-semibold text-gray-800 mt-2">
                      {item.name}
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      {item.price}$
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center space-x-4">
            <button
              onClick={() => setActiveSection(null)}
              className="w-1/2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmAndProceed()}
              className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              disabled={!selectedItems[activeSection]}
            >
              Confirm & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonogramCustomiser;
