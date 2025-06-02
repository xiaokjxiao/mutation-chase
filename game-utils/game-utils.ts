// generate dna
export function generateDNA(length: number): string {
  const bases = ["A", "T", "G", "C"];
  return Array.from(
    { length },
    () => bases[Math.floor(Math.random() * bases.length)]
  ).join("");
}

// calculate speed bonus
export function calculateSpeedBonus(completionTime: number): number {
  if (completionTime <= 2) return 3.0;
  if (completionTime <= 4) return 2.5;
  if (completionTime <= 6) return 2.0;
  if (completionTime <= 8) return 1.5;
  if (completionTime <= 10) return 1.25;
  return 1.0;
}

// get base class name for rendering DNA bases
export function getBaseClassName(
  base: string,
  isCompleted: boolean,
  isPartialMatch: boolean,
  isIncorrect: boolean
): string {
  let className =
    "inline-block w-10 h-10 text-center leading-10 mx-1 my-1 rounded-lg font-bold font-mono text-lg transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg transform ";

  // Base colors with gradients
  switch (base) {
    case "A":
      className +=
        "bg-gradient-to-br from-rose-300 to-rose-500 text-white hover:from-rose-400 hover:to-rose-600 ";
      break;
    case "T":
      className +=
        "bg-gradient-to-br from-sky-300 to-sky-500 text-white hover:from-sky-400 hover:to-sky-600 ";
      break;
    case "G":
      className +=
        "bg-gradient-to-br from-emerald-300 to-emerald-500 text-white hover:from-emerald-400 hover:to-emerald-600 ";
      break;
    case "C":
      className +=
        "bg-gradient-to-br from-amber-300 to-amber-500 text-white hover:from-amber-400 hover:to-amber-600 ";
      break;
  }

  if (isCompleted) {
    className = className.replace(
      /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
      "bg-gradient-to-br from-emerald-500 to-emerald-700"
    );
    className += "ring-2 ring-emerald-400 shadow-emerald-400/50 shadow-lg ";
  } else if (isPartialMatch) {
    className = className.replace(
      /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
      "bg-gradient-to-br from-amber-400 to-amber-600"
    );
    className += "ring-2 ring-amber-300 shadow-amber-400/50 shadow-lg ";
  } else if (isIncorrect) {
    className = className.replace(
      /bg-gradient-to-br from-\w+-\d+ to-\w+-\d+/,
      "bg-gradient-to-br from-red-500 to-red-700"
    );
    className += "ring-2 ring-red-400 shadow-red-400/50 shadow-lg ";
  }

  return className;
}

// get DNA base classes
export function getDnaBaseClasses(
  base: string,
  isCompleted: boolean,
  isPartialMatch: boolean,
  isIncorrect: boolean
): string {
  // Base class with consistent styling
  let className =
    "inline-block w-10 h-10 text-center leading-10 mx-1 my-1 rounded-lg font-bold font-mono text-lg cursor-pointer transition-all transform ";

  // Apply consistent base styles based on state
  if (isCompleted) {
    className +=
      "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white ring-2 ring-emerald-400 shadow-emerald-400/50 shadow-lg ";
  } else if (isPartialMatch) {
    className +=
      "bg-gradient-to-br from-amber-400 to-amber-600 text-white ring-2 ring-amber-300 shadow-amber-400/50 shadow-lg ";
  } else if (isIncorrect) {
    className +=
      "bg-gradient-to-br from-red-500 to-red-700 text-white ring-2 ring-red-400 shadow-red-400/50 shadow-lg ";
  } else {
    // If no special state, then apply base colors
    switch (base) {
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

// get pattern base classes
export function getPatternBaseClasses(base: string): string {
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
  return className;
}
