/* eslint no-use-before-define: 0 */
"use client";
import {
  User,
  Menu,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";;
import { useState } from "react";
// import SearchModal from "@/app/components/searchModal/SearchModal";
import Link from "next/link";
// import AccountPopUp from "@/app/components/accountPopUp/AccountPopUp";
import CartDrawer from "@/app/components/cartDrawer/CartDrawer";
import { hamburgerMenuState } from "@/app/utils/data/store";
import { useAtom, useStore } from "jotai";
import Image from "next/image";

const Navbar = () => {
//   const [open, setOpen] = useState(false);
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState, {
    store: useStore(),
  });

  // Manage submenu visibility
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleOnClickHamburgerMenu = () => {
    setHamMenuOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const toggleSubmenu = (name: any) => {
    if (activeSubmenu === name) {
      setActiveSubmenu(null); // Close submenu if it's already open
    } else {
      setActiveSubmenu(name); // Open the clicked submenu
    }
  };

  return (
    <nav className="w-full bg-white shadow-lg shadow-black/50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          <div className="flex items-center lg:w-1/3">
            <Sheet open={hamMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="lg:hidden mr-2"
                  onClick={() => handleOnClickHamburgerMenu()}
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"left"}
                className="w-[300px] sm:w-[400px] overflow-y-auto"
              >
                <div className="flex items-center space-x-4 mb-2">
                  <User
                    size={40}
                    className="border-2 border-black p-1 rounded-full"
                  />
                  <div className="">
                    <p className="text-sm font-medium">Download our app</p>
                    <p className="text-sm text-muted-foreground">
                      and get 10% OFF!
                    </p>
                  </div>
                </div>
                <Button className="w-full mb-2 bg-red-400 hover:bg-red-500 text-white rounded-none">
                  Download App
                </Button>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    value={"outline"}
                    className="flex text-black items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none"
                  >
                    <Package size={20} />
                    <span>MY ORDERS</span>
                  </Button>
                  <Button
                    value={"outline"}
                    className="flex text-black items-center justify-center space-x-2 bg-[#E4E4E4] rounded-none"
                  >
                    <Truck size={20} />
                    <span>TRACK ORDER</span>
                  </Button>
                </div>
                {/* Menu items with submenus */}
               
              </SheetContent>
            </Sheet>

            {/* For larger screens */}
            <div className="hidden lg:block w-full max-w-xs">
              {/* <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  onClick={() => setOpen(true)}
                  className="pl-10 pr-4 py-2 w-full border-b-2 border-black"
                />
                {open && <SearchModal setOpen={setOpen} />}
              </div> */}
              <Link href={"/"}>
              <Image src={'/Logo.jpeg'} alt="logo" width={100} height={100}/>
            </Link>
            </div>
          </div>

          {/* <div className="flex-1 flex items-center justify-center lg:w-1/3">
            
          </div> */}

          <div className="flex items-center justify-end lg:w-1/3">
            {/* <div>
              <AccountPopUp />
            </div> */}
            <CartDrawer />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
