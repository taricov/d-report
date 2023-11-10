import { useEffect, useState } from "react";

export default function Header(){

  const [show, setShow] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

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
  }, [lastScrollY]);



    return (
      <header
      className={`${show && '-translate-y-24'} transition duration-200 fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md bg-slate-600 py-3 shadow-lg backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg border border-slate-200`}>
      <div className="px-4">
          <div className="flex items-center">
              <div className="flex shrink-0">
                  <a aria-current="page" className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50 items-center" href="/">
                      {/* <img className="h-7 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt=""/> */}
                      <p className="sr-only">Website Title</p>
                      Home
                  </a>
              </div>
              <div className="md:flex md:gap-5 flex-1">
                  <a aria-current="page"
                      className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50"
                      href="/about">How it works</a>
                  <a className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-slate-200 transition-all duration-200 hover:text-slate-50"
                      href="https://linkedin.com/in/taricov">Author</a>
              </div>
              <div className="flex items-center justify-end gap-3">
                  <a className="items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-300 shadow-light-200 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 sm:inline-flex"
                      href="/connect">Connect</a>
              </div>
          </div>
      </div>
  </header>
    )
}