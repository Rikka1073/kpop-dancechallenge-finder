import { House, Search, User } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm mb-10">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link href="/" className="btn hover:text-purple-400 bg-white border-none shadow-none">
              <House />
              ホーム
            </Link>
          </li>
          <li>
            <Link href="/search" className="btn hover:text-purple-400 bg-white border-none shadow-none">
              <Search />
              検索
            </Link>
          </li>
          <li>
            <Link href="/search" className="btn transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white  duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 rounded-2xl">
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
