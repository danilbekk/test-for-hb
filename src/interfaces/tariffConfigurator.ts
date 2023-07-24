export interface TariffSocialMedia {
  name: string;
  icon: string;
  price: string;
}

export interface WiFiRouter {
  buy: string;
  rent: string;
}
export interface SelectedWiFiRouter {
  variant: string;
  price: number;
}
export interface TariffSettings {
  minutes: number[];
  internet: number[];
  sms: number[];
  socialMedia: TariffSocialMedia[];
  wifiRouter: WiFiRouter;
  operators: string[];
}

export interface TariffConfiguratorState {
  totalPrice: string;
  phoneNumber: string;
  selectedOperator: string;
  settings: TariffSettings;
  selectedMinutes: number;
  selectedSMS: number;
  selectedInternet: number;
  selectedWiFiRouter: SelectedWiFiRouter;
  loading: boolean;
  error: string | null;
  selectedSocialMedia: TariffSocialMedia[];
}
