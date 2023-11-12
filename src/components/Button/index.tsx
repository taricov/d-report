export const Button = ({onClickFunc, text, loading, btnFor, color, disabled = false, type= "button"}:{onClickFunc?: () => void, text: string, loading: boolean, btnFor: string, color?: string, disabled?:boolean, type?: "button" | "submit" | "reset" | undefined}) => {

// const selectedColor = `${color} hover:${color}/90` 

    return (

        <>
        
<button disabled={disabled} onClick={onClickFunc} type={type} className={` disabled:bg-gray-400/80 disabled:text-gray-200/40 text-white transition duration-150 shadow-md ${color} font-medium rounded-lg text-sm my-4 px-5 py-2.5 text-center inline-flex items-center outline-none`}>
  
  
  {loading && btnFor === "building" ? <svg fill="currentColor" style={{transform:"rotateX(180deg)"}} version="1.1" id="Layer_1" x="0px" y="0px"
     className="inline w-4 h-4 mr-3 fill-white" viewBox="0 0 24 24">
    <rect x="0" y="0" width="4" height="7" fill="">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0s" dur="0.6s" repeatCount="indefinite" />       
    </rect>

    <rect x="10" y="0" width="4" height="7" fill="">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0.2s" dur="0.6s" repeatCount="indefinite" />       
    </rect>
    <rect x="20" y="0" width="4" height="7" fill="">
      <animateTransform  attributeType="xml"
        attributeName="transform" type="scale"
        values="1,1; 1,3; 1,1"
        begin="0.4s" dur="0.6s" repeatCount="indefinite" />       
    </rect>
  </svg> 
  : !loading && btnFor === "building" ?
    <svg className={`inline w-4 h-4 mr-3 fill-white ${disabled && "pointer-events-none fill-slate-100/50"}`} viewBox="0 0 2048 2048"><path fill="" d="M896 1920h128v128H0v-128h128v-832q0-76 28-143t76-119t114-84t142-37l608-627q35-36 82-57t98-21q36 0 72 10t68 29t57 46t41 61l384 858q17 37 17 83q0 40-14 75t-40 61t-61 42t-75 15q-57 0-104-31t-71-83l-251-562l-408 421q2 16 3 31t2 32v832zm498-1414l198 440l117-50l-220-493q-19 29-45 54t-50 49zm394 581q0-20-9-38t-17-36l-118 50q7 15 13 30t15 29t21 21t33 9q27 0 44-19t18-46zM644 727q62 23 113 65t85 99l530-546q18-19 27-42t9-49q0-26-10-49t-27-40t-40-27t-49-10q-56 0-94 39L644 727zM256 1920h512v-832q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100v832zm256-896q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10zm0 128h64h-64zm896 640v-128h640v128h-640zm0-384h640v128h-640v-128zm-256 128v-128h128v128h-128zm256 512v-128h640v128h-640zm-256 0v-128h128v128h-128zm0-256v-128h128v128h-128z"/></svg>
  : loading && ["fetching", "submitting"].includes(btnFor) ? 
  <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg> 
    : !loading && btnFor === "fetching" ? 
    <svg className={`${disabled && "pointer-events-none fill-slate-100/50"} inline w-5 mr-3 fill-white`}  viewBox="0 0 24 24"><path fill="" d="M9 4h6v8h4.84L12 19.84L4.16 12H9V4Z"/></svg>
  : null}
  {text}
{btnFor === "go-to-reports" &&
<svg className="inline w-5 ml-1 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-right-bold</title><path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" /></svg>
}
</button>
        </>
    )
}