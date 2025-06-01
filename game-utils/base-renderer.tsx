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

export interface BaseRenderingState {
  isCompleted: boolean;
  isPartialMatch: boolean;
  isIncorrect: boolean;
  base: string;
}

export function getBaseClassName(state: BaseRenderingState): string {
  // Base class with consistent styling
  let className =
    "inline-block w-10 h-10 text-center leading-10 mx-1 my-1 rounded-lg font-bold font-mono text-lg cursor-pointer transition-all transform ";

  // Apply consistent base styles based on state
  if (state.isCompleted) {
    className +=
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white ring-2 ring-emerald-400 shadow-emerald-400/50 shadow-lg ";
  } else if (state.isPartialMatch) {
    className +=
      "bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-amber-300 shadow-amber-400/50 shadow-lg ";
  } else if (state.isIncorrect) {
    className +=
      "bg-gradient-to-br from-red-500 to-red-700 text-white ring-2 ring-red-400 shadow-red-400/50 shadow-lg ";
  } else {
    // If no special state, then apply base colors
    switch (state.base) {
      case "A":
        className +=
          "bg-gradient-to-br from-rose-300 to-rose-500 text-white hover:from-rose-400 hover:to-rose-600 hover:scale-110 hover:shadow-lg ";
        break;
      case "T":
        className +=
          "bg-gradient-to-br from-sky-300 to-sky-500 text-white hover:from-sky-400 hover:to-sky-600 hover:scale-110 hover:shadow-lg ";
        break;
      case "G":
        className +=
          "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white hover:from-emerald-400 hover:to-emerald-600 hover:scale-110 hover:shadow-lg ";
        break;
      case "C":
        className +=
          "bg-gradient-to-br from-amber-300 to-amber-500 text-white hover:from-amber-400 hover:to-amber-600 hover:scale-110 hover:shadow-lg ";
        break;
    }
  }

  return className;
}
