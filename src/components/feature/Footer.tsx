import { FileText } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} SeeKPOP. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-purple-600"
            >
              <FileText className="h-4 w-4" />
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
