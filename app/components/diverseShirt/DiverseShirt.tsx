
import Image from 'next/image'

const DiverseShirt = () => {
  const fabrics = [
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 1',
      
    },
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 2',
      
    },
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 3',
      
    },
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 4',
      
    },
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 5',
      
    },
    { 
      src: '/collar.jpg', 
      alt: 'Fabric 6',
      
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4"> 
      <h1 className="text-5xl font-bold mb-10 text-center"> 
        Discover New Shirts
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 "> 
        {fabrics.map((fabric, index) => (
          <div key={index} className="relative shadow-md shadow-black/30">
            <Image
              src={fabric.src}
              alt={fabric.alt}
              width={500} 
              height={500} 
              className="object-cover w-full h-full" 
            />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiverseShirt;