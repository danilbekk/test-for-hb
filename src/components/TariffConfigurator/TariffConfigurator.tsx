import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  fetchTariffSettings,
  setPhoneNumber,
  setSelectedWiFiRouter,
  setSelectedOperator,
  setSelectedMinutes,
  setSelectedInternet,
  setSelectedSMS,
  setCalculateTotalPrice,
  setSelectedSocialMedia,
} from '../../store/tariffConfiguratorSlice';
import { Slider } from './Slider';
import { SelectedWiFiRouter, TariffSocialMedia } from '../../interfaces/tariffConfigurator';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';

export default function TariffConfigurator() {
  const dispatch = useAppDispatch();
  const {
    settings,
    selectedOperator,
    phoneNumber,
    totalPrice,
    selectedWiFiRouter,
    selectedSocialMedia,
    selectedMinutes,
    selectedInternet,
    selectedSMS,
  } = useAppSelector(({ tariffConfigurator }) => tariffConfigurator);
  const [isPhoneValid, setPhoneValid] = useState(true);
  const [isOperatorValid, setOperatorValid] = useState(true);

  useEffect(() => {
    dispatch(fetchTariffSettings());
  }, [dispatch]);

  const handleChangeSocialMedia = (socialMedia: TariffSocialMedia) => {
    const found = selectedSocialMedia.find((item) => item.name === socialMedia.name);

    if (found) {
      dispatch(setSelectedSocialMedia(selectedSocialMedia.filter((item) => item.name !== socialMedia.name)));
    } else {
      dispatch(setSelectedSocialMedia([...selectedSocialMedia, socialMedia]));
    }

    dispatch(setCalculateTotalPrice());
  };

  const handleChangeOperator = (event: SelectChangeEvent) => {
    dispatch(setSelectedOperator(event.target.value as string));
    dispatch(setCalculateTotalPrice());
  };

  const handleChangeInternet = (_: unknown, value: number | number[]) => {
    dispatch(setSelectedInternet(Number(value)));
    dispatch(setCalculateTotalPrice());
  };

  const handleChangeMinutes = (_: unknown, value: number | number[]) => {
    dispatch(setSelectedMinutes(Number(value)));
    dispatch(setCalculateTotalPrice());
  };

  const handleChangeSMS = (_: unknown, value: number | number[]) => {
    dispatch(setSelectedSMS(Number(value)));
    dispatch(setCalculateTotalPrice());
  };

  const handleChangeWiFiRouter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'rent') {
      dispatch(
        setSelectedWiFiRouter(
          event.target.checked
            ? { variant: 'rent', price: Number(settings.wifiRouter.rent.match(/\d+/g)) }
            : ({} as SelectedWiFiRouter),
        ),
      );
    }
    if (event.target.name === 'buy') {
      dispatch(
        setSelectedWiFiRouter(
          event.target.checked
            ? { variant: 'buy', price: Number(settings.wifiRouter.buy.match(/\d+/g)?.join('')) }
            : ({} as SelectedWiFiRouter),
        ),
      );
    }
    dispatch(setCalculateTotalPrice());
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = event.target.value;
    if (phoneValue.length > 18) {
      return;
    }
    const formattedPhone = formatPhoneNumber(phoneValue);
    dispatch(setPhoneNumber(formattedPhone));
    setPhoneValid(formattedPhone.length === 18 || phoneValue === '');
  };

  const getIconStyle = (socialMedia: TariffSocialMedia) =>
    selectedSocialMedia.some((item) => item.name === socialMedia.name) ? 'contained' : 'outlined';

  const connectTariff = () => {
    if (!phoneNumber) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPhoneValid(false);
    }
    if (!selectedOperator) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setOperatorValid(false);
    }
    if (phoneNumber && selectedOperator) {
      const selectedOptions = {
        phoneNumber,
        selectedOperator,
        selectedMinutes,
        selectedSMS,
        selectedInternet,
        selectedWiFiRouter,
        selectedSocialMedia,
      };
      const jsonString = JSON.stringify(selectedOptions, null, 2);
      alert(jsonString);
    }
  };

  if (!settings.internet) return 'Загрузка';

  return (
    <Box maxWidth={800} sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <Typography variant="h4">Настройте тариф</Typography>
      <Box>
        <Typography variant="h6" mb="20px">
          Телефон
        </Typography>
        <TextField
          placeholder="+7 (___) ___-__-__"
          type="phone"
          size="small"
          required
          value={phoneNumber}
          onChange={handlePhoneChange}
          helperText={'Обязательное поле'}
          error={!isPhoneValid}
        />
      </Box>
      <Box maxWidth={220}>
        <Typography variant="h6" mb="20px">
          Опереатор
        </Typography>
        <FormControl fullWidth error={!isOperatorValid && !selectedOperator}>
          <Select value={selectedOperator} onChange={handleChangeOperator}>
            {settings.operators.map((operator) => (
              <MenuItem key={operator} value={operator}>
                {operator}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Выберите оператора</FormHelperText>
        </FormControl>
      </Box>
      <Slider
        data={settings.minutes}
        color="secondary"
        serviceName="Минуты"
        sliderName="minutes"
        onChange={handleChangeMinutes}
      />
      <Slider data={settings.sms} color="success" serviceName="СМС" sliderName="sms" onChange={handleChangeSMS} />
      <Slider data={settings.internet} serviceName="Интернет" sliderName="internet" onChange={handleChangeInternet} />
      <Box>
        <Typography mb="20px" variant="h6">
          Wi-Fi роутер
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={selectedWiFiRouter.variant === 'rent'} name="rent" onChange={handleChangeWiFiRouter} />
            }
            label={settings.wifiRouter.rent}
          />
          <FormControlLabel
            control={
              <Checkbox checked={selectedWiFiRouter.variant === 'buy'} name="buy" onChange={handleChangeWiFiRouter} />
            }
            label={settings.wifiRouter.buy}
          />
        </FormGroup>
      </Box>
      <Box>
        <Typography mb="20px" variant="h6">
          Соцсети
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          {settings.socialMedia.map((socialMedia) => (
            <Button
              key={socialMedia.name}
              onClick={() => handleChangeSocialMedia(socialMedia)}
              variant={getIconStyle(socialMedia)}
              startIcon={
                socialMedia.name === 'instagram' ? (
                  <InstagramIcon />
                ) : socialMedia.name === 'facebook' ? (
                  <FacebookIcon />
                ) : (
                  <LinkedInIcon />
                )
              }
            >
              <Typography>{socialMedia.price}</Typography>
            </Button>
          ))}
        </Box>
      </Box>
      <Box>
        <Button onClick={connectTariff} variant="contained" color="secondary">
          {totalPrice + ' ₽ в месяц'}
        </Button>
      </Box>
    </Box>
  );
}
