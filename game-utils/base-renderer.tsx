export function renderBase(base: string, index: number) {
  let className =
    "inline-block w-10 h-10 text-center leading-10 mx-1 rounded-lg font-bold font-mono text-lg shadow-lg ";

  switch (base) {
    case "A":
      className += "bg-gradient-to-br from-rose-400 to-rose-600 text-white";
      break;
    case "T":
      className += "bg-gradient-to-br from-sky-400 to-sky-600 text-white";
      break;
    case "G":
      className +=
        "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white";
      break;
    case "C":
      className += "bg-gradient-to-br from-amber-400 to-amber-600 text-white";
      break;
  }

  return (
    <span key={index} className={className}>
      {base}
    </span>
  );
}
