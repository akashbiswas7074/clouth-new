"use client";
import {
  updateShirtIds,
} from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMonogram } from "@/lib/database/actions/admin/ShirtArea/MonogramUser/monogramuser.actions";
import useMonogramData from "@/hooks/monogram-details";

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
  // placket?: ProductItem[];
  // pocket?: ProductItem[];
  // sleeves?: ProductItem[];
  // fit?: ProductItem[];
  // collarStyle?: ProductItem[];
  // collarHeight?: {
  //   _id: string;
  //   name: string;
  //   icon: { url: string };
  //   price: number;
  // }[];
  // collarButton?: ProductItem[];
  // cuffStyle?: ProductItem[];
  // cuffLinks?: ProductItem[];
}
interface MonoItem {
  name: string;
  image: string;
  price: number;
}

interface Monogram {
  monogramStyle?: MonoItem;
  monogramPosition?: MonoItem;
  // placket?: ShirtItem;
  // pocket?: ShirtItem;
  // collarStyle?: ShirtItem;
  // collarHeight?: ShirtItem;
  // collarButton?: ShirtItem;
  // cuffStyle?: ShirtItem;
  // cuffLinks?: ShirtItem;
  // fit?: ShirtItem;
  // sleeves?: ShirtItem;
}

const MonogramCustomizer = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, loading } = useMonogramData() as {
    data: ProductData;
    loading: boolean;
  };

  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  // const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
  //   null
  // );
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: ProductItem;
  }>({});
  const [watchCompatible, setWatchCompatible] = useState(false);
  const [isCollarOpen, setIsCollarOpen] = useState(true);
  const [isCuffOpen, setIsCuffOpen] = useState(true);
  const [longSleeveSelected, setLongSleeveSelected] = useState(false);
  const [isBackPopupOpen, setIsBackPopupOpen] = useState(false);
  const [selectedBackImage, setSelectedBackImage] = useState<string | null>(
    null
  );
  const [mono, setMono] = useState<Monogram>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
    null
  );

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

  // const handleAddMonogram = () => {
  //   router.push("/monogram");
  // };

  // const handleSkipMonogram = () => {
  //   router.push("/measurement");
  // };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCreateMonogram = async () => {
    const price = totalPrice;
    try {
      const monoData = {
        style: mono.monogramStyle || {},
        position: mono.monogramPosition || {},
        text,
        color,
      };

      const response = await createMonogram(
        price,
        monoData.style,
        monoData.position,
        text,
        color
      );

      if (response.success) {
        // Get shirtId from localStorage
        const shirtId = localStorage.getItem("shirtId");

        if (shirtId) {
          const monogramId = response.monogram._id; // Assuming the monogram response contains the monogram's ID

          // Update the shirt with the monogramId
          const updateResponse = await updateShirtIds(shirtId, monogramId);

          if (updateResponse.success) {
            toast.success(
              "Shirt created and updated with monogram successfully!"
            );
          } else {
            toast.error(updateResponse.message || "Failed to update shirt.");
          }
        } else {
          toast.error("Shirt ID not found in localStorage.");
        }

        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to create the shirt.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  const assignItemToSection = (section: keyof Monogram, item: ProductItem) => {
    setMono((prev) => {
      const updatedShirt = {
        ...prev,
        [section]: {
          name: item.name,
          // image: item.image?.url,
          price: item.price,
        },
      };
      return updatedShirt;
    });
  };

  const calculateTotalPrice = (items: Record<string, ProductItem>) => {
    return Object.values(items).reduce(
      (total, item) => total + (item.price || 0),
      0
    );
  };

  useEffect(() => {
    console.log(mono);
  }, [mono]);

  useEffect(() => {
    // Set default selections without localStorage
    sections.forEach((section) => {
      // if (section === "cuffStyle" || section === "cuffLinks") return;

      if (data && data[section as keyof ProductData]?.length) {
        const defaultItem = data[section as keyof ProductData]![0];
        assignItemToSection(section as keyof Monogram, defaultItem); // Assign to the shirt object

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
    assignItemToSection(section as keyof Monogram, item); // Assign to the shirt object

    // if (section === "sleeves" && item.name.toLowerCase().includes("long")) {
    //   setLongSleeveSelected(true);
    // }

    // if (section === "sleeves" && item.name.toLowerCase().includes("short")) {
    //   setLongSleeveSelected(false);
    //   setSelectedItems((prev) => {
    //     const updatedItems = { ...prev };
    //     delete updatedItems["cuffStyle"];
    //     delete updatedItems["cuffLinks"];
    //     return updatedItems;
    //   });
    // }

    // if (section === "back") {
    //   setIsBackPopupOpen(true);
    //   setSelectedBackImage(item.image?.url ?? null); // Ensure the value is either a string or null

    //   setSelectedItems((prev) => {
    //     const updatedItems = { ...prev, [section]: item };
    //     const newTotalPrice = calculateTotalPrice(updatedItems);
    //     setTotalPrice(newTotalPrice);
    //     return updatedItems;
    //   });
    //   return;
    // }

    setSelectedItems((prev) => {
      const updatedItems = { ...prev, [section]: item };
      const newTotalPrice = calculateTotalPrice(updatedItems);
      setTotalPrice(newTotalPrice);
      return updatedItems;
    });
  };

  // const handleToggle = () => {
  //   setWatchCompatible((prev) => !prev);
  // };

  // const toggleCollarSection = () => {
  //   setIsCollarOpen((prev) => !prev);
  // };

  // const toggleCuffSection = () => {
  //   setIsCuffOpen((prev) => !prev);
  // };

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
                zIndex: getZIndex(section, index),
              }}
            />
          ) : null
        )}
        {/* {isBackPopupOpen && selectedBackImage && (
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
        )} */}
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
            <h2 className="text-2xl font-bold mb-4">Confirm Shirt Details</h2>

            <div className="space-y-2">
              {Object.entries(mono).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key}:</span>
                      <span>{(value as MonoItem).name}</span>
                    </div>
                  )
              )}
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
                  href="/cart"
                  className="w-1/2 text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Add To Cart
                </Link>
                {/* <Link
                  href="/measurement"
                  className="w-1/2 text-center bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Don't Add
                </Link> */}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 mt-6 w-full md:w-[40%] xl:w-[30%] bg-white h-full flex flex-col justify-start items-center shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Monogram Customizer
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

          {/* Add text and color input fields */}
          <div className="mt-4 w-full px-3">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700"
            >
              Text
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mt-4 w-full px-3">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Color
            </label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 w-full"
            />
          </div>
        </div>
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
                    {/* {item.icon?.url && (
                      <img
                        src={item.icon.url}
                        alt={item.name}
                        className="w-20 h-20 object-cover mx-auto rounded-md"
                      />
                    )} */}
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

export default MonogramCustomizer;
