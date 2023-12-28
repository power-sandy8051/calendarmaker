import { useEffect, useState } from "react";
import axios from "axios";
import client from "../services/api";

import WineGlass from "../assets/images/wine-glass.jpg";

const CalendarLayout = (props) => {

    let today = new Date();
    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Tursday", "Friday", "Saturday"];
    const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [currentYear, currentMonth] = [today.getFullYear(), today.getMonth()];
    const [date, setDate] = useState(new Date(`${currentYear}-${currentMonth + 1}-01`));
    const [finalMonthData, setFinalMonthData] = useState([]);
    const [images, setImages] = useState(new Array(12).fill(WineGlass));
    const [quotes, setQuotes] = useState(new Array(12).fill(""));
    const [showEditor, setShowEditor] = useState(false);

    const daysInMonth = (month, year) => {
        return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
    }

    const addMonth = (months) => {
        var newDate = new Date(date);
        newDate.setMonth(date.getMonth() + months);
        setDate(newDate);
    }

    const getImage = async () => {
        props.setIsLoading(true);
        let responseUrls = await client(props.prompt);
        setImages((prev) => {
            let newImages = responseUrls.map(img => img.url ? img.url : WineGlass);
            return newImages;
        });
        props.setIsLoading(false);
    };

    const updateImage = (e) => {
        let image = e.target.files[0];
        let imageUrl = URL.createObjectURL(image);
        setImages((prev) => {
            let newImages = [...prev];
            newImages[date.getMonth()] = imageUrl;
            return newImages;
        });
    }

    const updateQuote = (e) => {
        let text = e.target.value;
        setQuotes((prev) => {
            let newQuotes = [...prev];
            newQuotes[date.getMonth()] = text;
            return newQuotes;
        });
    }

    const setMonth = (month) => {
        var newDate = new Date(date);
        newDate.setMonth(month);
        setDate(newDate);
    }

    useEffect(() => {
        if (props.month == undefined) return;
        setMonth(props.month);
    }, [props.month]);

    useEffect(() => {
        if (props.prompt) {
            getImage();
        }
    }, [props.prompt]);

    useEffect(() => {
        images.forEach(element => {
            axios.get(element);
        });
    }, [images]);

    useEffect(() => {

        const startingDayIndex = date.getDay();

        var monthData = [];

        let dayCount = 1;

        let monthDays = daysInMonth(date.getMonth(), date.getFullYear());

        for (let i = 1; dayCount <= monthDays; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                // First Week.
                if ((monthData.length === 0 && j < startingDayIndex) || (dayCount > monthDays)) {
                    week.push(undefined);
                } else {
                    week.push(dayCount);
                    dayCount++;
                }
            }
            monthData.push(week);
        }

        let monthDataMap = [];

        // Map days to dates
        for (let i = 0; i < daysName.length; i++) {
            monthDataMap.push({
                "dayName": daysName[i],
                "days": monthData.map(week => week[i])
            });
        }

        setFinalMonthData(monthDataMap);

    }, [date]);

    const dataRow = (day, i) => {
        return (<>
            <div className="row" style={{
                "color": day.dayName === "Sunday" ? props.params.hColor : props.params.nColor,
                "backgroundColor": day.dayName === "Sunday" ? props.params.hBcolor : props.params.nBcolor
            }} key={i}>
                <div className="col days">
                    <h3>{day.dayName[0]}</h3>
                </div>
                {day.days.map((date, k) => <div className="col days" key={k}>{date}</div>)}
            </div >
        </>);
    }

    return (
        <div className="container py-1" style={{ "fontFamily": props.params.font }}>
            <div className="row header-row month-name" style={{
                "color": props.params.hdColor,
                "backgroundColor": props.params.hdBcolor
            }}>
                <h2>{monthsName[date.getMonth()]} - {date.getFullYear()}</h2>
            </div>
            <div className="row">
                <div className="col-8">
                    {finalMonthData.map((day, i) => {
                        return dataRow(day, i);
                    })}
                </div>
                <div className="col-4 g-0">
                    <label htmlFor="image">
                        <img src={images[date.getMonth()]} />
                    </label>
                </div>
                <input type="file" id="image" onChange={updateImage} />
            </div>
            <div className="row header-row month-name" style={{
                "color": props.params.qColor,
                "backgroundColor": props.params.qBcolor
            }}>
                <h3 onDoubleClick={() => setShowEditor(true)}>{quotes[date.getMonth()] === "" ? `${monthsName[date.getMonth()]} - ${date.getFullYear()}` : quotes[date.getMonth()]}</h3>
                {showEditor && (<>
                    <input type="text" className="form-control form-control-sm" onChange={updateQuote} />
                    <button className="btn btn-sm btn-primary" onClick={() => setShowEditor(false)}>Save</button>
                </>)}
            </div>

            <div className='container text-center p-2'>
                <div className="row">
                    <div className="col-2">
                        <button className="btn btn-primary btn-sm g-0 h-100 w-100" onClick={() => addMonth(-1)}>{"<"}</button>
                    </div>
                    <div className="col-8">
                        <button className="btn btn-primary btn-sm g-0 h-100 w-100" onClick={props.printCalendar}>Print</button>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary btn-sm g-0 h-100 w-100" onClick={() => addMonth(1)}>{">"}</button>
                    </div>
                </div>
            </div>

        </div>);
};

export default CalendarLayout;