import "./control.scss"
import { IoPlay } from 'react-icons/io5';
import { IoIosRemoveCircle } from 'react-icons/io';
import { FaStop } from 'react-icons/fa';
import { MdFreeBreakfast } from 'react-icons/md';
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdOutlineWork } from 'react-icons/md';
import { GiPauseButton } from 'react-icons/gi';
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Resume, Reset, Increment, Decrement } from "../../redux/actions/userActions";
import { useEffect, useRef } from "react";

export function waitForMounting(ref) {
    if (!ref) {
        setTimeout(waitForMounting, 0, ref)
    }
    else { return ref.id }
}

export default function Control() {
    const { resume, breakTime, sessionTime, toggleReset } = useSelector((state) => state)
    const element = useRef({});
    const dispatch = useDispatch();

    const handleIncrement = useCallback(e => {
        dispatch(Increment(e.currentTarget.id))
    }, [dispatch])

    const handleDecrement = useCallback(e => {
        dispatch(Decrement(e.currentTarget.id))
    }, [dispatch])

    useEffect(() => {
    }, [breakTime, resume, sessionTime, toggleReset])

    return (
        <div id="control">
            <div className="blank-div" id="first-blank"></div>
            <div className="blank-div"></div>
            <div id="start-stop-reset-area">
                <button></button>
                <button id="start_stop" onClick={() => dispatch(Resume())} ref={(ref) => { element.current[waitForMounting(ref)] = ref }}>{resume ? (<span><GiPauseButton className="icon icon-pause" /></span>) : (<span><IoPlay className="icon icon-start" /></span>)}</button>
                <button id="reset" onClick={() => dispatch(Reset())} ref={(ref) => element.current[waitForMounting(ref)] = ref}><FaStop className="icon icon-reset" /></button>
            </div>
            <div id="configuration-area">
                <div id="session-bar">
                    <span id="session-label"><MdOutlineWork className="icon" /></span>
                    <div id="session-length" className="value-box">{sessionTime}</div>
                    <div className="button-group">
                        <button onClick={handleDecrement} id="session-decrement" ref={(ref) => element.current[waitForMounting(ref)] = ref}><span><IoIosRemoveCircle className="add-sub sub" /></span></button>
                        <button onClick={handleIncrement} id="session-increment" ref={(ref) => element.current[waitForMounting(ref)] = ref}><span><AiFillPlusCircle className="add-sub add" /></span></button>
                    </div>
                </div>
                <div id="break-bar">
                    <span id="break-label"><MdFreeBreakfast className="icon" /></span>
                    <div id="break-length" className="value-box">{breakTime}</div>
                    <div className="button-group">
                        <button onClick={handleDecrement} id="break-decrement" ref={(ref) => element.current[waitForMounting(ref)] = ref}><span><IoIosRemoveCircle className="add-sub sub" /></span></button>
                        <button onClick={handleIncrement} id="break-increment" ref={(ref) => element.current[waitForMounting(ref)] = ref}><span><AiFillPlusCircle className="add-sub add" /></span></button>
                    </div>
                </div>
            </div>
            <div className="blank-div"></div>
        </div>
    )
}