import Image from "next/image";

const Shirts = () => {
  const fabrics = [
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758521/compress_0921-ovrsh113-cream__1_mayemo.webp",
      alt: "Fabric 1",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758516/compress_1221-sh151-cream__1_q0l09s.webp",
      alt: "Fabric 2",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758507/compress_0821-shdo98-blue__1_ihqp6a.webp",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758502/compress_1220-sh60-1-navy__1_ft2pws.webp",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758500/compress_1122-shdctwyd-03-multicolor__1_cboq6u.webp",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758496/compress_0722-sh308-1-navy__1_pqtxs2.jpg",
      alt: "Fabric 6",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758492/compress_0123-shydch-31-blue__1_urtjxp.webp",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758488/compress_1121-shpo131-1-white__1_oxhfmj.webp",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758481/6b9c7688-7ca2-4d11-9e5b-a3745ecd8f761569310358973-The-Indian-Garage-Co-Men-Shirts-8481569310357131-1_lkyl1m.webp",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758471/compress_1122-shbccpyd-04-yellow__1_pgrybk.webp",
      alt: "Fabric 6",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 font-play" id="about">
      <h1 className="text-4xl text-[#646464] font-bold font-play mb-10 text-center">
        Discover New Shirts
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 ">
        {fabrics.map((fabric, index) => (
          <div key={index} className="group bg-black rounded-lg transition-all duration-500 overflow-hidden relative flex justify-center items-center flex-col">
          <Image
            src={fabric.src}
            alt={fabric.alt}
            width={500}
            height={500}
            className="object-cover w-full h-[250px] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>
        ))}
      </div>
      <div className="mt-12 mb-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-[#646464] mb-4">
          New Shirts available
        </h1>
        <p className="max-w-5xl text-[#505050] text-lg leading-relaxed text-center mb-7">
          From selecting the perfect fabric to choosing unique patterns and
          colors, we provide a seamless experience for crafting your ideal
          shirt. Our commitment to quality and attention to detail ensures that
          each piece is tailored to perfection. Explore our user-friendly
          interface and start designing your custom shirt today. Experience the
          satisfaction of wearing a garment that is uniquely yours.{" "}
        </p>
        <button className="bg-[#c40600] text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition duration-300">
          Buy
        </button>
      </div>
    </div>
  );
};

export default Shirts;
