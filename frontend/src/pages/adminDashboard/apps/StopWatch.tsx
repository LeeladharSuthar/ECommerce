import { useEffect, useState } from "react";
import AdminSideBar from "../../../components/adminDashboard/AdminSideBar";

const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`

}

const StopWatch = () => {

    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false)

    useEffect(() => {
        let intervalId: any;
        if (isRunning)
            intervalId = setInterval(() => {
                setTime((prev) => prev + 1)
            }, 1000)
        return () => {
            clearInterval(intervalId)
        }

    }, [isRunning])

    return (
        <div className="adminContainer">
            <AdminSideBar />
            <main className="dashboardAppContainer">
                <h1>Stop Watch</h1>
                <section>
                    <div className="stopWatch">
                        <h2>{formatTime(time)}</h2>
                        <button onClick={() => setIsRunning(prev => !prev)}>{isRunning ? "Stop" : "Start"}</button>
                        <button onClick={() => { setTime(0); setIsRunning(false) }}>Reset</button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default StopWatch