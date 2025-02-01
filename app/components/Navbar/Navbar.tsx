import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#f5f5f0] shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/logo.png" alt="Stitch My Clothes" className="h-10 w-15 ml-6" />
      </div>

      <div className="flex space-x-6 text-[#4a2b2b] font-medium">
        <Link href="/about">About</Link>
        <Link href="/history">History</Link>
        <Link href="/customise">Customise</Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-10 w-10  rounded-full shadow-lg shadow-black/15 flex items-center justify-center">
            <ShoppingCart className="text-[#4a2b2b] " />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">1</span>
          </div>
        </div>
        <button className="bg-[#e8e6da] text-[#4a2b2b] px-4 py-1 rounded-sm shadow-lg shadow">Login</button>
      </div>
    </nav>
  );
}
