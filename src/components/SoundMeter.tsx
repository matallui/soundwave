import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { Countdown } from "@/components/Countdown";

let maxDb = 0;

const byteArrayToDB = (byteArray: Uint8Array) => {
  const sum = byteArray.reduce((acc, val) => acc + val * val, 0);
  const rms = Math.sqrt(sum / byteArray.length);
  const db = 20 * Math.log10(rms);
  return db;
};

interface SoundMeterProps extends React.HTMLAttributes<HTMLCanvasElement> {
  duration?: number; //ms
  onDone?: (db: number) => void;
}

export const SoundMeter: React.FC<SoundMeterProps> = ({
  className,
  duration = 5000,
  onDone,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let audioCtx: AudioContext;
    let stream: MediaStream;

    try {
      void navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppression: false,
          },
        })
        .then((_stream) => {
          stream = _stream;
          audioCtx = new AudioContext();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          source.connect(analyser);
          analyser.fftSize = 2048;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const canvasCtx = canvasRef.current!.getContext("2d")!;
          canvasCtx.clearRect(
            0,
            0,
            canvasCtx.canvas.width,
            canvasCtx.canvas.height
          );
          const WIDTH = canvasCtx.canvas.width;
          const HEIGHT = canvasCtx.canvas.height;
          const barWidth = (WIDTH / bufferLength) * 2.5;
          let barHeight;
          function renderFrame() {
            requestAnimationFrame(renderFrame);
            let x = 0;
            analyser.getByteFrequencyData(dataArray);
            const db = byteArrayToDB(dataArray);
            canvasCtx.fillStyle = "rgb(255, 255, 255)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            for (let i = 0; i < bufferLength; i++) {
              barHeight = dataArray[i] ?? 0;
              canvasCtx.fillStyle =
                db < 35
                  ? `rgb(0, ${barHeight + 50}, 0)`
                  : db < 55
                  ? `rgb(${barHeight + 30}, ${barHeight + 100}, 0)`
                  : `rgb(${barHeight + 10}, 0, 0)`;
              canvasCtx.fillRect(
                x,
                HEIGHT - barHeight / 2,
                barWidth,
                barHeight / 2
              );
              x += barWidth + 1;
            }
            // write dB level on canvas as well
            // canvasCtx.fillStyle = "rgb(20, 20, 20)";
            // canvasCtx.font = "32px serif";
            // canvasCtx.fillText(
            //   `${db.toFixed(0)} dB`,
            //   WIDTH - WIDTH / 3,
            //   HEIGHT / 4,
            // );
            maxDb = Math.max(maxDb, db);
          }
          if (done) {
            console.log("Done with:", maxDb);
            onDone?.(maxDb);
            stream.getTracks().forEach((track) => track.stop());
          } else {
            renderFrame();
          }
        });
    } catch (e) {
      console.error(e);
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      void audioCtx?.close();
    };
  }, [done, duration, onDone]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className={cn("h-full w-full rounded-xl p-1", className)}
      />
      <Countdown
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black p-2 text-lg font-bold text-white"
        value={duration / 1000}
        onDone={() => setDone(true)}
      />
    </div>
  );
};
