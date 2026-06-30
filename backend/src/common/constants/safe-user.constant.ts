export interface SafeUser {
  id: string;
  name: string;
  email: string;
  university: string;
  courseOfStudy: string;
  yearOfStudy: number;
  goals: string[];
  isOnboarded: boolean;
  createdAt: Date;
}
