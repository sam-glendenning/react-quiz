import React from "react";

interface StopwatchProps {
  active: boolean;
}

const Stopwatch = (props: StopwatchProps): React.ReactElement => {
  const { active } = props;
  const [time, setTime] = React.useState<number>(0);

  React.useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;

    if (active) {
      interval = setInterval(() => setTime((time) => time + 1000), 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div>
      <span className="digits">
        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      </span>
      <span className="digits">
        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
      </span>
    </div>
  );
};

export default Stopwatch;
