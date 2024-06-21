import React from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMore2Fill,
} from "react-icons/ri";
import { Link } from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";

const Header = ({ setShowSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

  return (
      <header
          className="fixed left-0 top-0 md:ml-64 w-full md:w-[calc(100%-256px)] bg-[#0A0A0A]/90 flex items-center justify-between p-4 z-40">
        <div>
          <RiMore2Fill
              onClick={() => setShowSidebar(true)}
              className="text-2xl hover:cursor-pointer p-2 box-content md:hidden"
          />
          <div className="hidden md:flex items-center gap-2 text-2xl">
            <RiArrowLeftSLine className="p-2 box-content hover:cursor-pointer bg-main-gray rounded-full text-white" onClick={() => navigate(-1)}/>
            <RiArrowRightSLine className="p-2 box-content hover:cursor-pointer bg-main-gray rounded-full text-white" onClick={() => navigate(1)}/>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
              <>
                  <Link to="/profile" className="hover:text-white transition-colors">
                  <span className="text-white font-bold">Hello, {localStorage.getItem('username')}</span>
                </Link>
                  <button
                      onClick={logout}
                      className="py-2 md:py-3 px-4 rounded-full text-side-bub bg-white font-medium hover:scale-105 transition-transform text-black"
                  >
                      Logout
                  </button>
              </>
          ) : (
              <>
                  <Link to="/signup" className="hover:text-white transition-colors">
                  Sign Up
                </Link>
                <Link
                    to="/signin"
                    className="py-2 md:py-3 px-4 rounded-full text-side-bub bg-white font-medium hover:scale-105 transition-transform text-black"
                >
                  Sign In
                </Link>
              </>
          )}
        </div>
      </header>
  );
};

export default Header;
