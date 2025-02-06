import Image from "next/image";

const DiverseShirt = () => {
  const fabrics = [
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758193/istockphoto-1006307354-612x612_mu0ymn.webp",
      alt: "Fabric 1",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758184/photo-1619459074324-33d5f591c53e_exqzrf.avif",
      alt: "Fabric 2",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758172/premium_photo-1674747087104-516a4d6d316c_y8a3hj.avif",
      alt: "Fabric 3",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758197/photo-1631663026797-0622bf8ccb13_ongbhh.avif",
      alt: "Fabric 4",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758202/photo-1613878420618-662a804d442f_lj2tpl.avif",
      alt: "Fabric 5",
    },
    {
      src: "https://res.cloudinary.com/dlxpcyiin/image/upload/v1738758156/photo-1594734415578-00fc9540929b_cazgip.avif",
      alt: "Fabric 6",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-play text-[#646464] mb-10 text-center">
        New Fabrics
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 ">
        {fabrics.map((fabric, index) => (
          <div key={index} className="group bg-black rounded-lg transition-all duration-500 overflow-hidden relative flex justify-center items-center flex-col">
            
          <Image
            src={fabric.src}
            alt={fabric.alt}
            width={1200}
            height={1200}
            className="object-cover w-full h-[250px] group-hover:scale-105 transition-transform duration-300"
          />
        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
        ))}
      </div>
    </div>
  );
};

export default DiverseShirt;
