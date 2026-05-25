import { prisma } from "../../config/db.js";


export const getDashboardData = async (userId: string) => {
  try {
    return {success: true, message: "Dashboard data fetched successfully.", data: { userId }};
  } catch (error) {
    return {success: false, message:"Failed to fetch dashboard data.", data: null};
  } 
};
