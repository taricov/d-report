const Chip = ({text, tableColor}:{text: string, tableColor: string}) => {

  return (
    <>
      <span className={`${tableColor} h-fit w-fit text-slate-800 text-xs border border-slate-600/30 font-medium px-2.5 py-0.5 rounded-full capitalize`}>{text.split("_").join(" ")}</span>
    </>
  );
};

export default Chip;
