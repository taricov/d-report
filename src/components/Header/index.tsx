import React, { useContext, useEffect, useState } from "react";
import Connector from "../Connector";
import { UserContext } from "../../App";
import Spinner from "../Spinner";

export default function Header(){

  const [show, setShow] = useState<boolean>(true);
  const [showConnectForm, setShowConnectForm] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const userInfo = useContext(UserContext)

  const connectForm = (e: React.MouseEvent) =>{
e.stopPropagation()
    setShowConnectForm((prev)=>!prev)
  }

  const controlNavbar = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY < lastScrollY) { // if scroll down hide the navbar
        setShow(false); 
      } else { // if scroll up show the navbar
        setShow(true);  
      }

      // remember current page location to use in the next move
      setLastScrollY(window.scrollY); 
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY, showConnectForm]);



    return (
      <header
      className={`${show && '-translate-y-24'} transition duration-200 fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md bg-slate-600 py-3 shadow-lg backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg border border-slate-200`}>
      <div className="px-4">
          <div className="flex items-center">
              <div className="flex shrink-0">
              {userInfo.connected &&
                <>
                <img className="w-10" src={userInfo.siteData.siteLogoURL} alt="your site logo" />
                <span className="flex items-center px-2 py-1 text-sm font-medium text-slate-200 border-r border-r-white/60">Welcome, {userInfo.siteData.siteFirstName+ " " + userInfo.siteData.siteLastName}</span>
                </>
              }
                  <a aria-current="page" className="flex items-center rounded-lg px-3 py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50" href="/">
                      {/* <img className="h-7 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt=""/> */}
                      <p className="sr-only">Website Title</p>
                      Home
                  </a>
              </div>
              {!userInfo.connected &&
              <div className="flex gap-3 md:gap-5 flex-1">
                  <a aria-current="page"
                      className="inline-blockrounded-lg py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50"
                      href="/about">How it works</a>
                      {/* eslint-disable */}
                  <a className="inline-block rounded-lg py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50"
                      href="https://linkedin.com/in/taricov" target="_blank" >Author</a>
              </div>
              }
              {userInfo.connected &&
              <div className="flex gap-3 md:gap-5 flex-1">
                  <a aria-current="page"
                      className="inline-blockrounded-lg py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50"
                      href="/reports">Your Reports</a>
              </div>
              }
              <div className="flex items-center justify-end gap-3">
                { !userInfo.connected &&
                  <button onClick={connectForm} className="items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-300 shadow-light-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 sm:inline-flex"
                  >Connect</button>
                }
                { userInfo.connected &&
                  <div className="items-center justify-center rounded-xl bg-slate-100 shadow-light-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-150 sm:inline-flex">Connected</div>
                  
                    }
              </div>
          </div>
      </div>

      <div className={`fixed transform transition duration-200 -translate-x-1/2 -translate-y-[140%] -mt-20 h-[1000px] w-screen bg-black/50 top-1/2 left-1/2 ${showConnectForm && "-translate-y-0"}`} onClick={connectForm}>
      </div>
      <Connector showed={showConnectForm}/>

  </header>
    )
  }