import React from "react";

type Props = {
  children?: React.ReactNode;
  data: {
    id: number;
    uuid: string;
    title: string;
    subtitle: string;
    updatedAt: string;
  };
};


const Card = ({text, idx, bgColor}:{text:string, idx: number, bgColor: string}) => {
  return (
    <div className="shadow-lg flex w-full cursor-pointer">
      {/* <div className="rounded-l-md p-5 w-36 bg-blue-200">
        <img src="./card.svg" alt="Ícone padrão de item do card" />
      </div> */}

      <main className={`py-3 rounded-md shadow px-5 rounded-r-md w-full text-black ${bgColor}`}>
        <span className="flex flex-row justify-between">
        <sub className="">{idx+1}</sub>
          
          {/* <h4 className="uppercase font-normal">{data.subtitle}</h4>
          <p>{data.updatedAt}</p> */}
        </span>
        <h1 className="font-bold text-md text-center capitalize">{text.split("_").join(" ")}</h1>
      </main>
    </div>
  );
};

export default Card;
