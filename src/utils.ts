import moment from "moment";
import { Habit, HabitRecord, HeatmapData } from "./types";
import { v4 as uuidv4 } from 'uuid';

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
    "A1",
    "B1",
    "C1",
    "D1",
    "E1",
    "F1",
    "G1",
    "H1",
    "I1",
    "J1",
    "K1",
    "L1",
    "M1",
    "N1",
    "O1",
    "P1",
    "Q1",
    "R1",
    "S1",
    "T1",
    "U1",
    "V1",
    "W1",
    "X1",
    "Y1",
    "Z1",
  ];

  export const getDataForHeatmap = (records: HabitRecord[]) => {

    const trimmedRecords = records.slice(-364)

    const data: HeatmapData = [];
    const nCol = 52;
    const nRow = 7; 
    let counter = -1;
    for (let x = 0; x < nCol; x++) {
        for (let y = 0; y < nRow; y++) {
          counter++;
          const record = trimmedRecords[counter];
          const value = record ? (record.repetitions === 0 ? 0.01 : record.repetitions) : 0.01;
          data.push({
            x: alphabet[x],
            y: alphabet[y],
            value,
          });
        }
      }
      return data
  }

  export const handleChangeModalStatus = (status: boolean, modal: string) => {
    const modalElement = document.getElementById(modal) as HTMLDialogElement | null;
    if (modalElement) {
        if (status) {
            modalElement.showModal()
        } else {
            modalElement.close()
        }
    }
}

export const generatePastRecords = (initialDate: string, habitId: string) => {
  const records: HabitRecord[] = []
  for(let i = 0; i <= 365; i++){
    const newDate = moment(initialDate, 'YYYY-MM-DD').subtract(i, 'days')
    records.push({
      id: uuidv4(),
      habitId,
      date: newDate.format('YYYY-MM-DD'),
      repetitions: 0
    })
  }
  return records.reverse()
}

export const isHabitCompleted = (habit: Habit, date: string) => {
  if (!habit.records) return false
  return habit.records.find((record: HabitRecord) => record.date === date)?.repetitions === habit.maxRepetitions
}