import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/shirts", label: "Shirts" },
    { href: "/accessories", label: "Accessories" },
  ];

  const collectionLinks = [
    { href: "/casual", label: "Casual Collection" },
    { href: "/limited", label: "Limited Edition" },
  ];

  const exploreLinks = [
    { href: "/summer", label: "Summer Collection" },
    { href: "/formal", label: "Formal Wear" },
  ];

  return (
    <footer className="bg-[#f5f5f0] md:pt-14 md:pb-8 px-4 space-y-10">
      <div className="flex flex-col items-center justify-between lg:flex-row ">
        <div className="flex flex-row sm:space-x-20 space-x-5">
          <div>
            <h4 className="font-bold text-2xl text-[#646464] mb-2">Shop</h4>
            <ul className="text-lg text-[#505050]">
              {shopLinks.map((link) => (
                <li key={link.href} className="">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-2xl text-[#646464] mb-2">Collections</h4>
            <ul className="text-lg text-[#505050]">
              {collectionLinks.map((link) => (
                <li key={link.href} className="mb-1">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-2xl text-[#646464] mb-2">Explore</h4>
            <ul className="text-lg text-[#505050]">
              {exploreLinks.map((link) => (
                <li key={link.href} className="mb-1">
                  <Link href={link.href}>
                    <p className="hover:underline">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center md:text-left mb-4 md:mb-0 mt-10 lg:mt-0">
          <h4 className="font-bold text-end text-2xl text-[#646464] mb-2">
            Subscribe to Our Newsletter
          </h4>
          <p className="text-lg text-[#505050] mb-2">
            Stay updated with the latest fashion trends and exclusive offers
            from us.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md px-3 py-2 text-md md:w-full"
            />
            <button className="bg-black w-1/2 text-white px-4 rounded-md ml-2 hover:bg-gray-800 text-md">
              {" "}
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <hr className="border-t-1 border-black" />

      <div className="text-center">
        <p className="text-md text-[#505050]">
          © {currentYear} Stich My Clothes. All rights reserved.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2 text-md text-[#505050] justify-center">
          <Link href="/terms">
            <p className="hover:underline">Terms and Conditions</p>
          </Link>
          <Link href="/privacy">
            <p className="hover:underline">Privacy Policy</p>
          </Link>
          <Link href="/refund">
            <p className="hover:underline">Refund and Return Policy</p>
          </Link>
          <Link href="/shipping">
            <p className="hover:underline">Shipping Policy</p>
          </Link>
        </div>
        <div className="flex items-center justify-center mt-4">
          <Image
            src={"/logo 40.png"}
            alt="logo-footer"
            width={150}
            height={150}
            className="ml-4"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
