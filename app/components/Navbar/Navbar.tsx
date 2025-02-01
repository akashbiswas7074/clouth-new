import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-[#f5f5f0] shadow-md px-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image src={'/logo.png'} alt='logo' width={100} height={100}/>
      </div>

      <div className="flex space-x-6 text-[#4a2b2b] font-medium">
        <Link href="/about">About</Link>
        <Link href="/history">History</Link>
        <Link href="/customise">Customise</Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-10 w-10  rounded-full bg-[#e8e6da] shadow-lg flex items-center justify-center">
            <ShoppingCart className="text-[#4a2b2b] " />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">1</span>
          </div>
        </div>
        <button className="bg-[#e8e6da] text-[#4a2b2b] px-4 py-1 rounded-sm shadow-lg">Login</button>
      </div>
    </nav>
  );
}
