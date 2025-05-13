import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - date.getTime();

  // Convert milliseconds to minutes
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return "A l'instant";
  } else if (diffMinutes < 60) {
    return `Il y'a ${diffMinutes} minutes`;
  } else if (diffMinutes < 24 * 60) {
    const hoursAgo = Math.floor(diffMinutes / 60);
    return `Il y'a ${hoursAgo} heures`;
  } else {
    // Fallback to a default format
    return date.toLocaleString(); // Or any other format you prefer
  }
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

/// RECUPERER L'HEURE
export const convertHour = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};


export const dateDisplay = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (firstDate: Date, secondDate: Date): boolean => {
    return (
      firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate()
    );
  };

  let displayText: string;

  if (isSameDay(date, today)) {
    displayText = "Aujourd'hui";
  } else if (isSameDay(date, yesterday)) {
    displayText = 'Hier';
  } else {
    displayText = date.toLocaleDateString('fr-FR');
  }

  return displayText;
};

export function getDateHeure(isoDate: string): string {
  const date = new Date(isoDate);
  
  const jour = date.getUTCDate().toString().padStart(2, '0');
  const mois = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
  const annee = date.getUTCFullYear();

  const heures = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const secondes = date.getUTCSeconds().toString().padStart(2, '0');

  return `${jour}-${mois}-${annee} à ${heures}:${minutes}:${secondes}`;
}

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function sommeTableau(tab: Array<number>) {
  return tab.reduce((acc: number, val: number) => acc + val, 0);
}

//// POUR UN MULTIPLE FORMDATA
type Payload = {
  [key: string]: unknown
}

export const toForm = (payload: Payload): FormData => {
  const form = new FormData();

  const keys = Object.keys(payload);

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  keys.length > 0 && keys.forEach(key => {
    const value = payload[key] as string | Blob;

    if (Array.isArray(value)) {
      const keyArray = `${key}[]`;

      value.forEach((val: string | Blob) => {
        form.append(keyArray, val);
      })
    }

    form.append(key, value);
  });

  return form;
}