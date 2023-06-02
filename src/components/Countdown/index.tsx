import useCountDownTimer from '@/hooks/useCountdown';
import { requestReload } from '@/state/pnftExchange';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const CountDownTimer = ({ end_time }: { end_time: string }) => {
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment(end_time).format('YYYY/MM/DD HH:mm:ss'),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && end_time) {
      dispatch(requestReload());
    }
  }, [expired]);

  return (
    <span>
      {days}d : {hours}h : {minutes}m : {seconds}s
    </span>
  );
};

export default CountDownTimer;
