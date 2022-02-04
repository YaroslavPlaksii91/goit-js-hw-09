import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const startBtn = document.querySelector('[data-start]');
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    if (selectedDates[0] < options.defaultDate) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    startBtn.removeAttribute('disabled');
    localStorage.setItem('timer-selected-time', selectedDates[0].getTime());
  },
};
let intervalId = null;

flatpickr('#datetime-picker', options);

startBtn.setAttribute('disabled', true);
startBtn.addEventListener('click', onStartBtnClick);

function onStartBtnClick() {
  const selectedTime = localStorage.getItem('timer-selected-time');

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = selectedTime - currentTime;
    const timeComponents = convertMs(deltaTime);

    if (selectedTime <= currentTime) {
      clearInterval(intervalId);
      return;
    }

    updateTimerInterface(timeComponents);
  }, 1000);
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  const daysRef = document.querySelector('[data-days]');
  const hoursRef = document.querySelector('[data-hours]');
  const minutesRef = document.querySelector('[data-minutes]');
  const secondsRef = document.querySelector('[data-seconds]');

  daysRef.textContent = addLeadingZero(days);
  hoursRef.textContent = addLeadingZero(hours);
  minutesRef.textContent = addLeadingZero(minutes);
  secondsRef.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
