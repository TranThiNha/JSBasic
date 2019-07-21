import React from 'react'
import LeftSidebar from '../../components';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { withRouter } from 'react-router-dom'

class MomentContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.match.params.type,
            startDate: null,
            endDate: new Date(),
            textInput: null,
            valueChange: "",
            result: "",
            unit: null,
            listUnit: []
        };
        this.dateTimeUnit = [
            { value: 'day', name: "Ngày" },
            { value: 'month', name: "Tháng" },
            { value: 'year', name: "Năm" },
            { value: 'hour', name: "Giờ" },
            { value: 'minute', name: "Phút" },
            { value: 'second', name: "Giây" },
        ];
        this.typeFormat = [
            { value: 'DD/MM/YYYY', name: "DD/MM/YYYY" },
            { value: 'MM/DD/YYYY', name: "MM/DD/YYYY" },
            { value: 'YYYY/MM/DD', name: "YYYY/MM/DD" },
            { value: 'DD/MM/YYYY HH:mm:ss', name: "DD/MM/YYYY HH:mm:ss" },
            { value: 'MM/DD/YYYY HH:mm:ss', name: "MM/DD/YYYY HH:mm:ss" },
            { value: 'YYYY/MM/DD HH:mm:ss', name: "YYYY/MM/DD HH:mm:ss" },
        ]
    }

    handleChange = (date) => {
        if (this.state.startDate) {
            if (moment(date).isAfter(this.state.endDate)) {
                this.setState({
                    startDate: this.state.endDate,
                    endDate: date
                })
            }
            else {
                this.setState({
                    startDate: date
                })
            }
        }
        else {
            this.setState({
                endDate: date
            });
        }
    }

    componentDidMount() {
        this.getFunctionDisplay(this.state.type)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.type !== this.props.match.params.type) {
            this.setState({ type: this.props.match.params.type }, () => {
                this.getFunctionDisplay(this.state.type)
            })
        }
    }

    caculate = () => {
        let rs;
        switch (this.state.type) {
            case 'subtract':
                rs = moment(this.state.endDate).subtract(this.state.valueChange, 'days').format('DD/MM/YYYY')
                break;
            case 'add':
                rs = moment(this.state.endDate).add(this.state.valueChange, 'days').format('DD/MM/YYYY')
                break;
            case 'diff':
                rs = moment(this.state.endDate).diff(this.state.startDate, 'days')
                break;
            case 'startof':
                rs = moment(this.state.endDate).startOf(this.state.unit).format('DD/MM/YYYY HH:mm:ss')
                break;
            case 'endof':
                rs = moment(this.state.endDate).endOf(this.state.unit).format('DD/MM/YYYY HH:mm:ss')
                break;
            case 'format':
                rs = moment(this.state.endDate).format(this.state.unit)
                break;
            case 'weekday':
                rs = moment(this.state.endDate).weekday();
                break;
            case 'day-in-month':
                rs = moment(this.state.endDate).daysInMonth();
                break;
            case 'get':
                rs = moment(this.state.endDate).get(this.state.unit)
                break;
            case 'set':
                rs = this.state.endDate;
                rs = moment(rs).set(this.state.unit, this.state.valueChange).format('DD/MM/YYYY HH:mm:ss')
                break;
            default: break;
        }
        this.setState({ result: rs })
    }

    getFunctionDisplay = (type) => {
        this.setState({ textInput: null, startDate: null, unit: null, result: "" })

        switch (type) {
            case 'subtract':
                this.setState({ textInput: "Nhập số ngày muốn trừ" })
                break;
            case 'add':
                this.setState({ textInput: "Nhập số ngày muốn cộng" })
                break;
            case 'diff':
                this.setState({ startDate: new Date() })
                break;
            case 'startof':
                this.setState({ unit: 'day', listUnit: this.dateTimeUnit })
                break;
            case 'endof':
                this.setState({ unit: 'day', listUnit: this.dateTimeUnit })
                break;
            case 'format':
                this.setState({ unit: 'DD/MM/YYYY', listUnit: this.typeFormat })
                break;
            case 'weekday':
            case 'day-in-month':
                break;
            case 'get':
                this.setState({ unit: 'date', listUnit: this.dateTimeUnit })
                break;
            case 'set':
                this.setState({ textInput: "Nhập giá trị muốn đổi", listUnit: this.dateTimeUnit, unit: 'day' })
                break;

            default: break;
        }
    }

    handleChangeUnit(event) {
        this.setState({ unit: event.target.value });
    }

    renderMainContent = () => {
        return (<div className="right">
            <div className="title">{this.props.match.params.type}</div>
            <div className="main-content">
                <DatePicker
                    selected={this.state.endDate}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChange}
                    dateFormat="dd/MM/yyyy"
                />

                {this.state.unit &&
                    <select value={this.state.unit} onChange={(e) => this.handleChangeUnit(e)} 
                    className="mdb-select md-form">
                        {this.state.listUnit.map(item =>
                            <option key={item.value} value={item.value}>{item.name}</option>)}
                    </select>}

                {this.state.textInput &&
                    <input className="form-control" type="number" min='0' placeholder={this.state.textInput} value={this.state.valueChange}
                        onChange={e => this.setState({ valueChange: e.target.value })} />}

                <button className="btn btn-success" onClick={() => this.caculate()}>KẾT QUẢ</button>
                <div className="btn result">{this.state.result}</div>
            </div>
        </div>
        )
    }


    render() {
        return (
            <div className="moment-container">
                <LeftSidebar />
                {this.renderMainContent()}
            </div>
        )
    }
}

export default withRouter(MomentContainer)
