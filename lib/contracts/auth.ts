export interface RegisterBody {
  username: string;
  password: string;
  country?: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface UserPreferences {
  theme?: "light" | "dark";
  sidebarCollapsed?: boolean;
  locale?: "en" | "es";
}

export interface UserProfile {
  id: string;
  username: string;
  country: string;
  preferences: UserPreferences;
}
