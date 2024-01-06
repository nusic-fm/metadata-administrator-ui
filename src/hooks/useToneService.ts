import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";

export const useTonejs = (
  onended: () => void,
  onSectionChangeCompleted: (newSection: string) => void
) => {
  const [currentPlayer, setCurrentPlayer] = useState<Tone.Player | null>();
  // const [currentBs, setCurrentBs] = useState<Tone.ToneBufferSource | null>();
  const playerRef = useRef<Tone.Player | null>(null);
  const startTimeRef = useRef(0);
  // const startPositionRef = useRef<Tone.Unit.Time | null>(null);
  const loopRef = useRef<null | Tone.Loop<Tone.LoopOptions>>(null);
  const scheduledNextTrackBf = useRef<Tone.ToneAudioBuffer | null>(null);

  const [isToneInitialized, setIsToneInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTonePlaying, setIsTonePlaying] = useState(false);
  const [toneLoadingForSection, setToneLoadingForSection] = useState<
    string | null
  >(null);
  const tempLoopVar = useRef(true);
  const [loop, setLoop] = useState(true);
  const beatsToReduceForSync = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const onEndedCalledRef = useRef(false);

  const initializeTone = async () => {
    if (!isToneInitialized) {
      setIsToneInitialized(true);
      await Tone.start();
      console.log("context started");
      setEvents();
    }
  };

  const setEvents = () => {
    Tone.Transport.on("start", (...args) => {
      console.log("Tone Started");
      setIsTonePlaying(true);
    });
    Tone.Transport.on("stop", (...args) => {
      console.log("Tone Stopped");
      setIsTonePlaying(false);
    });
    Tone.Transport.on("pause", (...args) => {
      console.log("Tone Paused");
      setIsTonePlaying(false);
    });
  };

  const setBufferForNextTrack = async (url: string, section: string) => {
    await new Promise((res) => {
      const audioBuffer = new Tone.Buffer(url);

      setToneLoadingForSection(section);
      audioBuffer.onload = (bf) => {
        scheduledNextTrackBf.current = bf;
        // const endInMilliseconds =
        //   bf.duration - (Tone.Transport.seconds - startTimeRef.current);
        // console.log("Delay with calculation: ", endInMilliseconds.toFixed(3));
        // console.log("Tone Seconds: ", Tone.Transport.seconds);
        // console.log("+: ", endInMilliseconds);
        // const stopTime = Tone.Transport.seconds + endInMilliseconds;
        // console.log("stopTime: ", stopTime);
        // if (playerRef.current && scheduledNextTrackBf.current) {
        //   startTimeRef.current = stopTime;
        //   playerRef.current.stop(stopTime);
        //   playerRef.current.buffer = scheduledNextTrackBf.current;
        //   scheduledNextTrackBf.current = null;
        //   playerRef.current.start(stopTime);
        //   setToneLoadingForSection(false);
        //   onEndedCalledRef.current = false;
        //   console.log(startTimeRef.current);
        // }
      };
      res("");
    });
  };

  useEffect(() => {
    loopRef.current = new Tone.Loop(() => {
      if (playerRef.current) {
        const currentTime = (
          Tone.Transport.seconds - startTimeRef.current
        ).toFixed(0);
        const bfDuration = playerRef.current.buffer.duration;
        currentTimeRef.current = parseInt(currentTime);

        if (
          currentTime === (bfDuration - 6).toFixed(0) &&
          !onEndedCalledRef.current
        ) {
          if (!loop) {
            onEndedCalledRef.current = true;
            onended();
          }
          // loopRef.current?.dispose();
        }
        if (
          playerRef.current &&
          currentTime === (bfDuration - 1).toFixed(0) &&
          scheduledNextTrackBf.current
        ) {
          const remainingBeatsDuration =
            bfDuration - (Tone.Transport.seconds - startTimeRef.current);
          // console.log("Delay with calculation: ", remainingBeatsDuration);
          // console.log(bfDuration, Tone.Transport.seconds, startTimeRef.current);

          // Tone.Transport.scheduleOnce(() => {
          if (playerRef.current && scheduledNextTrackBf.current) {
            startTimeRef.current = Tone.Transport.seconds;
            const startOffset = Tone.Transport.seconds + remainingBeatsDuration;
            const stopOffset = startOffset - 0.1;
            playerRef.current.stop(stopOffset);
            playerRef.current.buffer = scheduledNextTrackBf.current;
            playerRef.current.start(startOffset);
            scheduledNextTrackBf.current = null;
            if (toneLoadingForSection) {
              Tone.Transport.scheduleOnce(() => {
                onSectionChangeCompleted(toneLoadingForSection);
                setToneLoadingForSection(null);
              }, `+${remainingBeatsDuration.toFixed(3)}`);
            }
            onEndedCalledRef.current = false;
            console.log(`Transistioned: `, startTimeRef.current);
          }
          // }, `+${remainingBeatsDuration.toFixed(3)}`);
          // setTimeout(() => {
          //   if (playerRef.current && scheduledNextTrackBf.current) {
          //     console.time("start");
          //     startTimeRef.current = Tone.Transport.seconds;
          //     playerRef.current.stop();
          //     playerRef.current.buffer = scheduledNextTrackBf.current;
          //     scheduledNextTrackBf.current = null;
          //     playerRef.current.start();
          //     console.timeEnd("start");
          //     setToneLoadingForSection(false);
          //   }
          // }, 550);
        }
        // Resets when on loop
        if (playerRef.current && currentTime === (bfDuration - 1).toFixed(0)) {
          startTimeRef.current = Tone.Transport.seconds;
        }
      }
    }, "4n").start(0);

    return () => {
      loopRef.current?.dispose();
    };
  });

  // useEffect(() => {
  //   // if (loop) {
  //   //   clearLoopForSchedule();
  //   // }
  //   if (playerRef.current) {
  //     playerRef.current.loop = loop;
  //   }
  // }, [loop]);

  const changePlayerBuffer = (
    bf: ToneAudioBuffer,
    offsetPosition: Tone.Unit.Time
  ) => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.buffer = bf;
      playerRef.current.start(undefined, offsetPosition);
    }
  };

  const playAudio = async (
    url: string,
    playFromStart?: boolean,
    beatDiff: number = 0
  ): Promise<void> => {
    beatsToReduceForSync.current = beatDiff;
    if (toneLoadingForSection) {
      scheduledNextTrackBf.current = null;
      setToneLoadingForSection(null);
      onEndedCalledRef.current = false;
    }
    if (playerRef.current) {
      await switchAudio(url, playFromStart);
      return;
    }
    await initializeTone();

    Tone.Transport.bpm.value = 120; // TODO: BPM

    // Load and play the new audio
    const player = new Tone.Player(url).sync().toDestination();
    playerRef.current = player;
    setCurrentPlayer(player);
    await Tone.loaded();
    if (isMuted) player.mute = true;
    // player.loop = true;
    player.fadeIn = 0.3;
    player.fadeOut = 0.3;
    Tone.Transport.start();
    player.start();
    startTimeRef.current = Tone.Transport.seconds;
  };

  const switchAudio = async (url: string, playFromStart?: boolean) => {
    await new Promise((res) => {
      const audioBuffer = new Tone.Buffer(url);
      audioBuffer.onload = (bf) => {
        // Audio is downloaded
        if (isTonePlaying) {
          const currentBeat = parseInt(
            Tone.Transport.position.toString().split(":")[1]
          );
          const delayTime =
            ((4 - currentBeat) / 4) * (60 / Tone.Transport.bpm.value);
          console.log(`delayTime: `, delayTime);
          Tone.Transport.scheduleOnce(() => {
            if (playerRef.current) {
              let offsetPosition;
              if (playFromStart) {
                offsetPosition = 0;
                startTimeRef.current = Tone.Transport.seconds;
              } else {
                // Get the current position of the Transport in seconds
                const currentPositionInSeconds =
                  Tone.Transport.seconds - startTimeRef.current;
                // Get the BPM (beats per minute) of the Transport
                const bpm = Tone.Transport.bpm.value;

                // Calculate the duration of 2 beats in seconds
                const twoBeatsDurationInSeconds =
                  (beatsToReduceForSync.current * 60) / bpm;

                // Calculate the new position in seconds by adding 2 beats duration to the current position
                const newBeatPositionInSeconds =
                  currentPositionInSeconds - twoBeatsDurationInSeconds;
                offsetPosition = Tone.Time(
                  newBeatPositionInSeconds
                ).toBarsBeatsSixteenths();
              }
              console.log(`offsetPosition: `, offsetPosition);
              changePlayerBuffer(bf, offsetPosition);
            }
          }, `+${delayTime.toFixed(3)}`);
        } else if (playerRef.current) {
          playerRef.current.buffer = bf;
          Tone.Transport.start();
          playerRef.current.start();
        }
        res("");
      };
    });
  };

  const switchLoop = (isTemp?: boolean, val?: boolean) => {
    if (isTemp) {
      if (!val) {
        setLoop(tempLoopVar.current);
      } else {
        tempLoopVar.current = loop;
        setLoop(true);
      }
    } else {
      setLoop(!loop);
    }
  };

  const clearLoopForSchedule = () => {
    loopRef.current?.dispose();
    loopRef.current = null;
    // if (playerRef.current) playerRef.current.loop = true;
  };
  const mutePlayer = () => {
    setIsMuted(true);
    if (playerRef.current) {
      playerRef.current.mute = true;
      // currentPlayer.stop(currentPlayer.now() + 0.1);
    }
  };

  const unMutePlayer = () => {
    setIsMuted(false);
    if (playerRef.current) {
      playerRef.current.mute = false;
      // currentPlayer.start();
    }
  };

  const pausePlayer = () => {
    Tone.Transport.pause();
  };
  const playPlayer = () => {
    Tone.Transport.start();
  };
  const stopPlayer = () => {
    Tone.Transport.stop();
  };
  return {
    currentPlayer,
    playAudio,
    mutePlayer,
    unMutePlayer,
    pausePlayer,
    playPlayer,
    stopPlayer,
    isTonePlaying,
    isMuted,
    setBufferForNextTrack,
    toneLoadingForSection,
    clearLoopForSchedule,
    switchLoop,
    loop,
    initializeTone,
  };
};
