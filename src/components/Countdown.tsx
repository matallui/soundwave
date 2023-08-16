import { useEffect, useState } from "react";

export interface CountdownProps extends React.ComponentProps<"p"> {
  value: number;
  onDone?: () => void;
  zeroMessage?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  className,
  value,
  onDone,
  zeroMessage = "0",
}) => {
  const [count, setCount] = useState(value);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((curr) => curr - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === -1) {
      onDone?.();
    }
  }, [count, onDone]);

  return (
    <div className={className}>
      <p>{count > 0 ? count : zeroMessage}</p>
    </div>
  );
};
