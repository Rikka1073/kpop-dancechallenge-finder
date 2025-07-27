import { CirclePlus, House, Search, User } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="navbar shadow-sm">
      <div className="flex-1">
        <Link href="/" className="link text-xl text-black no-underline">
          K-POP Challenge
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal hidden gap-2 px-1 sm:flex">
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
          <li>
            <Link
              href="/search"
              className="link transform rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white no-underline shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
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
