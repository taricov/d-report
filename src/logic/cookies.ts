// import Cryptr from "cryptr";
import Cookies from "js-cookie";


const encrypteData = (data:string) => {
    // const encyptor = new Cryptr()
    // const encyptor = Cryptr.encrypte(data)

//     const encrypted = data
//     console.log(data, encrypted)
//     return encrypted;
}  
// const decryptData = () => {
//     const bytes = CryptoJS.AES.decrypt(text, secretPass);
//     const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     setDecrptedData(data);
//   };

export const cookieHandler = {
setter(siteSubdomain:string, siteAPIKey: string){
    Cookies.set("site_subdomain", JSON.stringify(encrypteData(siteSubdomain)), { expires: 60 })
    Cookies.set("site_api_key", JSON.stringify(encrypteData(siteAPIKey)), { expires: 60 })
    return "cookie has been set";
},
getter(cookieName:string){
return Cookies.get(cookieName)
}
}