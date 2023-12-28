const ControlPanel = (props) => {

    const fonts = ['Questrial', 'Pacifico', 'Houschka', 'FiraSans', "Times New Roman", "Arial"];

    const handleChange = (e, name) => {
        let value = e.target.value;
        props.setParams((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const inputSelectField = (label, name, options) => {

        return (
            <>
                <div className="row m-2" key={name}>
                    <div className="col-6 text-right">
                        <label htmlFor={name}>{label}</label>
                    </div>
                    <div className="col-6 text-left">
                        <select name={name} className="form-select" onChange={(e) => handleChange(e, name)} defaultValue={props.params[name]}>
                            {options.map((optionValue, i) => <option value={optionValue}  key={i}>{optionValue}</option>)}
                        </select>
                    </div>
                </div>
            </>
        );

    }

    const colorPicker = (label, name) => {
        return (<>
            <div className="row m-2" key={name}>
                <div className="col-6 text-right">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div className="col-6 text-left">
                    <input name={name} className="form-control" type="color" onChange={(e) => handleChange(e, name)} defaultValue={props.params[name]} />
                </div>
            </div>
        </>);
    }

    const inputTextField = (label, name) => {
        return (<>
            <div className="row m-2"  key={name}>
                <div className="col-6 text-right">
                    <label htmlFor={name}>{label}</label>
                </div>
                <div className="col-6 text-left">
                    <input name={name} className="form-control" type="text" onBlur={(e) => props.setPrompt(e.target.value)} />
                </div>
            </div>
        </>);
    }

    return (<>
        <h2 className="text-center">Control Panel</h2>
        {inputSelectField('Select Font:', 'font', fonts)}
        {colorPicker('Holiday Color:', 'hColor')}
        {colorPicker('Holiday background Color:', 'hBcolor')}
        {colorPicker('Normal Day Color:', 'nColor')}
        {colorPicker('Normal Day background Color:', 'nBcolor')}
        {colorPicker('Quote Color:', 'qColor')}
        {colorPicker('Quote background Color:', 'qBcolor')}
        {colorPicker('Heading Color:', 'hdColor')}
        {colorPicker('Heading background Color:', 'hdBcolor')} 
        {inputTextField('Theme Prompt', 'prompt')}       
    </>);

}

export default ControlPanel;