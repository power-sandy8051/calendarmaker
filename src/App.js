import { useState, useEffect, useRef } from 'react';
import './assets/css/bootstrap.min.css';
import './assets/css/index.css';

import CalendarLayout from './components/calendar.layout';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import WebFont from 'webfontloader';

import ControlPanel from './components/control.panel';

WebFont.load({
    custom: {
        families: ['Questrial', 'Pacifico', 'Houschka', 'FiraSans'],
    },
});

function App() {

    const calendar = useRef(null);

    const [params, setParams] = useState({
        "font": "Questrial",
        "hColor": "#ff0000",
        "hBcolor": "#ffffff",
        "nBcolor": "#ffffff",
        "nColor": "#000000",
        "hdBcolor": "#000000",
        "hdColor": "#ffffff",
        "qBcolor": "#000000",
        "qColor": "#ffffff",
    });

    const [month, setMonth] = useState(undefined);
    const [monthImages, setMonthImages] = useState([]);
    const [prompt, setPrompt] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const printCalendar = async (e) => {

        setMonthImages([]);

        for (let i = 0; i <= 12; i++) {
            await setMonth(i);
            await printMonth(i);
        }
    };

    const printMonth = async (monthIndex) => {
        const containerElement = calendar.current;

        function filter(node) {
            return node.tagName !== 'BUTTON';
        }

        let dataUrl = await domtoimage.toJpeg(containerElement, {
            bgcolor: '#fff', filter: filter, style: {
                'left': '0px'
            }
        });

        setMonthImages((prev) => {
            let newMonthImages = [...prev, dataUrl];
            return newMonthImages;
        });
    };

    const printFullCalendar = () => {

        const pdf = new jsPDF({ format: 'a4' });

        let filteredResults = monthImages.slice(1, 13);

        const pageWidth = 210;
        const pageHeight = 297;
        const imagesPerRow = 1;
        const imagesPerColumn = 2;
        const noOfImages = 12;
        const border = 2;
        const spacing = 1;

        const noOfImagePerPage = imagesPerRow * imagesPerColumn;
        const noOfPages = noOfImages / (noOfImagePerPage);

        const imageWidth = (pageWidth - (imagesPerRow - 1) * spacing - 2 * border) / imagesPerRow;
        const imageHeight = (pageHeight - (imagesPerColumn - 1) * spacing - 2 * border) / imagesPerColumn;

        for (let i = 0; i < noOfPages; i++) {

            if (i != 0) {
                pdf.addPage();
            }

            for (let row = 0; row < imagesPerRow; row++) {
                for (let col = 0; col < imagesPerColumn; col++) {
                    const xPosition = border + row * (imageWidth + spacing);
                    const yPosition = border + col * (imageHeight + spacing);
                    const imageUrl = filteredResults[noOfImagePerPage * i + row + col * imagesPerRow];

                    pdf.addImage(imageUrl, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
                }
            }
        }

        pdf.save('output.pdf');
    }

    useEffect(() => {
        if (monthImages.length == 13) {
            printFullCalendar();
        }
    }, [monthImages]);

    return (
        <div className='container px-10'>
            {isLoading && <div className="loader"></div>}
            <div className='row'>
                <div className='col-8' ref={calendar}>
                    <CalendarLayout
                        printCalendar={printCalendar}
                        params={params}
                        setMonth={setMonth}
                        month={month}
                        prompt={prompt}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </div>
                <div className='col-4'>
                    <ControlPanel
                        params={params}
                        setParams={setParams}
                        prompt={prompt}
                        setPrompt={setPrompt}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
