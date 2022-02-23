import { Location } from "./Location";
import { UserProfile } from "./UserProfile";

export type Stay = {
  id: string;
  user_profile_id: string;
  location: Location;
  from_date: string;
  to_date: string;
};

export type NewStay = {
  user_profile_id: string;
  location: string;
  from_date: string;
  to_date: string;
};

export type UserStay = {
  id: string;
  user_profiles: UserProfile;
  user_profile_id?: string;
  location: Location;
  from_date: string;
  to_date: string;
};
