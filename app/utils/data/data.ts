// import { Button } from '@/app/components/ui/button';
export interface DD_Option {
  name: string;
  id: number;
  price: number; // price for each option
  imageUrl1: string; // image 1 URL for each option
  imageUrl2: string; // image 2 URL for each option
  imageAlt1: string; // alt text for image 1
  imageAlt2: string; // alt text for image 2
}

export const collarStyles: DD_Option[] = [
  {
    name: "Spread Collar",
    id: 1,
    price: 20,
    imageUrl1: "/images/blue/collar_1.png",
    imageUrl2: "/images/blue/collar_1.png",
    imageAlt1: "Spread Collar - Front View",
    imageAlt2: "Spread Collar - Side View",
  },
  {
    name: "Prince Charlie",
    id: 2,
    price: 25,
    imageUrl1: "/images/blue/collar_2.png",
    imageUrl2: "/images/blue/collar_2.png",
    imageAlt1: "Prince Charlie Collar - Front View",
    imageAlt2: "Prince Charlie Collar - Side View",
  },
  {
    name: "Madmen",
    id: 3,
    price: 30,
    imageUrl1: "/images/blue/collar_3.png",
    imageUrl2: "/images/blue/collar_3.png",
    imageAlt1: "Madmen Collar - Front View",
    imageAlt2: "Madmen Collar - Side View",
  },
  {
    name: "Bandhgala",
    id: 4,
    price: 28,
    imageUrl1: "/images/blue/collar_4.png",
    imageUrl2: "/images/blue/collar_4.png",
    imageAlt1: "Bandhgala Collar - Front View",
    imageAlt2: "Bandhgala Collar - Side View",
  },
];

export const sleeveStyles: DD_Option[] = [
  // ... your sleeve styles with imageAlt1 and imageAlt2
  {
    name: "Spread Collar",
    id: 1,
    price: 20,
    imageUrl1: "/images/blue/sleeves_1.png",
    imageUrl2: "/images/blue/sleeves_1.png",
    imageAlt1: "Spread Collar - Front View",
    imageAlt2: "Spread Collar - Side View",
  },
  {
    name: "Prince Charlie",
    id: 2,
    price: 25,
    imageUrl1: "/images/blue/sleeves_2.png",
    imageUrl2: "/images/blue/sleeves_2.png",
    imageAlt1: "Prince Charlie Collar - Front View",
    imageAlt2: "Prince Charlie Collar - Side View",
  },
  {
    name: "Madmen",
    id: 3,
    price: 30,
    imageUrl1: "/images/blue/sleeves_3.png",
    imageUrl2: "/images/blue/sleeves_3.png",
    imageAlt1: "Madmen Collar - Front View",
    imageAlt2: "Madmen Collar - Side View",
  },
];

export const cuffStyles: DD_Option[] = [
  // ... your cuff styles with imageAlt1 and imageAlt2
];

export const pocketStyles: DD_Option[] = [
  {
    name: "Spread Collar",
    id: 1,
    price: 20,
    imageUrl1: "/images/blue/pocket_1.png",
    imageUrl2: "/images/blue/pocket_1.png",
    imageAlt1: "Spread Collar - Front View",
    imageAlt2: "Spread Collar - Side View",
  },
  {
    name: "Prince Charlie",
    id: 2,
    price: 25,
    imageUrl1: "/images/blue/pocket_2.png",
    imageUrl2: "/images/blue/pocket_2.png",
    imageAlt1: "Prince Charlie Collar - Front View",
    imageAlt2: "Prince Charlie Collar - Side View",
  },
  {
    name: "Madmen",
    id: 3,
    price: 30,
    imageUrl1: "/images/blue/pocket_3.png",
    imageUrl2: "/images/blue/pocket_3.png",
    imageAlt1: "Madmen Collar - Front View",
    imageAlt2: "Madmen Collar - Side View",
  }, // ... your pocket styles with imageAlt1 and imageAlt2
];

export const fitStyles: DD_Option[] = [
  // ... your fit styles with imageAlt1 and imageAlt2
];
export const BodyStyles: DD_Option[] = [
  // ... your fit styles with imageAlt1 and imageAlt2
  {
    name: "Spread Collar",
    id: 1,
    price: 20,
    imageUrl1: "/images/blue/body.png",
    imageUrl2: "/images/blue/body.png",
    imageAlt1: "Spread Collar - Front View",
    imageAlt2: "Spread Collar - Side View",
  },
];
export const ButtonStyles: DD_Option[] = [
  {
    name: "Spread Collar",
    id: 1,
    price: 20,
    imageUrl1: "/images/blue/button_holder.png",
    imageUrl2: "/images/blue/button_holder.png",
    imageAlt1: "Spread Collar - Front View",
    imageAlt2: "Spread Collar - Side View",
  },
  {
    name: "Prince Charlie",
    id: 2,
    price: 25,
    imageUrl1: "/images/blue/buttons.png",
    imageUrl2: "/images/blue/buttons.png",
    imageAlt1: "Prince Charlie Collar - Front View",
    imageAlt2: "Prince Charlie Collar - Side View",
  },
];

export const categories = [
  { name: "Body", id: 1 },
  { name: "Collar", id: 2 },
  { name: "Sleeves", id: 3 },
  { name: "Cuff", id: 4 },
  { name: "Pocket", id: 5 },
  { name: "Fit", id: 6 },
  { name: "Button", id: 7 },
];
