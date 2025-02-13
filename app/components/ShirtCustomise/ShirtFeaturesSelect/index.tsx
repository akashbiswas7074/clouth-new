"use client";
import useProductData from "@/hooks/shirt-details";
import { createShirt } from "@/lib/database/actions/admin/ShirtArea/Shirt/shirt.actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const sections = [
  "bottom",
  "back",
  "placket",
  "pocket",
  "sleeves",
  "fit",
  "collarStyle",
  "collarHeight",
  "collarButton",
  "cuffStyle",
  "cuffLinks",
];

interface ProductItem {
  _id: string;
  name: string;
  icon?: { url: string };
  image?: { url: string };
  price?: number;
}

interface ProductData {
  bottom?: ProductItem[];
  back?: ProductItem[];
  placket?: ProductItem[];
  pocket?: ProductItem[];
  sleeves?: ProductItem[];
  fit?: ProductItem[];
  collarStyle?: ProductItem[];
  collarHeight?: {
    _id: string;
    name: string;
    icon: { url: string };
    price: number;
  }[];
  collarButton?: ProductItem[];
  cuffStyle?: ProductItem[];
  cuffLinks?: ProductItem[];
}
interface ShirtItem {
  name: string;
  image: string;
  price: number;
}

interface Shirt {
  bottom?: ShirtItem;
  back?: ShirtItem;
  placket?: ShirtItem;
  pocket?: ShirtItem;
  collarStyle?: ShirtItem;
  collarHeight?: ShirtItem;
  collarButton?: ShirtItem;
  cuffStyle?: ShirtItem;
  cuffLinks?: ShirtItem;
  fit?: ShirtItem;
  sleeves?: ShirtItem;
}

