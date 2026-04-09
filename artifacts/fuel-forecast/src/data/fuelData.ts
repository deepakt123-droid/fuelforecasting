export type City = "Delhi" | "Mumbai" | "Chennai" | "Kolkata";
export type FuelType = "petrol" | "diesel" | "lpg";

export interface PriceRecord {
  date: string;
  delhi: number;
  mumbai: number;
  chennai: number;
  kolkata: number;
}

export interface MonthlyPrice {
  month: string;
  year: number;
  delhi: number;
  mumbai: number;
  chennai: number;
  kolkata: number;
}

export interface ForecastPoint {
  month: string;
  year: number;
  label: string;
  delhi: number;
  mumbai: number;
  chennai: number;
  kolkata: number;
  isForecasted: boolean;
}

// ── Real Petrol Data (monthly representative prices, Rs/Litre) ──
// Source: PPAC Daily Price MSHS data (Delhi, Mumbai, Chennai, Kolkata)
export const petrolHistory: MonthlyPrice[] = [
  // 2014
  { month: "Jan", year: 2014, delhi: 71.41, mumbai: 77.82, chennai: 74.05, kolkata: 74.58 },
  { month: "Feb", year: 2014, delhi: 71.41, mumbai: 77.82, chennai: 74.05, kolkata: 74.58 },
  { month: "Mar", year: 2014, delhi: 71.41, mumbai: 77.82, chennai: 74.05, kolkata: 74.58 },
  { month: "Apr", year: 2014, delhi: 71.41, mumbai: 77.82, chennai: 74.05, kolkata: 74.58 },
  { month: "May", year: 2014, delhi: 71.41, mumbai: 77.82, chennai: 74.05, kolkata: 74.58 },
  { month: "Jun", year: 2014, delhi: 73.18, mumbai: 79.70, chennai: 76.02, kolkata: 76.49 },
  { month: "Jul", year: 2014, delhi: 72.26, mumbai: 78.82, chennai: 75.11, kolkata: 75.64 },
  { month: "Aug", year: 2014, delhi: 69.26, mumbai: 75.73, chennai: 72.16, kolkata: 72.62 },
  { month: "Sep", year: 2014, delhi: 68.24, mumbai: 74.70, chennai: 71.10, kolkata: 71.57 },
  { month: "Oct", year: 2014, delhi: 66.33, mumbai: 72.64, chennai: 69.22, kolkata: 69.72 },
  { month: "Nov", year: 2014, delhi: 63.33, mumbai: 69.44, chennai: 66.12, kolkata: 66.53 },
  { month: "Dec", year: 2014, delhi: 60.48, mumbai: 66.37, chennai: 63.26, kolkata: 63.70 },
  // 2015
  { month: "Jan", year: 2015, delhi: 59.13, mumbai: 64.89, chennai: 61.75, kolkata: 62.24 },
  { month: "Feb", year: 2015, delhi: 58.36, mumbai: 64.01, chennai: 61.08, kolkata: 61.52 },
  { month: "Mar", year: 2015, delhi: 60.48, mumbai: 66.37, chennai: 63.29, kolkata: 63.75 },
  { month: "Apr", year: 2015, delhi: 62.36, mumbai: 68.37, chennai: 65.09, kolkata: 65.52 },
  { month: "May", year: 2015, delhi: 63.91, mumbai: 70.13, chennai: 66.79, kolkata: 67.25 },
  { month: "Jun", year: 2015, delhi: 65.34, mumbai: 71.77, chennai: 68.16, kolkata: 68.63 },
  { month: "Jul", year: 2015, delhi: 65.04, mumbai: 71.60, chennai: 67.84, kolkata: 68.32 },
  { month: "Aug", year: 2015, delhi: 64.20, mumbai: 70.68, chennai: 67.12, kolkata: 67.56 },
  { month: "Sep", year: 2015, delhi: 63.11, mumbai: 69.32, chennai: 65.92, kolkata: 66.38 },
  { month: "Oct", year: 2015, delhi: 60.97, mumbai: 67.17, chennai: 63.93, kolkata: 64.28 },
  { month: "Nov", year: 2015, delhi: 60.48, mumbai: 66.37, chennai: 63.26, kolkata: 63.70 },
  { month: "Dec", year: 2015, delhi: 59.78, mumbai: 65.56, chennai: 62.49, kolkata: 62.95 },
  // 2016
  { month: "Jan", year: 2016, delhi: 59.78, mumbai: 65.56, chennai: 62.49, kolkata: 62.95 },
  { month: "Feb", year: 2016, delhi: 59.13, mumbai: 64.89, chennai: 61.75, kolkata: 62.24 },
  { month: "Mar", year: 2016, delhi: 61.54, mumbai: 67.71, chennai: 64.54, kolkata: 64.99 },
  { month: "Apr", year: 2016, delhi: 63.00, mumbai: 69.29, chennai: 65.97, kolkata: 66.48 },
  { month: "May", year: 2016, delhi: 65.71, mumbai: 72.31, chennai: 68.87, kolkata: 69.42 },
  { month: "Jun", year: 2016, delhi: 66.61, mumbai: 73.35, chennai: 69.71, kolkata: 70.35 },
  { month: "Jul", year: 2016, delhi: 67.58, mumbai: 74.44, chennai: 70.60, kolkata: 71.35 },
  { month: "Aug", year: 2016, delhi: 66.25, mumbai: 72.90, chennai: 69.34, kolkata: 70.04 },
  { month: "Sep", year: 2016, delhi: 65.31, mumbai: 71.81, chennai: 68.37, kolkata: 68.96 },
  { month: "Oct", year: 2016, delhi: 66.36, mumbai: 73.02, chennai: 69.50, kolkata: 70.19 },
  { month: "Nov", year: 2016, delhi: 68.27, mumbai: 75.22, chennai: 71.55, kolkata: 72.24 },
  { month: "Dec", year: 2016, delhi: 68.27, mumbai: 75.22, chennai: 71.55, kolkata: 72.24 },
  // 2017
  { month: "Jan", year: 2017, delhi: 69.87, mumbai: 77.06, chennai: 73.30, kolkata: 74.00 },
  { month: "Feb", year: 2017, delhi: 69.87, mumbai: 77.06, chennai: 73.30, kolkata: 74.00 },
  { month: "Mar", year: 2017, delhi: 65.90, mumbai: 72.44, chennai: 68.83, kolkata: 69.46 },
  { month: "Apr", year: 2017, delhi: 63.09, mumbai: 69.19, chennai: 65.53, kolkata: 66.28 },
  { month: "May", year: 2017, delhi: 61.62, mumbai: 67.62, chennai: 63.95, kolkata: 64.83 },
  { month: "Jun", year: 2017, delhi: 65.48, mumbai: 71.91, chennai: 68.23, kolkata: 68.89 },
  { month: "Jul", year: 2017, delhi: 64.35, mumbai: 70.68, chennai: 67.02, kolkata: 67.77 },
  { month: "Aug", year: 2017, delhi: 70.88, mumbai: 78.45, chennai: 74.51, kolkata: 75.30 },
  { month: "Sep", year: 2017, delhi: 70.16, mumbai: 77.66, chennai: 73.65, kolkata: 74.48 },
  { month: "Oct", year: 2017, delhi: 70.35, mumbai: 77.83, chennai: 73.81, kolkata: 74.60 },
  { month: "Nov", year: 2017, delhi: 70.98, mumbai: 78.57, chennai: 74.62, kolkata: 75.45 },
  { month: "Dec", year: 2017, delhi: 71.98, mumbai: 79.73, chennai: 75.54, kolkata: 76.47 },
  // 2018
  { month: "Jan", year: 2018, delhi: 72.58, mumbai: 80.43, chennai: 76.22, kolkata: 77.19 },
  { month: "Feb", year: 2018, delhi: 72.33, mumbai: 80.08, chennai: 75.83, kolkata: 76.86 },
  { month: "Mar", year: 2018, delhi: 73.83, mumbai: 81.73, chennai: 77.31, kolkata: 78.37 },
  { month: "Apr", year: 2018, delhi: 74.63, mumbai: 82.68, chennai: 78.13, kolkata: 79.13 },
  { month: "May", year: 2018, delhi: 76.87, mumbai: 84.99, chennai: 80.46, kolkata: 81.41 },
  { month: "Jun", year: 2018, delhi: 78.43, mumbai: 86.54, chennai: 81.62, kolkata: 82.88 },
  { month: "Jul", year: 2018, delhi: 76.87, mumbai: 84.99, chennai: 80.46, kolkata: 81.41 },
  { month: "Aug", year: 2018, delhi: 78.43, mumbai: 86.54, chennai: 81.62, kolkata: 82.88 },
  { month: "Sep", year: 2018, delhi: 82.72, mumbai: 91.34, chennai: 85.90, kolkata: 86.97 },
  { month: "Oct", year: 2018, delhi: 84.00, mumbai: 92.26, chennai: 87.27, kolkata: 87.92 },
  { month: "Nov", year: 2018, delhi: 69.73, mumbai: 77.07, chennai: 72.49, kolkata: 73.34 },
  { month: "Dec", year: 2018, delhi: 69.03, mumbai: 75.73, chennai: 71.59, kolkata: 72.10 },
  // 2019
  { month: "Jan", year: 2019, delhi: 68.98, mumbai: 75.74, chennai: 71.35, kolkata: 72.48 },
  { month: "Feb", year: 2019, delhi: 70.29, mumbai: 77.17, chennai: 72.74, kolkata: 73.66 },
  { month: "Mar", year: 2019, delhi: 72.10, mumbai: 79.20, chennai: 74.59, kolkata: 75.40 },
  { month: "Apr", year: 2019, delhi: 72.83, mumbai: 79.97, chennai: 75.33, kolkata: 76.22 },
  { month: "May", year: 2019, delhi: 71.26, mumbai: 78.28, chennai: 73.82, kolkata: 74.66 },
  { month: "Jun", year: 2019, delhi: 69.59, mumbai: 76.49, chennai: 72.11, kolkata: 73.01 },
  { month: "Jul", year: 2019, delhi: 72.17, mumbai: 79.31, chennai: 74.67, kolkata: 75.57 },
  { month: "Aug", year: 2019, delhi: 72.87, mumbai: 79.77, chennai: 75.17, kolkata: 76.04 },
  { month: "Sep", year: 2019, delhi: 73.51, mumbai: 80.55, chennai: 75.70, kolkata: 76.72 },
  { month: "Oct", year: 2019, delhi: 73.45, mumbai: 80.26, chennai: 75.66, kolkata: 76.65 },
  { month: "Nov", year: 2019, delhi: 73.56, mumbai: 80.27, chennai: 75.70, kolkata: 76.64 },
  { month: "Dec", year: 2019, delhi: 73.73, mumbai: 80.36, chennai: 75.87, kolkata: 76.77 },
  // 2020
  { month: "Jan", year: 2020, delhi: 75.18, mumbai: 82.17, chennai: 77.34, kolkata: 78.23 },
  { month: "Feb", year: 2020, delhi: 72.29, mumbai: 79.00, chennai: 74.23, kolkata: 75.25 },
  { month: "Mar", year: 2020, delhi: 69.59, mumbai: 76.31, chennai: 71.51, kolkata: 72.46 },
  { month: "Apr", year: 2020, delhi: 69.59, mumbai: 76.31, chennai: 71.51, kolkata: 72.46 },
  { month: "May", year: 2020, delhi: 71.26, mumbai: 78.28, chennai: 73.82, kolkata: 74.66 },
  { month: "Jun", year: 2020, delhi: 79.76, mumbai: 87.19, chennai: 82.13, kolkata: 83.04 },
  { month: "Jul", year: 2020, delhi: 80.43, mumbai: 87.89, chennai: 82.86, kolkata: 83.71 },
  { month: "Aug", year: 2020, delhi: 81.06, mumbai: 88.62, chennai: 83.51, kolkata: 84.44 },
  { month: "Sep", year: 2020, delhi: 81.06, mumbai: 88.62, chennai: 83.51, kolkata: 84.44 },
  { month: "Oct", year: 2020, delhi: 81.06, mumbai: 88.62, chennai: 83.51, kolkata: 84.44 },
  { month: "Nov", year: 2020, delhi: 81.06, mumbai: 88.62, chennai: 83.51, kolkata: 84.44 },
  { month: "Dec", year: 2020, delhi: 83.71, mumbai: 90.34, chennai: 86.27, kolkata: 87.09 },
  // 2021
  { month: "Jan", year: 2021, delhi: 83.71, mumbai: 90.34, chennai: 86.27, kolkata: 87.09 },
  { month: "Feb", year: 2021, delhi: 87.60, mumbai: 94.12, chennai: 90.19, kolkata: 90.76 },
  { month: "Mar", year: 2021, delhi: 90.56, mumbai: 97.00, chennai: 93.16, kolkata: 93.82 },
  { month: "Apr", year: 2021, delhi: 90.56, mumbai: 97.00, chennai: 93.16, kolkata: 93.82 },
  { month: "May", year: 2021, delhi: 92.58, mumbai: 98.81, chennai: 95.18, kolkata: 95.76 },
  { month: "Jun", year: 2021, delhi: 94.49, mumbai: 100.72, chennai: 97.15, kolkata: 97.76 },
  { month: "Jul", year: 2021, delhi: 101.84, mumbai: 107.83, chennai: 104.51, kolkata: 105.13 },
  { month: "Aug", year: 2021, delhi: 101.84, mumbai: 107.83, chennai: 104.51, kolkata: 105.13 },
  { month: "Sep", year: 2021, delhi: 101.84, mumbai: 107.83, chennai: 104.51, kolkata: 105.13 },
  { month: "Oct", year: 2021, delhi: 106.54, mumbai: 112.51, chennai: 109.22, kolkata: 109.79 },
  { month: "Nov", year: 2021, delhi: 95.41, mumbai: 101.55, chennai: 98.13, kolkata: 98.61 },
  { month: "Dec", year: 2021, delhi: 95.41, mumbai: 101.55, chennai: 98.13, kolkata: 98.61 },
  // 2022
  { month: "Jan", year: 2022, delhi: 95.41, mumbai: 101.55, chennai: 98.13, kolkata: 98.61 },
  { month: "Feb", year: 2022, delhi: 95.41, mumbai: 101.55, chennai: 98.13, kolkata: 98.61 },
  { month: "Mar", year: 2022, delhi: 95.41, mumbai: 101.55, chennai: 98.13, kolkata: 98.61 },
  { month: "Apr", year: 2022, delhi: 105.41, mumbai: 120.51, chennai: 110.85, kolkata: 115.12 },
  { month: "May", year: 2022, delhi: 105.41, mumbai: 120.51, chennai: 110.85, kolkata: 115.12 },
  { month: "Jun", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Jul", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Aug", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Sep", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Oct", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Nov", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Dec", year: 2022, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  // 2023
  { month: "Jan", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Feb", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Mar", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Apr", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "May", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Jun", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Jul", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Aug", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Sep", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Oct", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Nov", year: 2023, delhi: 96.72, mumbai: 111.35, chennai: 102.63, kolkata: 106.03 },
  { month: "Dec", year: 2023, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  // 2024
  { month: "Jan", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Feb", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Mar", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Apr", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "May", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Jun", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Jul", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Aug", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Sep", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Oct", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Nov", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Dec", year: 2024, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  // 2025
  { month: "Jan", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Feb", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Mar", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Apr", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "May", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Jun", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Jul", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Aug", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Sep", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Oct", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Nov", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Dec", year: 2025, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  // 2026 (current - April 2026)
  { month: "Jan", year: 2026, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Feb", year: 2026, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Mar", year: 2026, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
  { month: "Apr", year: 2026, delhi: 94.77, mumbai: 103.54, chennai: 100.84, kolkata: 105.45 },
];

// ── Real Diesel Data (monthly representative prices, Rs/Litre) ──
export const dieselHistory: MonthlyPrice[] = [
  // 2014
  { month: "Jan", year: 2014, delhi: 51.40, mumbai: 58.81, chennai: 54.67, kolkata: 55.72 },
  { month: "Feb", year: 2014, delhi: 51.40, mumbai: 58.81, chennai: 54.67, kolkata: 55.72 },
  { month: "Mar", year: 2014, delhi: 51.40, mumbai: 58.81, chennai: 54.67, kolkata: 55.72 },
  { month: "Apr", year: 2014, delhi: 52.54, mumbai: 60.07, chennai: 55.82, kolkata: 56.78 },
  { month: "May", year: 2014, delhi: 53.64, mumbai: 61.27, chennai: 56.87, kolkata: 57.89 },
  { month: "Jun", year: 2014, delhi: 54.86, mumbai: 62.77, chennai: 58.09, kolkata: 59.14 },
  { month: "Jul", year: 2014, delhi: 55.48, mumbai: 63.52, chennai: 58.77, kolkata: 59.82 },
  { month: "Aug", year: 2014, delhi: 53.64, mumbai: 61.27, chennai: 56.87, kolkata: 57.89 },
  { month: "Sep", year: 2014, delhi: 52.93, mumbai: 60.48, chennai: 56.16, kolkata: 57.17 },
  { month: "Oct", year: 2014, delhi: 50.56, mumbai: 57.71, chennai: 53.87, kolkata: 54.75 },
  { month: "Nov", year: 2014, delhi: 47.68, mumbai: 54.91, chennai: 51.17, kolkata: 52.05 },
  { month: "Dec", year: 2014, delhi: 45.71, mumbai: 52.81, chennai: 48.98, kolkata: 49.90 },
  // 2015
  { month: "Jan", year: 2015, delhi: 43.55, mumbai: 50.46, chennai: 46.82, kolkata: 47.72 },
  { month: "Feb", year: 2015, delhi: 43.55, mumbai: 50.46, chennai: 46.82, kolkata: 47.72 },
  { month: "Mar", year: 2015, delhi: 43.37, mumbai: 50.13, chennai: 46.61, kolkata: 47.55 },
  { month: "Apr", year: 2015, delhi: 44.55, mumbai: 51.52, chennai: 47.82, kolkata: 48.79 },
  { month: "May", year: 2015, delhi: 46.67, mumbai: 53.87, chennai: 50.02, kolkata: 50.99 },
  { month: "Jun", year: 2015, delhi: 47.39, mumbai: 54.65, chennai: 50.74, kolkata: 51.71 },
  { month: "Jul", year: 2015, delhi: 48.20, mumbai: 55.49, chennai: 51.56, kolkata: 52.56 },
  { month: "Aug", year: 2015, delhi: 48.83, mumbai: 56.16, chennai: 52.20, kolkata: 53.22 },
  { month: "Sep", year: 2015, delhi: 47.08, mumbai: 54.19, chennai: 50.35, kolkata: 51.32 },
  { month: "Oct", year: 2015, delhi: 46.46, mumbai: 53.47, chennai: 49.68, kolkata: 50.72 },
  { month: "Nov", year: 2015, delhi: 44.92, mumbai: 51.85, chennai: 48.11, kolkata: 49.08 },
  { month: "Dec", year: 2015, delhi: 43.73, mumbai: 50.51, chennai: 46.87, kolkata: 47.83 },
  // 2016
  { month: "Jan", year: 2016, delhi: 42.87, mumbai: 49.60, chennai: 46.00, kolkata: 46.96 },
  { month: "Feb", year: 2016, delhi: 42.72, mumbai: 49.45, chennai: 45.83, kolkata: 46.79 },
  { month: "Mar", year: 2016, delhi: 44.42, mumbai: 51.31, chennai: 47.63, kolkata: 48.62 },
  { month: "Apr", year: 2016, delhi: 46.67, mumbai: 53.87, chennai: 50.02, kolkata: 51.04 },
  { month: "May", year: 2016, delhi: 48.39, mumbai: 55.85, chennai: 51.77, kolkata: 52.80 },
  { month: "Jun", year: 2016, delhi: 53.06, mumbai: 61.11, chennai: 56.61, kolkata: 57.79 },
  { month: "Jul", year: 2016, delhi: 54.50, mumbai: 62.66, chennai: 58.11, kolkata: 59.21 },
  { month: "Aug", year: 2016, delhi: 55.78, mumbai: 64.05, chennai: 59.43, kolkata: 60.53 },
  { month: "Sep", year: 2016, delhi: 54.36, mumbai: 62.43, chennai: 57.84, kolkata: 58.93 },
  { month: "Oct", year: 2016, delhi: 55.53, mumbai: 63.80, chennai: 59.14, kolkata: 60.27 },
  { month: "Nov", year: 2016, delhi: 58.24, mumbai: 66.87, chennai: 61.84, kolkata: 62.95 },
  { month: "Dec", year: 2016, delhi: 58.24, mumbai: 66.87, chennai: 61.84, kolkata: 62.95 },
  // 2017
  { month: "Jan", year: 2017, delhi: 57.85, mumbai: 66.38, chennai: 61.38, kolkata: 62.46 },
  { month: "Feb", year: 2017, delhi: 57.85, mumbai: 66.38, chennai: 61.38, kolkata: 62.46 },
  { month: "Mar", year: 2017, delhi: 57.52, mumbai: 65.99, chennai: 61.00, kolkata: 62.12 },
  { month: "Apr", year: 2017, delhi: 56.13, mumbai: 64.38, chennai: 59.61, kolkata: 60.65 },
  { month: "May", year: 2017, delhi: 53.97, mumbai: 61.63, chennai: 57.29, kolkata: 58.29 },
  { month: "Jun", year: 2017, delhi: 56.49, mumbai: 64.59, chennai: 59.84, kolkata: 60.83 },
  { month: "Jul", year: 2017, delhi: 55.58, mumbai: 63.63, chennai: 58.88, kolkata: 59.95 },
  { month: "Aug", year: 2017, delhi: 57.52, mumbai: 65.99, chennai: 61.00, kolkata: 62.12 },
  { month: "Sep", year: 2017, delhi: 61.03, mumbai: 69.97, chennai: 64.79, kolkata: 65.96 },
  { month: "Oct", year: 2017, delhi: 63.97, mumbai: 73.46, chennai: 68.00, kolkata: 69.19 },
  { month: "Nov", year: 2017, delhi: 64.88, mumbai: 74.44, chennai: 68.93, kolkata: 70.15 },
  { month: "Dec", year: 2017, delhi: 63.97, mumbai: 73.46, chennai: 68.00, kolkata: 69.19 },
  // 2018
  { month: "Jan", year: 2018, delhi: 63.50, mumbai: 72.90, chennai: 67.48, kolkata: 68.65 },
  { month: "Feb", year: 2018, delhi: 62.71, mumbai: 72.15, chennai: 66.66, kolkata: 67.81 },
  { month: "Mar", year: 2018, delhi: 63.76, mumbai: 73.37, chennai: 67.78, kolkata: 68.99 },
  { month: "Apr", year: 2018, delhi: 63.96, mumbai: 73.57, chennai: 67.97, kolkata: 69.17 },
  { month: "May", year: 2018, delhi: 66.20, mumbai: 75.92, chennai: 70.34, kolkata: 71.49 },
  { month: "Jun", year: 2018, delhi: 66.20, mumbai: 75.92, chennai: 70.34, kolkata: 71.49 },
  { month: "Jul", year: 2018, delhi: 68.04, mumbai: 77.99, chennai: 72.11, kolkata: 73.31 },
  { month: "Aug", year: 2018, delhi: 70.59, mumbai: 80.87, chennai: 74.67, kolkata: 75.87 },
  { month: "Sep", year: 2018, delhi: 73.46, mumbai: 83.99, chennai: 77.54, kolkata: 78.84 },
  { month: "Oct", year: 2018, delhi: 76.57, mumbai: 87.61, chennai: 80.89, kolkata: 82.14 },
  { month: "Nov", year: 2018, delhi: 64.90, mumbai: 73.25, chennai: 68.51, kolkata: 69.40 },
  { month: "Dec", year: 2018, delhi: 60.40, mumbai: 68.14, chennai: 63.73, kolkata: 64.61 },
  // 2019
  { month: "Jan", year: 2019, delhi: 59.14, mumbai: 66.78, chennai: 62.35, kolkata: 63.25 },
  { month: "Feb", year: 2019, delhi: 58.56, mumbai: 66.22, chennai: 61.74, kolkata: 62.63 },
  { month: "Mar", year: 2019, delhi: 60.39, mumbai: 68.24, chennai: 63.70, kolkata: 64.63 },
  { month: "Apr", year: 2019, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  { month: "May", year: 2019, delhi: 63.57, mumbai: 71.76, chennai: 67.06, kolkata: 67.96 },
  { month: "Jun", year: 2019, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  { month: "Jul", year: 2019, delhi: 65.25, mumbai: 73.58, chennai: 68.73, kolkata: 69.66 },
  { month: "Aug", year: 2019, delhi: 65.25, mumbai: 73.58, chennai: 68.73, kolkata: 69.66 },
  { month: "Sep", year: 2019, delhi: 64.58, mumbai: 72.83, chennai: 68.03, kolkata: 68.96 },
  { month: "Oct", year: 2019, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  { month: "Nov", year: 2019, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  { month: "Dec", year: 2019, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  // 2020
  { month: "Jan", year: 2020, delhi: 64.58, mumbai: 72.83, chennai: 68.03, kolkata: 68.96 },
  { month: "Feb", year: 2020, delhi: 64.58, mumbai: 72.83, chennai: 68.03, kolkata: 68.96 },
  { month: "Mar", year: 2020, delhi: 64.58, mumbai: 72.83, chennai: 68.03, kolkata: 68.96 },
  { month: "Apr", year: 2020, delhi: 62.29, mumbai: 70.37, chennai: 65.73, kolkata: 66.66 },
  { month: "May", year: 2020, delhi: 58.94, mumbai: 66.79, chennai: 62.22, kolkata: 63.14 },
  { month: "Jun", year: 2020, delhi: 72.96, mumbai: 82.32, chennai: 76.65, kolkata: 77.78 },
  { month: "Jul", year: 2020, delhi: 74.63, mumbai: 84.31, chennai: 78.37, kolkata: 79.59 },
  { month: "Aug", year: 2020, delhi: 74.63, mumbai: 84.31, chennai: 78.37, kolkata: 79.59 },
  { month: "Sep", year: 2020, delhi: 74.63, mumbai: 84.31, chennai: 78.37, kolkata: 79.59 },
  { month: "Oct", year: 2020, delhi: 74.63, mumbai: 84.31, chennai: 78.37, kolkata: 79.59 },
  { month: "Nov", year: 2020, delhi: 74.63, mumbai: 84.31, chennai: 78.37, kolkata: 79.59 },
  { month: "Dec", year: 2020, delhi: 75.72, mumbai: 85.57, chennai: 79.50, kolkata: 80.74 },
  // 2021
  { month: "Jan", year: 2021, delhi: 75.72, mumbai: 85.57, chennai: 79.50, kolkata: 80.74 },
  { month: "Feb", year: 2021, delhi: 78.28, mumbai: 88.54, chennai: 82.35, kolkata: 83.67 },
  { month: "Mar", year: 2021, delhi: 80.87, mumbai: 91.74, chennai: 85.05, kolkata: 86.43 },
  { month: "Apr", year: 2021, delhi: 80.87, mumbai: 91.74, chennai: 85.05, kolkata: 86.43 },
  { month: "May", year: 2021, delhi: 81.94, mumbai: 92.93, chennai: 86.07, kolkata: 87.45 },
  { month: "Jun", year: 2021, delhi: 82.57, mumbai: 93.66, chennai: 86.73, kolkata: 88.13 },
  { month: "Jul", year: 2021, delhi: 89.62, mumbai: 97.28, chennai: 92.86, kolkata: 93.57 },
  { month: "Aug", year: 2021, delhi: 89.62, mumbai: 97.28, chennai: 92.86, kolkata: 93.57 },
  { month: "Sep", year: 2021, delhi: 89.62, mumbai: 97.28, chennai: 92.86, kolkata: 93.57 },
  { month: "Oct", year: 2021, delhi: 92.10, mumbai: 100.00, chennai: 95.39, kolkata: 96.12 },
  { month: "Nov", year: 2021, delhi: 80.87, mumbai: 87.96, chennai: 85.68, kolkata: 86.32 },
  { month: "Dec", year: 2021, delhi: 80.87, mumbai: 87.96, chennai: 85.68, kolkata: 86.32 },
  // 2022
  { month: "Jan", year: 2022, delhi: 80.87, mumbai: 87.96, chennai: 85.68, kolkata: 86.32 },
  { month: "Feb", year: 2022, delhi: 80.87, mumbai: 87.96, chennai: 85.68, kolkata: 86.32 },
  { month: "Mar", year: 2022, delhi: 80.87, mumbai: 87.96, chennai: 85.68, kolkata: 86.32 },
  { month: "Apr", year: 2022, delhi: 86.67, mumbai: 94.14, chennai: 91.32, kolkata: 92.76 },
  { month: "May", year: 2022, delhi: 86.67, mumbai: 94.14, chennai: 91.32, kolkata: 92.76 },
  { month: "Jun", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Jul", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Aug", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Sep", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Oct", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Nov", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Dec", year: 2022, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  // 2023
  { month: "Jan", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Feb", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Mar", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Apr", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "May", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Jun", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Jul", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Aug", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Sep", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Oct", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Nov", year: 2023, delhi: 87.67, mumbai: 94.27, chennai: 91.43, kolkata: 92.76 },
  { month: "Dec", year: 2023, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  // 2024
  { month: "Jan", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Feb", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Mar", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Apr", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "May", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Jun", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Jul", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Aug", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Sep", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Oct", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Nov", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Dec", year: 2024, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  // 2025
  { month: "Jan", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Feb", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Mar", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Apr", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "May", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Jun", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Jul", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Aug", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Sep", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Oct", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Nov", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Dec", year: 2025, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  // 2026
  { month: "Jan", year: 2026, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Feb", year: 2026, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Mar", year: 2026, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
  { month: "Apr", year: 2026, delhi: 87.67, mumbai: 90.03, chennai: 92.39, kolkata: 92.02 },
];

// ── Real LPG Data (14.2 kg cylinder, Rs) ──
export const lpgHistory: MonthlyPrice[] = [
  { month: "Dec", year: 2013, delhi: 1021, mumbai: 1038, chennai: 1014, kolkata: 1050.5 },
  { month: "Jan", year: 2014, delhi: 1241, mumbai: 1264.5, chennai: 1234, kolkata: 1270 },
  { month: "Feb", year: 2014, delhi: 1134, mumbai: 1167.5, chennai: 1132, kolkata: 1169 },
  { month: "Mar", year: 2014, delhi: 1080.5, mumbai: 1115.5, chennai: 1081.5, kolkata: 1118 },
  { month: "Apr", year: 2014, delhi: 980.5, mumbai: 1011, chennai: 981, kolkata: 1017.5 },
  { month: "May", year: 2014, delhi: 928.5, mumbai: 957, chennai: 928.5, kolkata: 970 },
  { month: "Jun", year: 2014, delhi: 905, mumbai: 933, chennai: 905, kolkata: 946 },
  { month: "Jul", year: 2014, delhi: 922.5, mumbai: 949.5, chennai: 924, kolkata: 966 },
  { month: "Aug", year: 2014, delhi: 920, mumbai: 947, chennai: 922, kolkata: 964.5 },
  { month: "Sep", year: 2014, delhi: 901, mumbai: 926.5, chennai: 902.5, kolkata: 945 },
  { month: "Oct", year: 2014, delhi: 880, mumbai: 902.5, chennai: 879.5, kolkata: 922 },
  { month: "Nov", year: 2014, delhi: 865, mumbai: 887, chennai: 863.5, kolkata: 905 },
  { month: "Dec", year: 2014, delhi: 752, mumbai: 770.5, chennai: 749.5, kolkata: 791 },
  { month: "Jan", year: 2015, delhi: 708.5, mumbai: 725.5, chennai: 705, kolkata: 746 },
  { month: "Feb", year: 2015, delhi: 605, mumbai: 619, chennai: 600, kolkata: 640.5 },
  { month: "Mar", year: 2015, delhi: 610, mumbai: 624, chennai: 605.5, kolkata: 646 },
  { month: "Apr", year: 2015, delhi: 621, mumbai: 632, chennai: 614, kolkata: 654.5 },
  { month: "May", year: 2015, delhi: 616, mumbai: 627.5, chennai: 608.5, kolkata: 649 },
  { month: "Jun", year: 2015, delhi: 626.5, mumbai: 637.5, chennai: 620, kolkata: 661.5 },
  { month: "Jul", year: 2015, delhi: 608.5, mumbai: 623.5, chennai: 627.5, kolkata: 644 },
  { month: "Aug", year: 2015, delhi: 585, mumbai: 599, chennai: 603.5, kolkata: 619 },
  { month: "Sep", year: 2015, delhi: 559.5, mumbai: 572.5, chennai: 577, kolkata: 593 },
  { month: "Oct", year: 2015, delhi: 517.5, mumbai: 526.5, chennai: 532, kolkata: 548 },
  { month: "Nov", year: 2015, delhi: 545, mumbai: 555, chennai: 559.5, kolkata: 575 },
  { month: "Dec", year: 2015, delhi: 606.5, mumbai: 618.5, chennai: 621, kolkata: 636.5 },
  { month: "Jan", year: 2016, delhi: 657.5, mumbai: 671, chennai: 671.5, kolkata: 686.5 },
  { month: "Feb", year: 2016, delhi: 575, mumbai: 585.5, chennai: 587, kolkata: 602 },
  { month: "Mar", year: 2016, delhi: 513.5, mumbai: 522.5, chennai: 525.5, kolkata: 541 },
  { month: "Apr", year: 2016, delhi: 509.5, mumbai: 518, chennai: 521, kolkata: 536.5 },
  { month: "May", year: 2016, delhi: 527.5, mumbai: 535, chennai: 538, kolkata: 554.5 },
  { month: "Jun", year: 2016, delhi: 548.5, mumbai: 547, chennai: 560, kolkata: 576.5 },
  { month: "Jul", year: 2016, delhi: 537.5, mumbai: 537.5, chennai: 550.5, kolkata: 565.5 },
  { month: "Aug", year: 2016, delhi: 487, mumbai: 485, chennai: 499.5, kolkata: 514 },
  { month: "Sep", year: 2016, delhi: 466.5, mumbai: 468, chennai: 477.5, kolkata: 491 },
  { month: "Oct", year: 2016, delhi: 490, mumbai: 490, chennai: 499, kolkata: 512 },
  { month: "Nov", year: 2016, delhi: 529.5, mumbai: 531, chennai: 538.5, kolkata: 551 },
  { month: "Dec", year: 2016, delhi: 584, mumbai: 587, chennai: 593.5, kolkata: 605.5 },
  { month: "Jan", year: 2017, delhi: 585, mumbai: 588, chennai: 594.5, kolkata: 606 },
  { month: "Feb", year: 2017, delhi: 651.5, mumbai: 656, chennai: 661, kolkata: 672 },
  { month: "Mar", year: 2017, delhi: 737.5, mumbai: 744.5, chennai: 746.5, kolkata: 757.5 },
  { month: "Apr", year: 2017, delhi: 723, mumbai: 729.5, chennai: 731.5, kolkata: 742 },
  { month: "May", year: 2017, delhi: 631, mumbai: 635, chennai: 638.5, kolkata: 650 },
  { month: "Jun", year: 2017, delhi: 552.5, mumbai: 554, chennai: 559.5, kolkata: 570.5 },
  { month: "Jul", year: 2017, delhi: 564, mumbai: 553.5, chennai: 574, kolkata: 584 },
  { month: "Aug", year: 2017, delhi: 524, mumbai: 502.5, chennai: 533, kolkata: 543 },
  { month: "Sep", year: 2017, delhi: 597.5, mumbai: 576, chennai: 607, kolkata: 616.5 },
  { month: "Oct", year: 2017, delhi: 649, mumbai: 625, chennai: 656.5, kolkata: 665.5 },
  { month: "Nov", year: 2017, delhi: 742, mumbai: 718.5, chennai: 750, kolkata: 759.5 },
  { month: "Dec", year: 2017, delhi: 747, mumbai: 719, chennai: 756, kolkata: 766 },
  { month: "Jan", year: 2018, delhi: 741, mumbai: 713, chennai: 750.5, kolkata: 761 },
  { month: "Feb", year: 2018, delhi: 736, mumbai: 708, chennai: 746, kolkata: 757 },
  { month: "Mar", year: 2018, delhi: 689, mumbai: 661, chennai: 699.5, kolkata: 711.5 },
  { month: "Apr", year: 2018, delhi: 653.5, mumbai: 625, chennai: 663.5, kolkata: 676 },
  { month: "May", year: 2018, delhi: 650.5, mumbai: 623, chennai: 663, kolkata: 674 },
  { month: "Jun", year: 2018, delhi: 698.5, mumbai: 671.5, chennai: 712.5, kolkata: 724 },
  { month: "Jul", year: 2018, delhi: 754, mumbai: 728.5, chennai: 770.5, kolkata: 781.5 },
  { month: "Aug", year: 2018, delhi: 789.5, mumbai: 764.5, chennai: 806, kolkata: 817.5 },
  { month: "Sep", year: 2018, delhi: 820, mumbai: 795, chennai: 838.5, kolkata: 849 },
  { month: "Oct", year: 2018, delhi: 879, mumbai: 851, chennai: 896, kolkata: 907 },
  { month: "Nov", year: 2018, delhi: 939, mumbai: 912, chennai: 958, kolkata: 969.5 },
  { month: "Dec", year: 2018, delhi: 809.5, mumbai: 780.5, chennai: 826.5, kolkata: 837 },
  { month: "Jan", year: 2019, delhi: 689, mumbai: 660, chennai: 704.5, kolkata: 714 },
  { month: "Feb", year: 2019, delhi: 659, mumbai: 630, chennai: 673, kolkata: 683 },
  { month: "Mar", year: 2019, delhi: 701.5, mumbai: 673.5, chennai: 717, kolkata: 727.5 },
  { month: "Apr", year: 2019, delhi: 706.5, mumbai: 678.5, chennai: 722, kolkata: 732.5 },
  { month: "May", year: 2019, delhi: 712.5, mumbai: 684.5, chennai: 728, kolkata: 738.5 },
  { month: "Jun", year: 2019, delhi: 737.5, mumbai: 709.5, chennai: 753, kolkata: 763.5 },
  { month: "Jul", year: 2019, delhi: 637, mumbai: 608.5, chennai: 652.5, kolkata: 662.5 },
  { month: "Aug", year: 2019, delhi: 574.5, mumbai: 546.5, chennai: 590.5, kolkata: 601 },
  { month: "Sep", year: 2019, delhi: 590, mumbai: 562, chennai: 606.5, kolkata: 616.5 },
  { month: "Oct", year: 2019, delhi: 605, mumbai: 574.5, chennai: 620, kolkata: 630 },
  { month: "Nov", year: 2019, delhi: 681.5, mumbai: 651, chennai: 696, kolkata: 706 },
  { month: "Dec", year: 2019, delhi: 695, mumbai: 665, chennai: 714, kolkata: 725.5 },
  { month: "Jan", year: 2020, delhi: 714, mumbai: 684.5, chennai: 734, kolkata: 747 },
  { month: "Feb", year: 2020, delhi: 858.5, mumbai: 829.5, chennai: 881, kolkata: 896 },
  { month: "Mar", year: 2020, delhi: 805.5, mumbai: 776.5, chennai: 826, kolkata: 839.5 },
  { month: "Apr", year: 2020, delhi: 744, mumbai: 714.5, chennai: 761.5, kolkata: 774.5 },
  { month: "May", year: 2020, delhi: 581.5, mumbai: 579, chennai: 569.5, kolkata: 584.5 },
  { month: "Jun", year: 2020, delhi: 593, mumbai: 590.5, chennai: 606.5, kolkata: 616 },
  { month: "Jul", year: 2020, delhi: 594, mumbai: 594, chennai: 610.5, kolkata: 620.5 },
  { month: "Aug", year: 2020, delhi: 594, mumbai: 594, chennai: 610.5, kolkata: 621 },
  { month: "Sep", year: 2020, delhi: 594, mumbai: 594, chennai: 610, kolkata: 620.5 },
  { month: "Oct", year: 2020, delhi: 594, mumbai: 594, chennai: 610, kolkata: 620.5 },
  { month: "Nov", year: 2020, delhi: 594, mumbai: 594, chennai: 610, kolkata: 620.5 },
  { month: "Dec", year: 2020, delhi: 644, mumbai: 644, chennai: 660, kolkata: 670.5 },
  { month: "Jan", year: 2021, delhi: 694, mumbai: 694, chennai: 710, kolkata: 720.5 },
  { month: "Feb", year: 2021, delhi: 794, mumbai: 794, chennai: 810, kolkata: 820.5 },
  { month: "Mar", year: 2021, delhi: 819, mumbai: 819, chennai: 835, kolkata: 845.5 },
  { month: "Apr", year: 2021, delhi: 809, mumbai: 809, chennai: 825, kolkata: 835.5 },
  { month: "May", year: 2021, delhi: 809, mumbai: 809, chennai: 825, kolkata: 835.5 },
  { month: "Jun", year: 2021, delhi: 809, mumbai: 809, chennai: 825, kolkata: 835.5 },
  { month: "Jul", year: 2021, delhi: 834.5, mumbai: 834.5, chennai: 850.5, kolkata: 861 },
  { month: "Aug", year: 2021, delhi: 859.5, mumbai: 859.5, chennai: 875.5, kolkata: 886 },
  { month: "Sep", year: 2021, delhi: 884.5, mumbai: 884.5, chennai: 900.5, kolkata: 911 },
  { month: "Oct", year: 2021, delhi: 899.5, mumbai: 899.5, chennai: 915.5, kolkata: 926 },
  { month: "Nov", year: 2021, delhi: 899.5, mumbai: 899.5, chennai: 915.5, kolkata: 926 },
  { month: "Dec", year: 2021, delhi: 899.5, mumbai: 899.5, chennai: 915.5, kolkata: 926 },
  { month: "Jan", year: 2022, delhi: 899.5, mumbai: 899.5, chennai: 915.5, kolkata: 926 },
  { month: "Feb", year: 2022, delhi: 899.5, mumbai: 899.5, chennai: 915.5, kolkata: 926 },
  { month: "Mar", year: 2022, delhi: 949.5, mumbai: 949.5, chennai: 965.5, kolkata: 976 },
  { month: "Apr", year: 2022, delhi: 999.5, mumbai: 999.5, chennai: 1015.5, kolkata: 1026 },
  { month: "May", year: 2022, delhi: 1003, mumbai: 1002.5, chennai: 1018.5, kolkata: 1029 },
  { month: "Jun", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Jul", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Aug", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Sep", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Oct", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Nov", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Dec", year: 2022, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Jan", year: 2023, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Feb", year: 2023, delhi: 1053, mumbai: 1052.5, chennai: 1068.5, kolkata: 1079 },
  { month: "Mar", year: 2023, delhi: 1103, mumbai: 1102.5, chennai: 1118.5, kolkata: 1129 },
  { month: "Apr", year: 2023, delhi: 1103, mumbai: 1102.5, chennai: 1118.5, kolkata: 1129 },
  { month: "May", year: 2023, delhi: 1103, mumbai: 1102.5, chennai: 1118.5, kolkata: 1129 },
  { month: "Jun", year: 2023, delhi: 1103, mumbai: 1102.5, chennai: 1118.5, kolkata: 1129 },
  { month: "Jul", year: 2023, delhi: 1103, mumbai: 1102.5, chennai: 1118.5, kolkata: 1129 },
  { month: "Aug", year: 2023, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Sep", year: 2023, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Oct", year: 2023, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Nov", year: 2023, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Dec", year: 2023, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Jan", year: 2024, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Feb", year: 2024, delhi: 903, mumbai: 902.5, chennai: 918.5, kolkata: 929 },
  { month: "Mar", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Apr", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "May", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Jun", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Jul", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Aug", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Sep", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Oct", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Nov", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Dec", year: 2024, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Jan", year: 2025, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Feb", year: 2025, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Mar", year: 2025, delhi: 803, mumbai: 802.5, chennai: 818.5, kolkata: 829 },
  { month: "Apr", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "May", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Jun", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Jul", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Aug", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Sep", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Oct", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Nov", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Dec", year: 2025, delhi: 853, mumbai: 852.5, chennai: 868.5, kolkata: 879 },
  { month: "Jan", year: 2026, delhi: 913, mumbai: 912.5, chennai: 928.5, kolkata: 939 },
  { month: "Feb", year: 2026, delhi: 913, mumbai: 912.5, chennai: 928.5, kolkata: 939 },
  { month: "Mar", year: 2026, delhi: 913, mumbai: 912.5, chennai: 928.5, kolkata: 939 },
  { month: "Apr", year: 2026, delhi: 913, mumbai: 912.5, chennai: 928.5, kolkata: 939 },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function linearRegression(data: MonthlyPrice[]): { slope: number; intercept: number; citySlopes: Record<City, number>; cityIntercepts: Record<City, number> } {
  const n = data.length;
  const cities: City[] = ["delhi", "mumbai", "chennai", "kolkata"];
  const citySlopes: Partial<Record<City, number>> = {};
  const cityIntercepts: Partial<Record<City, number>> = {};

  let globalSlope = 0, globalIntercept = 0;

  cities.forEach(city => {
    const xs = data.map((_, i) => i);
    const ys = data.map(d => d[city]);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = ys.reduce((a, b) => a + b, 0) / n;
    const slope = xs.reduce((acc, x, i) => acc + (x - meanX) * (ys[i] - meanY), 0) /
                  xs.reduce((acc, x) => acc + (x - meanX) ** 2, 0);
    const intercept = meanY - slope * meanX;
    citySlopes[city] = slope;
    cityIntercepts[city] = intercept;
    if (city === "delhi") { globalSlope = slope; globalIntercept = intercept; }
  });

  return {
    slope: globalSlope,
    intercept: globalIntercept,
    citySlopes: citySlopes as Record<City, number>,
    cityIntercepts: cityIntercepts as Record<City, number>
  };
}

function addSeasonality(baseValue: number, monthIndex: number, amplitude: number): number {
  const seasonalFactor = 1 + amplitude * Math.sin((monthIndex / 12) * 2 * Math.PI - Math.PI / 6);
  return baseValue * seasonalFactor;
}

export function generateForecast(history: MonthlyPrice[], yearsAhead: number = 10): ForecastPoint[] {
  const { citySlopes, cityIntercepts } = linearRegression(history);
  const n = history.length;
  const cities: City[] = ["delhi", "mumbai", "chennai", "kolkata"];

  const forecast: ForecastPoint[] = [];
  const lastRecord = history[history.length - 1];
  const lastMonthIdx = MONTHS.indexOf(lastRecord.month);
  const lastYear = lastRecord.year;

  for (let step = 1; step <= yearsAhead * 12; step++) {
    const absMonth = lastMonthIdx + step;
    const adjustedYear = lastYear + Math.floor(absMonth / 12);
    const adjustedMonth = absMonth % 12;
    const idx = n + step - 1;

    const point: Partial<ForecastPoint> = {
      month: MONTHS[adjustedMonth],
      year: adjustedYear,
      label: `${MONTHS[adjustedMonth]} ${adjustedYear}`,
      isForecasted: true,
    };

    cities.forEach(city => {
      const baseValue = cityIntercepts[city] + citySlopes[city] * idx;
      const value = addSeasonality(Math.max(baseValue, lastRecord[city] * 0.7), adjustedMonth, 0.02);
      (point as Record<string, unknown>)[city] = Math.round(value * 100) / 100;
    });

    forecast.push(point as ForecastPoint);
  }

  return forecast;
}

export function getHistoryAsForecasts(history: MonthlyPrice[]): ForecastPoint[] {
  return history.map(h => ({
    ...h,
    label: `${h.month} ${h.year}`,
    isForecasted: false,
  }));
}

export const CITIES: { key: City; label: string; color: string }[] = [
  { key: "delhi", label: "Delhi", color: "hsl(168, 70%, 38%)" },
  { key: "mumbai", label: "Mumbai", color: "hsl(28, 95%, 60%)" },
  { key: "chennai", label: "Chennai", color: "hsl(200, 80%, 55%)" },
  { key: "kolkata", label: "Kolkata", color: "hsl(280, 60%, 60%)" },
];

export const FUEL_TYPES: { key: FuelType; label: string; unit: string; icon: string }[] = [
  { key: "petrol", label: "Petrol", unit: "₹/Litre", icon: "⛽" },
  { key: "diesel", label: "Diesel", unit: "₹/Litre", icon: "🚛" },
  { key: "lpg", label: "LPG (14.2 kg)", unit: "₹/Cylinder", icon: "🔥" },
];

export function getHistoryForFuel(fuel: FuelType): MonthlyPrice[] {
  if (fuel === "petrol") return petrolHistory;
  if (fuel === "diesel") return dieselHistory;
  return lpgHistory;
}

export function getCurrentPrice(fuel: FuelType): Record<City, number> {
  const history = getHistoryForFuel(fuel);
  const last = history[history.length - 1];
  return { delhi: last.delhi, mumbai: last.mumbai, chennai: last.chennai, kolkata: last.kolkata };
}

export function getYearlyAverage(history: MonthlyPrice[], year: number): Record<City, number> {
  const yearData = history.filter(h => h.year === year);
  if (yearData.length === 0) return { delhi: 0, mumbai: 0, chennai: 0, kolkata: 0 };
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    delhi: Math.round(avg(yearData.map(d => d.delhi)) * 100) / 100,
    mumbai: Math.round(avg(yearData.map(d => d.mumbai)) * 100) / 100,
    chennai: Math.round(avg(yearData.map(d => d.chennai)) * 100) / 100,
    kolkata: Math.round(avg(yearData.map(d => d.kolkata)) * 100) / 100,
  };
}
