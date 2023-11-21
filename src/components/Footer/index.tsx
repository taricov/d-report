export default function Footer(){

    return (
        //   <footer className="bg-slate-700 text-center text-slate-100 py-1">
        // <p>
        //   Made with ❤️ {" "}
        //   <span>By {" "}</span>
        //   <a
        //     href="http://github.com/taricov"
        //     className="underline"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     @Taric Ov
        //   </a>
        // </p>
        // </footer>



<footer className= "dark:bg-gray-900 mt-10 mx-10">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="flex-col md:flex md:flex-row  items-center md:justify-between">
            <a href="/" className="flex flex-row items-center justify-center  mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10" viewBox="0 0 128.65 139.81"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path className="cls-1" d="M94.85,5.15,0,139.81,52.44,0H64.19Q83.17,0,94.85,5.15Z"/><polygon className="cls-2" points="52.44 0 0 139.81 0 0 52.44 0"/><path className="cls-3" d="M128.65,69.43q0,22.41-5.1,34.76a57.54,57.54,0,0,1-14.16,20.7A46.32,46.32,0,0,1,89.93,136a100.26,100.26,0,0,1-25.74,3.81H0L126.83,49.42A106.53,106.53,0,0,1,128.65,69.43Z"/><path className="cls-4" d="M126.83,49.42,0,139.81,94.85,5.15a50,50,0,0,1,19.31,14.78,61.41,61.41,0,0,1,11.06,22.42C125.85,44.67,126.38,47,126.83,49.42Z"/></g></g></svg>
                <span className="self-center text-xl text-slate-600 font-semibold whitespace-nowrap dark:text-white">D-Report</span>
            </a>
            <ul className="flex flex-wrap space-x-5 justify-center mt-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="/" className="transition duration-200 hover:text-slate-600/80 text-slate-600">About</a>
                </li>
                <li>
                    <a href="/updates" className="opacity-40 pointer-events-none select-none cursor-none transition duration-200 hover:text-slate-600/80 text-slate-600">What to come</a>
                </li>
                <li>
                    <a href="https://d-suite-website.vercel.app/" className="transition duration-200 hover:text-slate-600/80 text-slate-600">D-Suite</a>
                </li>
                <li>
                    <a href="https://linkedin.com/in/taricov" className="transition duration-200 hover:text-slate-600/80 text-slate-600">Author</a>
                </li>
            </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-3" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://github.com/taricov" className="hover:underline">Taric Ov™</a>. All Rights Reserved.</span>
    </div>
</footer>


    )
}