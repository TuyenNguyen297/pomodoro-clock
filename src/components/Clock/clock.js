import "./clock.scss"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { waitForMounting } from '../Control/control.js'

function minToSec(min) {
    return min * 60
}

function mapTimetoProgressBar(element, time, timeLength) {
    const elementStyle = window.getComputedStyle(element, null);
    const perimeter = 2 * Math.PI * parseInt(elementStyle.getPropertyValue("r").match(/\d+/g)[0]);
    const step = (timeLength - time) / timeLength * perimeter
    const root = document.querySelector(":root");
    root.style.setProperty("--progress", step);
}

export default function Clock() {
    const { resume, breakTime, sessionTime, toggleReset } = useSelector((state) => state);
    const [time, setTime] = useState(minToSec(sessionTime));
    const [turn, setTurn] = useState("Session")

    const lastLength = useRef({ sessionTime: sessionTime, breakTime: breakTime });
    const reset = useRef(toggleReset);
    const audio = useRef({});
    const circle = useRef({})
    const reload = useRef(true);


    const updateLength = useCallback((curLength) => {
        const subjectBeingChanged = Object.keys(lastLength.current).reduce((differ, subject) => {
            differ = Object.assign({}, differ, curLength[subject] !== lastLength.current[subject] ? { [subject]: curLength[subject] } : differ)
            return differ;
        }, {})
        lastLength.current = Object.assign({}, lastLength.current, subjectBeingChanged)
        if (Object.keys(subjectBeingChanged)[0].match(new RegExp(turn, "ig"))) {
            setTime(minToSec(time + (Object.values(subjectBeingChanged)[0] - time)))
            mapTimetoProgressBar(circle.current["solid-progress"], time, time)
        }
    }, [time, turn])

    const countdown = useCallback(() => {
        if (resume) {
            if (!time) {
                setTurn(turn === "Session" ? "Break" : "Session");
                audio.current["beep"].play();
            }
            const nextLength = turn === "Session" ? minToSec(breakTime) : minToSec(sessionTime);
            setTime(time === 0 ? nextLength : time - 1);
            mapTimetoProgressBar(circle.current["solid-progress"], time, minToSec(turn === "Session" ? sessionTime : breakTime))
        }
    }, [breakTime, resume, sessionTime, time, turn])


    useEffect(() => {
        if (toggleReset !== reset.current) {
            reset.current = toggleReset;
            audio.current["beep"].load();
            reload.current = false;
            setTurn("Session")
            setTime(minToSec(sessionTime));
            mapTimetoProgressBar(circle.current["solid-progress"], sessionTime, sessionTime)
        }

        const currentLength = { sessionTime: sessionTime, breakTime: breakTime };
        if (JSON.stringify(currentLength) !== JSON.stringify(lastLength.current)) updateLength(currentLength);

        //const rollback = setInterval(() => countup(), 0);
        const period = setInterval(() => countdown(), 1000);
        return () => { clearInterval(period); /*clearInterval(rollback)*/ }
    }, [countdown, time, toggleReset])

    return (
        <div id="clock">
            <audio id="beep" ref={(ref) => { audio.current[waitForMounting(ref)] = ref }} preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
            <svg width="100%" height="100%">
                <defs>
                    <g id="gradient-collection">
                        <linearGradient id="gradient-outer-mask">
                            <stop offset="0%" stopColor="#f9e1f4" />
                            <stop offset="100%" stopColor="#e0d9fa" />
                        </linearGradient>
                        <linearGradient id="gradient-outer-progress">
                            <stop offset="0%" stopColor="#ee3ae1" />
                            <stop offset="100%" stopColor="#7755e9" />
                        </linearGradient>
                        <linearGradient id="gradient-inner-progress" gradientTransform="rotate(90)">
                            <stop offset="0%" stopColor="#7d58f6" />
                            <stop offset="100%" stopColor="#7953f8" />
                        </linearGradient>
                    </g>
                    <g id="filter-collection">
                        <filter id="inner-circle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feComponentTransfer in="SourceAlpha">
                                <feFuncA type="table" tableValues="0 1"></feFuncA>
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation="4"></feGaussianBlur>
                            <feOffset dx="-2" dy="-1" result="offsetBlur"></feOffset>
                            <feFlood floodColor="rgba(0,0,0,0.6)" result="colorOffsetBlur"></feFlood>
                            <feComposite in="offsetBlur" operator="in"></feComposite>
                            <feComposite in="SourceGraphic" operator="over"></feComposite>
                        </filter>

                        <filter id="inner-progress-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feComponentTransfer in="SourceAlpha">
                                <feFuncA type="table" tableValues="0 1"></feFuncA>
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation="2.5"></feGaussianBlur>
                            <feOffset dx="4.5" dy="-1" in="blur" result="offsetBlur"></feOffset>
                            <feFlood floodColor="rgb(255,255,255,1)" ></feFlood>
                            <feComposite in2="offsetBlur" operator="atop"></feComposite>
                            <feBlend in="SourceGraphic" mode="normal" result="1"></feBlend>

                            <feComponentTransfer in="SourceAlpha">
                                <feFuncA type="table" tableValues="0 1"></feFuncA>
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation="4"></feGaussianBlur>
                            <feOffset dx="0.8" dy="0" in="blur" result="offsetBlur"></feOffset>
                            <feFlood floodColor="rgb(0,0,0,0.1)" ></feFlood>
                            <feComposite in2="offsetBlur" operator="atop"></feComposite>
                            <feBlend in="SourceGraphic" mode="normal" result="2"></feBlend>

                            <feBlend in="1" in2="2" mode="normal"></feBlend>
                        </filter>

                        <filter id="middle-circle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feComponentTransfer in="SourceAlpha">
                                <feFuncA type="table" tableValues="1 0"></feFuncA>
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation="5"></feGaussianBlur>
                            <feOffset dx="4" dy="5" result="offsetBlur"></feOffset>
                            <feFlood floodColor="rgba(0,0,0,0.2)" result="colorOffsetBlur"></feFlood>
                            <feComposite in="offsetBlur" operator="in"></feComposite>
                            <feComposite in="SourceAlpha" operator="in"></feComposite>
                            <feBlend in="SourceGraphic" mode="multiply"></feBlend>
                        </filter>
                    </g>
                </defs>

                <g id="circle" shapeRendering="geometricPrecision">
                    <circle id="solid-background" cx="50%" cy="50%" stroke="url(#gradient-outer-mask)" />
                    <circle id="dash-circle" cx="50%" cy="50%" stroke="url(#gradient-outer-progress)" />
                    <circle id="dash-mask" cx="50%" cy="50%" />
                    <circle id="middle-circle" cx="50%" cy="50%" filter="url(#middle-circle-shadow)" />
                    <circle id="solid-progress" ref={(ref) => circle.current[waitForMounting(ref)] = ref} cx="50%" cy="50%" stroke="url(#gradient-inner-progress)" filter="url(#inner-progress-shadow)" />
                    <circle id="point-progress" cx="50%" cy="50%" stroke="url(#gradient-inner-progress)" filter="url(#inner-circle-shadow)" />
                    <circle id="inner-circle" cx="50%" cy="50%" filter="url(#inner-circle-shadow)" />
                </g>
                <g id="text">
                    <g id="text">
                        <text id="timer-label" x="50%" y="44%" textAnchor="middle">{turn}</text>
                        <text id="time-left" x="50%" y="51%" textAnchor="middle">{`${Math.trunc(time / 60 / 10)}${Math.trunc(time / 60 % 10)} : ${Math.trunc(time % 60 / 10)}${Math.trunc(time % 60 % 10)}`}</text> */}
                    </g>
                </g>

            </svg>
        </div >
    )
}


