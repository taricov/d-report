const Chip = ({...colData}:{[key: string]: string}) => {
  return (
    <>
      <span className={`${colData.bgColor} ${colData.isNull ? "line-through": ""} h-fit w-fit text-slate-800 text-xs border border-slate-600/30 font-medium px-2.5 py-0.5 rounded-full capitalize`}>{colData.columnName.split("_").join(" ")}</span>
    </>
  );
};

export default Chip;
