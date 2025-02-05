"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useMonogramData from "@/hooks/monogram-details";
import Link from "next/link";
import { createMonogram } from "@/lib/database/actions/admin/ShirtArea/MonogramUser/monogramuser.actions";

const sections = ["monogramStyle", "monogramPosition"];

interface ProductItem {
  _id: string;
  name: string;
  image?: { url: string };
  price?: number;
}

interface ProductData {
  monogramStyle?: ProductItem[];
  monogramPosition?: ProductItem[];
}

interface MonogramItem {
  name: string;
  price: number;
}

interface Monogram {
  style?: MonogramItem;
  position?: MonogramItem;
  text: string;
  color: string;
}

const MonogramCustomiser = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, loading } = useMonogramData() as {
    data: ProductData;
    loading: boolean;
  };
  const [monogram, setMonogram] = useState<Monogram>({
    style: undefined,
    position: undefined,
    text: "",
    color: "",
  });
  //   const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
  //     null
  //   );
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

  const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
    null
  );

  const handleCreateMonogram = async () => {
    const price = totalPrice;
    try {
      const monogramData = {
        style: monogram.style || {},
        position: monogram.position || {},
        text: monogram.text,
        color: monogram.color,
      };

      const response = await createMonogram(
        price,
        monogramData.style,
        monogramData.position,
        monogramData.text,
        monogramData.color
      );

      if (response.success) {
        toast.success("Shirt created successfully!");
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to create the shirt.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleConfirmAndProceed = () => {
    if (activeSection !== null) {
      const currentIndex = sections.indexOf(activeSection);
      if (currentIndex !== -1 && currentIndex < sections.length - 1) {
        // Ensure that the next section is a valid key of ProductData, or null
        setActiveSection(
          sections[currentIndex + 1] as keyof ProductData | null
        );
      } else {
        setActiveSection(null); // Close the box if it's the last section
      }
    } else {
      // Handle the case where activeSection is null (if needed)
      setActiveSection(null);
    }
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
      const updatedItems: Record<string, ProductItem> = {
        ...prev,
        [section]: isSelected ? ({} as ProductItem) : item, // Set a default empty object instead of null
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
    <div className="mt-[5rem] flex-col md:flex-row justify-between items-start flex w-full h-fit">
      <div className="relative flex justify-center items-center w-full h-[87vh]">
        {Object.entries(selectedItems).map(([section, item], index) =>
          item.image?.url ? (
            <img
              key={index}
              src={item.image.url}
              alt={item.name}
              className="absolute top-auto bottom-auto left-auto right-auto w-[80%] md:w-[40vw] h-auto object-cover rounded-none"
              style={{
                // transform: "translate(-50%, -50%)",
                // left: "50%",
                // top: "50%",
                zIndex: getZIndex(section, index),
              }}
            />
          ) : null
        )}
        {isBackPopupOpen && selectedBackImage && (
          <div className="absolute w-fit h-fit top-auto left-auto right-auto bottom-auto bg-opacity-50 flex justify-center items-center z-[100]">
            <div className="bg-white rounded-lg">
              <h3 className="text-xl font-bold">Selected Back</h3>
              <img
                src={selectedBackImage}
                alt="Selected Back"
                className="w-[30rem] h-auto object-cover"
              />
              <button
                onClick={closeBackPopup}
                className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex md:flex fixed top-[7rem] z-[100] left-0 bg-white p-2 shadow-lg rounded-lg items-center space-x-4">
        <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="z-[100] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
            <h2 className="text-2xl font-bold mb-4">
              Confirm Monogram Details
            </h2>

            <div className="space-y-2">
              {/* {Object.entries(shirt).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key}:</span>
                      <span>{value.name}</span>
                    </div>
                  )
              )} */}
              <div className="flex justify-between text-lg font-bold mt-4">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!isSubmitted ? (
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleCreateMonogram}
                  className="w-1/2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between space-x-4">
                <Link
                  href="/monogram"
                  className="w-1/2 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Add Monogram
                </Link>
                <Link
                  href="/measurement"
                  className="w-1/2 text-center bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Don't Add
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 mt-6 w-full md:w-[40%] xl:w-[30%] bg-white h-full flex flex-col justify-start items-center shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Shirt Customizer
        </h2>

        <div className="flex flex-col justify-center w-full">
          {sections.map((section) => (
            <div
              key={section}
              className={`flex flex-col justify-center items-center w-full p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                activeSection === section ? "bg-gray-300" : ""
              }`}
              onClick={() => setActiveSection(section as keyof ProductData)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          ))}
        </div>

        {activeSection && (
          <div className="mt-[6.5rem] fixed right-0 top-0 h-full lg:w-[30%] w-[80%] md:w-[50%] bg-white shadow-2xl overflow-y-auto transition-transform transform translate-x-0 z-[100] border-l border-gray-200">
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
    </div>
  );
};

export default MonogramCustomiser;
