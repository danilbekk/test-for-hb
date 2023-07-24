import { Box, Typography, Slider as SliderMUI } from '@mui/material';

interface SliderMinuteProps {
  data: number[];
  serviceName: string;
  sliderName: string;
  color?: 'primary' | 'secondary' | 'success';
  onChange?: (event: Event, value: number | number[], activeThumb: number) => void;
}
export const Slider = ({ data, serviceName, onChange, color, sliderName }: SliderMinuteProps) => {
  const marks = data?.map((value) => ({
    value: value,
    label: `${value}`,
  }));

  return (
    <Box ml="10px">
      <Typography>{serviceName}</Typography>
      <SliderMUI
        aria-label="Restricted values"
        defaultValue={data[0]}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        min={data[0]}
        max={data[data.length - 1]}
        onChange={onChange}
        // Параметр success меняет цвет но mui не ожидает его
        // Пока не знаю как исправить
        color={color}
        name={sliderName}
      />
    </Box>
  );
};
