import { useState } from "react";
import Calendar from "react-calendar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function MiniCalendar(props) {
  const { selectRange, value, onChange, styles } = props;

  return (
      <Calendar
        className={`${styles}`}
        onChange={onChange}
        value={value}
        selectRange={selectRange}
        view={"month"}
        prevLabel={<div ><ArrowBackIosIcon /></div>}
        nextLabel={<div><ArrowForwardIosIcon /></div>}
        minDate={new Date()}
      />
  );
}
