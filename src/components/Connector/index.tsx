export default function Connector({showed}:{showed: boolean}){

    return (
        <>
        <div className={`${showed && "translate-y-12"} bg-slate-300 fixed top-20 left-1/2 transform transition duration-200 -translate-y-[140%] -translate-x-1/2 shadow-lg rounded-lg overflow-hidden mx-auto w-10/12 md:w-[800px]`}>

        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to D-Report!</h2>
            <p className="text-gray-700 mb-6 capitalize">Conncect your Daftra ERP account </p>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="subdomain">
            Subdomain
          </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="subdomain" type="text" placeholder="subdomain"/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="apikey">
            API Key
          </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="apikey" type="apikey" placeholder="Password"/>
                </div>
                <div className=" items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Connect
          </button>
                    <a className="block align-baseline my-2 transition duration-300 text-xs underline text-blue-500 hover:text-blue-800" href="/">Don't know how to get your subdomain and API key?             
                      </a>
                </div> 
            </form>
    </div>
</div>
        </>
    )
}