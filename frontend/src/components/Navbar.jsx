import { LayoutTemplate } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ProfileInfoCard } from "./Cards";
import { landingPageStyles } from "../assets/dummystyle";

const Navbar = () => {
  return (
    <header className={landingPageStyles.header}>
      <div className={landingPageStyles.headerContainer}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>

          <span className="text-xl sm:text-2xl font-black bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Resume Builder
          </span>
        </Link>

        {/* Profile Info */}
        <ProfileInfoCard />
      </div>
    </header>
  );
};

export default Navbar;
