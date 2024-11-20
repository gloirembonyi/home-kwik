export interface ActivityDetails {
    [key: string]: string | number;
    location?: string | number;
    distance?: string | number;
    price?: string | number;
    driver?: string | number;
    rating?: number;
    earnings?: string | number;
    date?: string | number;
    duration?: string | number;
    impact?: string | number;
    multiplier?: string | number;
    area?: string | number;
  }
  

 export interface Activity {
  type: ActivityType;
  message: string;
  time: string;
  details: ActivityDetails;
  status: ActivityStatus;
}