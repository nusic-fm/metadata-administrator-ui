import { useEffect, useRef, useState } from "react";

type Props = {
  status: "initial" | "loading" | "playing" | "idle";
  color: string;
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
const Pulsing = ({ status, color }: Props) => {
  const [frameIndex, setFrameIndex] = useState(1);
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
    [1, 75],
    [76, 30],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => {
        // Calculate the next index based on the current index
        let nextIndex;

        const startAt = 1;
        const total = 202;

        if (status === "initial") {
          nextIndex = startAt;
        } else if (status === "idle") {
          if (prevIndex < total) {
            nextIndex = prevIndex + 1;
          } else nextIndex = total;
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
          if (prevIndex >= total) {
            nextIndex = total;
          } else {
            nextIndex = prevIndex + 1;
          }
        }
        // Update the frame index and return the new value
        return nextIndex;
      });
    }, 15);

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

  const frameUrl = `/media/${color}/frame_${convertToZeros(frameIndex)}.png`;

  return (
    <img
      src={frameUrl}
      alt="Pulsing Animation"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        // WebkitFilter: color,
        // transform: "scale(1.5)",
      }}
    />
  );
};

export default Pulsing;
