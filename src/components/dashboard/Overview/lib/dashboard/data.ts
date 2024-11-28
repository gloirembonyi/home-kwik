import { CHART_COLORS } from "./constants";

// lib/dashboard/data.ts
export const getRidesData = () => [
    { day: "Mon", riders: 60, drivers: 25, pending: 15 },
    { day: "Tue", riders: 58, drivers: 20, pending: 22 },
    { day: "Wed", riders: 45, drivers: 25, pending: 30 },
    { day: "Thu", riders: 60, drivers: 30, pending: 10 },
    { day: "Fri", riders: 75, drivers: 20, pending: 5 },
    { day: "Sat", riders: 45, drivers: 35, pending: 20 },
    { day: "Sun", riders: 48, drivers: 32, pending: 20 },
  ];
  
  export const getFrequentUsers = () => [
    {
      name: "Leasie Watson",
      role: "Driver",
      gender: "Female",
      rides: 200,
      status: "Active",
    },
    {
      name: "Darlene Robertson",
      role: "Driver",
      gender: "Male",
      rides: 200,
      status: "Active",
    },
    {
      name: "Jacob Jones",
      role: "Rider",
      gender: "Male",
      rides: 200,
      status: "Active",
    },
    {
      name: "Kathryn Murphy",
      role: "Rider",
      gender: "Male",
      rides: 200,
      status: "Active",
    },
    {
      name: "Leslie Alexander",
      role: "Driver",
      gender: "Female",
      rides: 200,
      status: "Active",
    },
    {
      name: "Ronald Richards",
      role: "Rider",
      gender: "Male",
      rides: 200,
      status: "Active",
    },
    {
      name: "Jenny Wilson",
      role: "Driver",
      gender: "Female",
      rides: 200,
      status: "Active",
    },
  ];
  
  export const roleData = [
    { name: "Riders", value: 63, color: CHART_COLORS.primary },
    { name: "Drivers", value: 25, color: CHART_COLORS.secondary },
  ];