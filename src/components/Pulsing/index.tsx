import { useEffect, useRef, useState } from "react";

type Props = {
  status: "initial" | "loading" | "playing" | "idle";
};

const convertToZeros = (number: number) => {
  // Convert the number to a string
  var numberStr = number.toString();

  // Calculate the number of leading zeros needed
  var numZeros = 3 - numberStr.length;

  // Add leading zeros to the string
  var resultStr = "0".repeat(numZeros) + numberStr;

  return resultStr;
};
function isNumberInRange(number: number, range: number[]) {
  return number >= range[0] && number <= range[1];
}
const Pulsing = ({ status }: Props) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const reverse = useRef(false);

  const frameRanges = {
    loading: [
      [0, 7],
      [7, 16],
      [16, 24],
    ],
    playing: [
      [15, 10],
      [10, 25],
    ],
  };
  const animationFrames = [
    [0, 37],
    [38, 28],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => {
        // Calculate the next index based on the current index
        let nextIndex = 5;

        if (status === "initial") {
          nextIndex = 0;
        } else if (status === "idle") {
          nextIndex = 199;
        } else if (status === "loading") {
          if (isNumberInRange(prevIndex, animationFrames[0])) {
            if (reverse.current) {
              if (prevIndex === animationFrames[1][1]) {
                reverse.current = false;
                nextIndex = prevIndex + 1;
              } else nextIndex = prevIndex - 1;
            } else nextIndex = prevIndex + 1;
          } else {
            reverse.current = true;
            nextIndex = prevIndex - 1;
          }
          console.log(`nextIndex: ${nextIndex}`);
          //    else {
          //     if (prevIndex === 24) {
          //       nextIndex = 5;
          //     } else {
          //       nextIndex = prevIndex + 1;
          //     }
          //   }
        } else {
          if (prevIndex < 25 || prevIndex === 199) {
            nextIndex = 25;
          } else {
            nextIndex = prevIndex + 1;
          }
        }
        // Update the frame index and return the new value
        return nextIndex;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [status, frameIndex]);

  //   const totalLoadingFrames = 27;
  //   const totalPlayingFrames = 199;
  const totalFrames = 24;

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setFrameIndex((prevIndex) => (prevIndex % totalFrames) + 1);
  //     }, 100); // Adjust the interval time as needed

  //     return () => clearInterval(interval);
  //   }, []);

  //   useEffect(() => {
  //     setTimeout(() => {
  //       setStatus("playing");
  //     }, 10000);
  //   }, []);

  //Not 100%
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       if (status === "loading") {
  //         setFrameIndex((prevIndex) => (prevIndex % totalLoadingFrames) + 1);
  //       } else if (status === "playing") {
  //         setFrameIndex((prevIndex) => (prevIndex % totalPlayingFrames) + 28);
  //       }
  //     }, 100); // Adjust the interval time as needed

  //     return () => clearInterval(interval);
  //   }, [status]);

  //   useEffect(() => {
  //     let currentIndex = 0;
  //     let direction = 1;

  //     const interval = setInterval(() => {
  //       const [start, range] = (frameRanges as any)[status][currentIndex];
  //       setFrameIndex(
  //         start + (direction === 1 ? frameIndex : range - frameIndex)
  //       );

  //       if (frameIndex === 0 || frameIndex === range) {
  //         // Change direction when reaching the end of a range
  //         direction *= -1;
  //         currentIndex = (currentIndex + 1) % (frameRanges as any)[status].length;
  //       }
  //     }, 100); // Adjust the interval time as needed

  //     return () => clearInterval(interval);
  //   }, [status, frameIndex]);

  const frameUrl = `/Media/Circle%2010_00${convertToZeros(frameIndex)}.png`;

  return (
    <img
      src={frameUrl}
      alt="Pulsing Animation"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

export default Pulsing;
