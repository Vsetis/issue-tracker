import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiFillBug } from "react-icons/ai";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Issues", href: "/issues" },
];

const Navbar = () => {
  const { pathname } = useRouter();

  return (
    <div className="flex h-14 items-center gap-8 border-b px-5">
      <Link className="flex items-center gap-2 text-sm" href="/">
        <AiFillBug className="h-5 w-5" />
        <span className="font-semibold">Issue tracker</span>
      </Link>

      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            className={`${
              pathname === link.href ? "text-zinc-900" : "text-zinc-500"
            } transition-color hover:text-zinc-800`}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