// {/* <foreignObject x="35%" y="43%" width="30%" height="55">
// <p id="timer-label">{turn}</p>
// <p id="time-left">{`${Math.trunc(time / 60 / 10)}${Math.trunc(time / 60 % 10)}:${Math.trunc(time % 60 / 10)}${Math.trunc(time % 60 % 10)}`}</p>
// </foreignObject> */}

// {/* <g id="text">
// {/* <text id="timer-label" x="50%" y="41%" textAnchor="middle">{turn}</text>
// <text id="time-left" x="50%" y="51%" textAnchor="middle">{`${Math.trunc(time / 60 / 10)}${Math.trunc(time / 60 % 10)}:${Math.trunc(time % 60 / 10)}${Math.trunc(time % 60 % 10)}`}</text> */}
// </g> */}


    // const countup = useCallback(() => {

    //     if (!reload.current) {
    //         if (turn === "Session") {
    //             setTime(time < minToSec(sessionTime) ? time + 1 : time);
    //             mapTimetoProgressBar(circle.current["solid-progress"], time, minToSec(sessionTime))
    //             if (time === minToSec(sessionTime)) { reload.current = true }
    //         }
    //         else {
    //             setTime(minToSec(sessionTime));
    //             mapTimetoProgressBar(circle.current["solid-progress"], minToSec(sessionTime), minToSec(sessionTime))
    //             setTurn("Session")
    //             reload.current = true;
    //         }
    //     }
    // }, [sessionTime, time, turn])