

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
  
  const fabrics: Fabric[] = [
    {
      id: 1,
      name: "Silk Fabric",
      colors: [
        { name: "Crimson Red", image: "/fab3.webp", hexCode: "#DC143C" },
        { name: "Royal Blue", image: "/fab4.webp", hexCode: "#4169E1" },
        { name: "Emerald Green", image: "/fab5.webp", hexCode: "#50C878" },
      ],
    },
    {
      id: 2,
      name: "Cotton Fabric",
      colors: [
        { name: "Pure White", image: "/fab2.jpg", hexCode: "#FFFFFF" },
        { name: "Sky Blue", image: "/fab6.jpg", hexCode: "#87CEEB" },
        { name: "Olive Green", image: "/fab4.webp", hexCode: "#808000" },
      ],
    },
    {
      id: 3,
      name: "Linen Fabric",
      colors: [
        { name: "Natural Beige", image: "/fab5.webp", hexCode: "#F5F5DC" },
        { name: "Light Gray", image: "/fab2.jpg", hexCode: "#D3D3D3" },
        { name: "Dusty Rose", image: "/fab4.webp", hexCode: "#BC8F8F" },
      ],
    },
    {
      id: 4,
      name: "Silk Fabric",
      colors: [
        { name: "Crimson Red", image: "/fab3.webp", hexCode: "#DC143C" },
        { name: "Royal Blue", image: "/fab4.webp", hexCode: "#4169E1" },
        { name: "Emerald Green", image: "/fab5.webp", hexCode: "#50C878" },
      ],
    },
  ];
  
  export default fabrics;