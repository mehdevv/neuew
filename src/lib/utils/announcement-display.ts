import { format, parseISO, isAfter, isBefore, startOfToday } from "date-fns";

/**
 * Finds the closest upcoming date from an array of date strings
 * Returns the first date if all are in the past
 */
export function getClosestUpcomingDate(dates: string[] | string | undefined): {
  date: string | null;
  index: number;
} {
  if (!dates) return { date: null, index: -1 };

  const dateArray = Array.isArray(dates) ? dates : [dates];
  if (dateArray.length === 0) return { date: null, index: -1 };

  const today = startOfToday();
  let closestDate: Date | null = null;
  let closestIndex = -1;
  let minDiff = Infinity;

  // Find the closest upcoming date
  dateArray.forEach((dateStr, index) => {
    if (!dateStr || dateStr.trim() === "") return;
    try {
      // Try parsing as ISO first, then try new Date as fallback
      let date: Date;
      try {
        date = parseISO(dateStr);
      } catch {
        date = new Date(dateStr);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) return;

      if (
        isAfter(date, today) ||
        date.toDateString() === today.toDateString()
      ) {
        const diff = date.getTime() - today.getTime();
        if (diff < minDiff) {
          minDiff = diff;
          closestDate = date;
          closestIndex = index;
        }
      }
    } catch (e) {
      // Invalid date, skip
    }
  });

  // If no upcoming date found, return the first date
  if (closestDate === null) {
    try {
      const firstDate = parseISO(dateArray[0]);
      return { date: dateArray[0], index: 0 };
    } catch (e) {
      return { date: dateArray[0], index: 0 };
    }
  }

  return { date: dateArray[closestIndex], index: closestIndex };
}

/**
 * Formats a date string to a readable format (e.g., "Jan 15, 2024")
 */
export function formatDateDisplay(dateStr: string | undefined): string {
  if (!dateStr || dateStr.trim() === "") return "";
  try {
    let date: Date;
    try {
      date = parseISO(dateStr);
    } catch {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return dateStr;
    return format(date, "MMM d, yyyy");
  } catch (e) {
    return dateStr;
  }
}

/**
 * Formats a date string to a short format (e.g., "Jan 15")
 */
export function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr || dateStr.trim() === "") return "";
  try {
    let date: Date;
    try {
      date = parseISO(dateStr);
    } catch {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return dateStr;
    return format(date, "MMM d");
  } catch (e) {
    return dateStr;
  }
}

/**
 * Gets display text for dates in a card
 * Returns the closest date and count of remaining dates
 */
export function getDateDisplayText(
  dateDep: string[] | string | undefined,
  dateArv: string[] | string | undefined,
): {
  displayText: string;
  remainingCount: number;
} {
  if (!dateDep || !dateArv) {
    return { displayText: "", remainingCount: 0 };
  }

  const depArray = Array.isArray(dateDep) ? dateDep : [dateDep];
  const arvArray = Array.isArray(dateArv) ? dateArv : [dateArv];
  const totalDates = Math.max(depArray.length, arvArray.length);

  if (totalDates === 0) {
    return { displayText: "", remainingCount: 0 };
  }

  const { date: closestDep, index } = getClosestUpcomingDate(depArray);
  const closestArv = arvArray[index] || arvArray[arvArray.length - 1];

  if (!closestDep) {
    return { displayText: "", remainingCount: 0 };
  }

  const formattedDep = formatDateShort(closestDep);
  const formattedArv = formatDateShort(closestArv);
  const remainingCount = totalDates - 1;

  if (remainingCount > 0) {
    return {
      displayText: `${formattedDep} - ${formattedArv} (+${remainingCount} more)`,
      remainingCount,
    };
  }

  return {
    displayText: `${formattedDep} - ${formattedArv}`,
    remainingCount: 0,
  };
}

/**
 * Gets display text for destinations in a card
 * Shows first 2-3 destinations and "+X more" if there are more
 */
export function getDestinationDisplayText(
  destinations: string[] | string | undefined,
  maxVisible: number = 2,
): {
  displayText: string;
  remainingCount: number;
  visibleDestinations: string[];
} {
  if (!destinations) {
    return { displayText: "", remainingCount: 0, visibleDestinations: [] };
  }

  const destArray = Array.isArray(destinations)
    ? destinations
    : [destinations].filter(Boolean);

  if (destArray.length === 0) {
    return { displayText: "", remainingCount: 0, visibleDestinations: [] };
  }

  const visibleDestinations = destArray.slice(0, maxVisible);
  const remainingCount = Math.max(0, destArray.length - maxVisible);

  if (remainingCount > 0) {
    return {
      displayText: `${visibleDestinations.join(", ")} +${remainingCount} more`,
      remainingCount,
      visibleDestinations,
    };
  }

  return {
    displayText: destArray.join(", "),
    remainingCount: 0,
    visibleDestinations: destArray,
  };
}
