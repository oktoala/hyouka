import { Match, Switch, createSignal } from "solid-js";
import IceCreamPng from "./assets/icecream.png";
import {
  BlueBubble,
  GreenBubble,
  OrangeBubble,
  PurpleBubble,
} from "./components/Bubble";
import styles from "./styles.module.css";
import MerdekaText from "./components/MerdekaText";
import {
  BlueRibbon,
  GreenRibbon,
  OrangeRibbon,
  PurpleRibbon,
} from "./components/Ribbon";
import PlayIcon from "./components/PlayIcon";

const [isWin, setIsWin] = createSignal(false);

const Bubbles = () => {
  return (
    <>
      <BlueBubble
        class={`absolute top-[75px] left-[45px] w-10 h-10 ${isWin() && "animate-bounce"
          }`}
      />
      <PurpleBubble
        class={`absolute top-[209px] right-[104px] w-12 h-12 ${isWin() && "animate-bounce"
          }`}
      />
      <PurpleBubble
        class={`absolute top-[210px] left-[6px] w-12 h-12 ${isWin() && "animate-bounce"
          }`}
      />
      <OrangeBubble
        class={`absolute top-[276px] left-[86px] w-7 h-7 ${isWin() && "animate-bounce"
          }`}
      />
      <OrangeBubble
        class={`absolute bottom-[170px] right-[169px] w-7 h-7 ${isWin() && "animate-bounce"
          }`}
      />
      <PurpleBubble
        class={`absolute  left-[138px] top-[319px] w-12 h-12 ${isWin() && "animate-bounce"
          }`}
      />
      <PurpleBubble
        class={`absolute bottom-[94px] right-[11px] w-12 h-12 ${isWin() && "animate-bounce"
          }`}
      />
      <GreenBubble
        class={`absolute top-[307px] left-[232px] w-10 h-10 ${isWin() && "animate-bounce"
          }`}
      />
      <GreenBubble
        class={`absolute bottom-[10px] right-[178px] w-10 h-10 ${isWin() && "animate-bounce"
          }`}
      />
      <GreenBubble
        class={`absolute top-[403px] left-[30px] w-10 h-10 ${isWin() && "animate-bounce"
          }`}
      />
      <BlueBubble
        class={`absolute bottom-[104px] left-[119px] w-10 h-10 ${isWin() && "animate-bounce"
          }`}
      />
    </>
  );
};

const RibbonVictory = () => {
  return (
    <>
      <GreenRibbon class={styles.greenRibbon1} />
      <PurpleRibbon class={styles.purpleRibbon1} />
      <BlueRibbon class={styles.blueRibbon1} />
      <PurpleRibbon class={styles.purpleRibbon2} />
      <OrangeRibbon class={styles.orangeRibbon1} />
    </>
  );
};

const App = () => {
  const [decibels, setDecibels] = createSignal(0);
  const [counter, setCounter] = createSignal(10);
  const [isStart, setIsStart] = createSignal(false);

  const height = 600;

  const list = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      <div class="container flex flex-col justify-center items-center mx-auto mt-8">
        <div
          style={{ height: `${height}px`, "max-height": `${height}px` }}
          class="flex overflow-hidden relative flex-col items-center mb-3 bg-[#99CCCD]  w-[500px]"
        >
          {isWin() && <RibbonVictory />}
          <MerdekaText classname="mt-16 z-[5]" />
          <div
            id="decibel"
            style={{
              height: `${decibels() >= 600 ? 0 : height - decibels()}px`,
            }}
            class="absolute top-0 bg-white transition-all w-[500px] z-[4]"
          />
          <Bubbles />
        </div>
        <Switch>
          <Match when={!isStart() && !isWin()}>
            <button
              onClick={async () => {
                setIsStart(true);
                const timer = setInterval(() => {
                  setCounter((old) => old - 1);
                }, 1000);

                const audioContext = new AudioContext();
                const streamPromise = navigator.mediaDevices.getUserMedia({
                  audio: true,
                });
                streamPromise.then((stream) => {
                  const mic = audioContext.createMediaStreamSource(stream);
                  const analyser = audioContext.createAnalyser();
                  mic.connect(analyser);

                  const decibelInterval = setInterval(() => {
                    const dataArray = new Uint8Array(
                      analyser.frequencyBinCount
                    );
                    analyser.getByteFrequencyData(dataArray);
                    let tem_decibels = 0;

                    dataArray.forEach((data) => {
                      tem_decibels += data;
                    });
                    const level = 2;
                    const valueDec =
                      (10 * tem_decibels) / dataArray.length / level;

                    if (valueDec >= decibels()) {
                      setDecibels(valueDec);
                    }

                    if (decibels() >= height && counter() > 0) {
                      clearInterval(decibelInterval);
                      clearInterval(timer);
                      setIsWin(true);
                      setIsStart(false);
                    } else if (counter() === 0) {
                      clearInterval(decibelInterval);
                      clearInterval(timer);
                      setIsStart(false);
                      setDecibels(0);
                      setCounter(10);
                    }
                  }, 100);
                });
              }}
              class="z-10 pulse"
            >
              <PlayIcon />
            </button>
          </Match>
          <Match when={isStart() && !isWin()}>
            <div class="z-10 text-4xl pulse">{counter()}</div>
          </Match>
        </Switch>
      </div>
    </>
  );
};

export default App;
