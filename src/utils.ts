import { HabbitRecord, HeatmapData } from "./types";

export const getHeaders = (token: string | null): Headers => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if(token) {
        myHeaders.append('Authorization', `Bearer ${token}`)
    }
    myHeaders.append('Accept', 'application/json')
    return myHeaders
}

export const hexToRgba = (hex: string, alpha: number) => {
    hex = hex.replace("#", "");
  
    if (hex.length === 3) {
      hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
    }
  
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  export const getDataForHeatmap = (records: HabbitRecord[]) => {

    const trimmedRecords = records.slice(-364)

    const data: HeatmapData = [];
    const nCol = 52;
    const nRow = 7; 
    let counter = -1;
    for (let x = 0; x < nCol; x++) {
        for (let y = 0; y < nRow; y++) {
          counter++;
          const value = trimmedRecords[counter].repetitions === 0 ? 0.01 : trimmedRecords[counter].repetitions
          data.push({
            x: alphabet[x],
            y: alphabet[y],
            value,
          });
        }
      }

      return data
  }