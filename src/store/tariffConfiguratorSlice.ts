import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../app/store';
import {
  TariffConfiguratorState,
  TariffSettings,
  SelectedWiFiRouter,
  TariffSocialMedia,
} from '../interfaces/tariffConfigurator';

const initialState: TariffConfiguratorState = {
  totalPrice: '',
  phoneNumber: '',
  selectedOperator: '',
  settings: {} as TariffSettings,
  selectedMinutes: 0,
  selectedSMS: 0,
  selectedInternet: 0,
  selectedWiFiRouter: {} as SelectedWiFiRouter,
  selectedSocialMedia: [] as TariffSocialMedia[],
  loading: false,
  error: null,
};

export const tariffConfiguratorSlice = createSlice({
  name: 'tariffConfigurator',
  initialState,
  reducers: {
    fetchTariffSettingsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTariffSettingsSuccess: (state, action: PayloadAction<TariffSettings>) => {
      state.settings = action.payload;
      state.loading = false;
    },
    fetchTariffSettingsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPhoneNumber(state, action: PayloadAction<string>) {
      state.phoneNumber = action.payload;
    },
    setSelectedMinutes(state, action: PayloadAction<number>) {
      state.selectedMinutes = action.payload;
    },
    setSelectedInternet(state, action: PayloadAction<number>) {
      state.selectedInternet = action.payload;
    },
    setSelectedSMS(state, action: PayloadAction<number>) {
      state.selectedSMS = action.payload;
    },
    setSelectedOperator(state, action: PayloadAction<string>) {
      state.selectedOperator = action.payload;
    },
    setSelectedWiFiRouter(state, action: PayloadAction<SelectedWiFiRouter>) {
      state.selectedWiFiRouter = action.payload;
    },
    setSelectedSocialMedia(state, action: PayloadAction<TariffSocialMedia[]>) {
      state.selectedSocialMedia = action.payload;
    },
    setCalculateTotalPrice(state) {
      const { selectedMinutes, selectedInternet, selectedSMS, selectedSocialMedia, selectedWiFiRouter } = state;
      const minutesPrice = selectedMinutes * 0.5;
      const internetPrice = selectedInternet * 2;
      const smsPrice = selectedSMS * 0.3;

      const additionalServicesPrice = selectedSocialMedia.reduce(
        (totalPrice, service) => totalPrice + parseFloat(service.price),
        0,
      );

      const totalPrice =
        minutesPrice +
        internetPrice +
        smsPrice +
        additionalServicesPrice +
        (selectedWiFiRouter.price ? selectedWiFiRouter.price : 0);

      state.totalPrice = totalPrice.toFixed();
    },
  },
});

export const fetchTariffSettings = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(tariffConfiguratorSlice.actions.fetchTariffSettingsPending());
      setTimeout(() => {
        const tariffSettingsData: TariffSettings = {
          operators: ['Оператор №1', 'Оператор №2', 'Оператор №3'],
          minutes: [100, 200, 300, 600],
          internet: [0, 50, 100, 150],
          sms: [0, 50, 100, 150],
          socialMedia: [
            {
              name: 'instagram',
              icon: 'icon',
              price: '60 ₽',
            },
            {
              name: 'facebook',
              icon: 'icon',
              price: '20 ₽',
            },
            {
              name: 'linkedIn',
              icon: 'icon',
              price: '30 ₽',
            },
          ],
          wifiRouter: {
            buy: 'Выкупить 2 600 ₽',
            rent: 'Аренда 99 ₽/мес',
          },
        };

        dispatch(tariffConfiguratorSlice.actions.fetchTariffSettingsSuccess(tariffSettingsData));
        dispatch(tariffConfiguratorSlice.actions.setCalculateTotalPrice());
      }, 500);
    } catch (e) {
      dispatch(tariffConfiguratorSlice.actions.fetchTariffSettingsError('Ошибка загрузки'));
    }
  };
};
export const {
  setCalculateTotalPrice,
  setPhoneNumber,
  setSelectedOperator,
  setSelectedMinutes,
  setSelectedInternet,
  setSelectedSMS,
  setSelectedWiFiRouter,
  setSelectedSocialMedia,
} = tariffConfiguratorSlice.actions;

export default tariffConfiguratorSlice.reducer;
