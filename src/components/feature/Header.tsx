"use client";
import { House, Search } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="navbar w-full justify-between px-4 shadow-sm">
      <div>
        <Link href="/" className="link text-xl text-black no-underline" data-testid="header-main-title">
          SeeKPOP
        </Link>
      </div>
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
