export interface LoggedInUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserStoreData {
  user: LoggedInUser | null;
  error: string | null;
}
