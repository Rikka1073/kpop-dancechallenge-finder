import { House, Search, User } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="navbar shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn bg-white text-xl text-black">
          daisyUI
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal hidden gap-2 px-1 sm:flex">
          <li>
            <Link href="/" className="btn border-none bg-white shadow-none hover:text-purple-400">
              <House />
              ホーム
            </Link>
          </li>
          <li>
            <Link href="/search" className="btn border-none bg-white shadow-none hover:text-purple-400">
              <Search />
              検索
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              className="btn transform rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
              <User />
              ログイン
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
