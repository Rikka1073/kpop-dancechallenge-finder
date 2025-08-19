"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { CirclePlus, House, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();
  console.log("Current path:", pathName);

  return (
    <div className="navbar w-full justify-between px-4 shadow-sm">
      <Link href="/" className="link text-xl text-black no-underline">
        K-POP Challenge
      </Link>
      <div className="md:flex md:w-fit md:items-center md:justify-end md:gap-4">
        <div className="fixed bottom-3 left-0 z-50 w-full px-4 md:static md:w-fit md:px-0">
          <div className="rounded-2xl bg-white shadow-lg md:bg-transparent md:shadow-none">
            <ul className="menu menu-horizontal flex w-full justify-center gap-2 px-1 md:flex-none md:justify-end md:gap-4">
              <li>
                <Link href="/" className="link no-underline hover:bg-transparent hover:text-purple-400">
                  <House />
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/search" className="link no-underline hover:bg-transparent hover:text-purple-400">
                  <Search />
                  検索
                </Link>
              </li>
              <li>
                <Link href="/register" className="link no-underline hover:bg-transparent hover:text-purple-400">
                  <CirclePlus />
                  動画登録
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className="link transform rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-bold text-white no-underline shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