const ShirtCustomizer = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { data, loading } = useProductData() as {
    data: ProductData;
    loading: boolean;
  };
  const { user } = useUser();
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
  const [shirt, setShirt] = useState<Shirt>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMonogramOptions, setShowMonogramOptions] = useState(false);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<keyof ProductData | null>(
    null
  );
  const [isPleatSelected, setIsPleatSelected] = useState(false);

  const handleConfirmAndProceed = () => {
    if (activeSection !== null) {
      let currentIndex = sections.indexOf(activeSection);

      if (currentIndex !== -1) {
        let nextIndex = currentIndex + 1;

        while (
          nextIndex < sections.length &&
          ((!longSleeveSelected &&
            ["cuffStyle", "cuffLinks"].includes(sections[nextIndex])) ||
            (isPleatSelected && sections[nextIndex] === "pocket"))
        ) {
          nextIndex++; // Skip the section if the condition matches
        }

        if (nextIndex < sections.length) {
          setActiveSection(sections[nextIndex] as keyof ProductData | null);
        } else {
          setActiveSection(null); // Close the box if it's the last section
        }
      }
    } else {
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

  const handleCreateShirt = async () => {
    const price = totalPrice;
    try {
      const colorId = localStorage.getItem("colorId");
      const fabricId = localStorage.getItem("fabricId");

      if (!colorId || !fabricId) {
        toast.error("Color ID and Fabric ID are required.");
        return;
      }

      if (!user?.id) {
        toast.error("Please login first");
        return;
      }

      const shirtData = {
        bottom: shirt.bottom || {},
        back: shirt.back || {},
        sleeves: shirt.sleeves || {},
        cuffStyle: shirt.cuffStyle || {},
        cuffLinks: shirt.cuffLinks || {},
        collarStyle: shirt.collarStyle || {},
        collarHeight: shirt.collarHeight || {},
        collarButton: shirt.collarButton || {},
        placket: shirt.placket || {},
        pocket: shirt.pocket || {},
        fit: shirt.fit || {},
      };

      console.log(shirtData);

      const response = await createShirt(
        price,
        shirtData.bottom,
        shirtData.back,
        shirtData.sleeves,
        shirtData.cuffStyle,
        shirtData.cuffLinks,
        shirtData.collarStyle,
        shirtData.collarHeight,
        shirtData.collarButton,
        shirtData.placket,
        shirtData.pocket,
        shirtData.fit,
        watchCompatible,
        colorId,
        fabricId,
        user.id
      );

      if (response.success) {
        localStorage.setItem("shirtId", response.shirt._id); // Save shirtId
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

  // const handleCreateShirt = async () => {
  //   const price = totalPrice;
  //   try {
  //     const colorId = localStorage.getItem("colorId");
  //     const fabricId = localStorage.getItem("fabricId");

  //     if (!colorId || !fabricId) {
  //       toast.error("Color ID and Fabric ID are required.");
  //       return;
  //     }

  //     const { userId: clerkId } = useAuth(); // Get clerkId from Clerk Auth
  //     if (!clerkId) {
  //       toast.error("User authentication required.");
  //       return;
  //     }

  //     const shirtData = {
  //       bottom: shirt.bottom || {},
  //       back: shirt.back || {},
  //       sleeves: shirt.sleeves || {},
  //       cuffStyle: shirt.cuffStyle || {},
  //       cuffLinks: shirt.cuffLinks || {},
  //       collarStyle: shirt.collarStyle || {},
  //       collarHeight: shirt.collarHeight || {},
  //       collarButton: shirt.collarButton || {},
  //       placket: shirt.placket || {},
  //       pocket: shirt.pocket || {},
  //       fit: shirt.fit || {},
  //     };

  //     // Create the shirt
  //     const response = await createShirt(
  //       price,
  //       shirtData.bottom,
  //       shirtData.back,
  //       shirtData.sleeves,
  //       shirtData.cuffStyle,
  //       shirtData.cuffLinks,
  //       shirtData.collarStyle,
  //       shirtData.collarHeight,
  //       shirtData.collarButton,
  //       shirtData.placket,
  //       shirtData.pocket,
  //       shirtData.fit,
  //       watchCompatible,
  //       colorId,
  //       fabricId
  //     );

  //     if (response.success) {
  //       const shirtId = response.shirt._id;
  //       localStorage.setItem("shirtId", shirtId);
  //       toast.success("Shirt created successfully!");
  //       // const cartResponse = await addShirtToCart(shirtId, clerkId);
  //       // if (cartResponse.success) {
  //       //   toast.success("Shirt added to cart successfully!");
  //       // } else {
  //       //   toast.error(cartResponse.message || "Failed to add shirt to cart.");
  //       // }

  //       setIsSubmitted(true);
  //     } else {
  //       toast.error(response.message || "Failed to create the shirt.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("An unexpected error occurred.");
  //   }
  // };

  const assignItemToSection = (section: keyof Shirt, item: ProductItem) => {
    setShirt((prev) => {
      const updatedShirt = {
        ...prev,
        [section]: {
          name: item.name,
          image: item.image?.url,
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
    console.log(shirt);
  }, [shirt]);

  useEffect(() => {
    // Set default selections without localStorage
    sections.forEach((section) => {
      if (section === "cuffStyle" || section === "cuffLinks") return;
      if (section === "placket") return;
      if (section === "back") return;

      if (data && data[section as keyof ProductData]?.length) {
        const defaultItem = data[section as keyof ProductData]![0];
        assignItemToSection(section as keyof Shirt, defaultItem); // Assign to the shirt object

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
    assignItemToSection(section as keyof Shirt, item); // Assign to the shirt object

    if (section === "sleeves" && item.name.toLowerCase().includes("long")) {
      setLongSleeveSelected(true);
    }

    if (section === "sleeves" && item.name.toLowerCase().includes("short")) {
      setLongSleeveSelected(false);
      setSelectedItems((prev) => {
        const updatedItems = { ...prev };
        delete updatedItems["cuffStyle"];
        delete updatedItems["cuffLinks"];
        return updatedItems;
      });
    }

    if (section === "placket" && item.name.toLowerCase().includes("pleat")) {
      setIsPleatSelected(true);
      setSelectedItems((prev) => {
        const updatedItems = { ...prev };
        delete updatedItems["pocket"];
        return updatedItems;
      });
    }
    if (section === "placket" && !item.name.toLowerCase().includes("pleat")) {
      // Disable pocket section if placket item includes "pleat"
      setIsPleatSelected(false);
    }

    if (section === "back") {
      setIsBackPopupOpen(true);
      setSelectedBackImage(item.image?.url ?? null); // Ensure the value is either a string or null

      // setSelectedItems((prev) => {
      //   const updatedItems = { ...prev, [section]: item };
      //   const newTotalPrice = calculateTotalPrice(updatedItems);
      //   setTotalPrice(newTotalPrice);
      //   return updatedItems;
      // });
      assignItemToSection(section as keyof Shirt, item);
      return;
    }

    setSelectedItems((prev) => {
      const updatedItems = { ...prev, [section]: item };
      const newTotalPrice = calculateTotalPrice(updatedItems);
      setTotalPrice(newTotalPrice);
      return updatedItems;
    });
  };

  const handleToggle = () => {
    setWatchCompatible((prev) => !prev);
  };

  const toggleCollarSection = () => {
    setIsCollarOpen((prev) => !prev);
  };

  const toggleCuffSection = () => {
    setIsCuffOpen((prev) => !prev);
  };

  const getZIndex = (section: string, index: number) => {
    if (section === "collarStyle") return 5;
    if (section === "collarButton") return 6;
    if (section === "cuffStyle") return 7;
    if (section === "cuffLinks") return 8;
    if (section === "placket" || section === "pocket") return 4;
    if (section === "sleeves") return 3;
    if (section === "fit") return 2;
    if (section === "bottom") return 2;
    return index;
  };

  const closeBackPopup = () => {
    setIsBackPopupOpen(false);
    setSelectedBackImage(null);
  };

  return (
    <div className="mt-[4rem] flex-col md:flex-row justify-between items-start mb-10 flex w-full h-fit">
      <div className="relative mt-[1.5rem] md:mt-0 flex justify-center items-center w-full h-[87vh]">
        {Object.entries(selectedItems).map(([section, item], index) =>
          item.image?.url ? (
            <img
              key={index}
              src={item.image.url}
              alt={item.name}
              className="absolute top-auto bottom-auto left-auto right-auto w-[90%] md:w-[40vw] h-auto object-cover rounded-none"
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

      <div className="flex md:flex fixed top-[9rem] z-[100] left-0 bg-white p-2 shadow-lg rounded-lg items-center space-x-4">
        <div className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
        <button
          onClick={handleOpenModal}
          className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="z-[100] fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              &times; {/* Cross Icon */}
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              Confirm Shirt Details
            </h2>

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
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleCreateShirt}
                  className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="w-full gap-[.4rem] flex flex-row justify-center items-center">
                {/* {!showMonogramOptions && (
                  <div className="w-full gap-[.4rem] flex flex-row items-center justify-center">
                    <Link
                      href="/measurement"
                      className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                    >
                      Add Measurement
                    </Link>
                    <button
                      className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                      onClick={() => setShowMonogramOptions(true)} // Show monogram options on click
                    >
                      Don't Add
                    </button>
                  </div>
                )} */}

                {/* Show monogram options if 'Don't Add' is clicked */}
                {!showMonogramOptions && (
                  <div className="w-full gap-[.4rem] flex flex-row items-center justify-center">
                    <Link
                      className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                      href="/monogram"
                    >
                      Add Monogram
                    </Link>
                    <Link
                      href="/measurement"
                      className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
                    >
                      No Monogram
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 mt-0 md:mt-[2rem] w-full md:w-[40%] xl:w-[30%] bg-white h-full flex flex-col justify-start items-center shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Shirt Customizer
        </h2>

        <div className="flex flex-col justify-center w-full">
          {sections
            .filter(
              (section) =>
                ![
                  "collarStyle",
                  "collarHeight",
                  "collarButton",
                  "cuffStyle",
                  "cuffLinks",
                ].includes(section)
            )
            .map((section) => {
              const isDisabled = section === "pocket" && isPleatSelected;

              return (
                <div
                  key={section}
                  className={`flex flex-col justify-center items-center w-full p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out
          ${isDisabled ? "bg-gray-200 cursor-not-allowed opacity-50" : "hover:bg-gray-100"} 
          ${activeSection === section ? "bg-gray-300" : ""}`}
                  onClick={() => {
                    if (!isDisabled) {
                      setActiveSection(section as keyof ProductData);
                    }
                  }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              );
            })}

          {/* Collar Section */}
          {["collarStyle", "collarHeight", "collarButton"].some((section) =>
            sections.includes(section)
          ) && (
            <div className="mt-4 w-full">
              <h3
                className="text-lg text-center font-semibold text-gray-700 py-2 cursor-pointer bg-gray-200 rounded-lg"
                onClick={toggleCollarSection}
              >
                Collar {isCollarOpen ? "▲" : "▼"}
              </h3>
              {isCollarOpen && (
                <div className="mt-2">
                  {["collarStyle", "collarHeight", "collarButton"].map(
                    (section) =>
                      sections.includes(section) && (
                        <div
                          key={section}
                          className={`flex flex-col justify-center items-center w-full p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                            activeSection === section ? "bg-gray-300" : ""
                          }`}
                          onClick={() =>
                            setActiveSection(section as keyof ProductData)
                          }
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cuff Section */}
          {["cuffStyle", "cuffLinks"].some((section) =>
            sections.includes(section)
          ) && (
            <div className="mt-6 w-full">
              <h3
                className="text-lg text-center font-semibold text-gray-700 py-2 cursor-pointer bg-gray-200 rounded-lg"
                onClick={toggleCuffSection}
              >
                Cuff {isCuffOpen ? "▲" : "▼"}
              </h3>
              {isCuffOpen && longSleeveSelected && (
                <div className="mt-2">
                  {["cuffStyle", "cuffLinks"].map(
                    (section) =>
                      sections.includes(section) && (
                        <div
                          key={section}
                          className={`flex flex-col justify-center items-center w-full p-3 cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-100 ${
                            activeSection === section ? "bg-gray-300" : ""
                          }`}
                          onClick={() =>
                            setActiveSection(section as keyof ProductData)
                          }
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </div>
                      )
                  )}

                  {/* Watch Compatible Button */}
                  <div className="flex items-center justify-center mt-4">
                    <span className="mr-3 text-lg font-medium text-gray-700">
                      Watch Compatible:
                    </span>
                    <button
                      onClick={handleToggle}
                      className={`py-2 px-6 rounded-full text-white font-semibold transition-all duration-200 ease-in-out ${
                        watchCompatible
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {watchCompatible ? "Yes" : "No"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeSection && (
        <div className="pb-[10rem] mt-[8rem] fixed right-0 top-0 h-full lg:w-[30%] w-[80%] md:w-[50%] bg-white shadow-2xl flex flex-col z-[100] border-l border-gray-200">
          {/* Header - Fixed at top */}
          <div className="sticky top-0 p-4 border-b flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-bold capitalize text-gray-800">
              {activeSection}
            </h3>
            <button
              onClick={() => setActiveSection(null)}
              className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
            >
              ✕
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-grow overflow-y-auto">
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
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="sticky bottom-0 p-4 border-t bg-gray-50 flex justify-between items-center space-x-4">
            <button
              onClick={() => setActiveSection(null)}
              className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmAndProceed()}
              className="bg-[#C40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300"
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

export default ShirtCustomizer;
