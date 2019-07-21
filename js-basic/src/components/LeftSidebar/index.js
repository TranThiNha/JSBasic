import React from 'react'
import { withRouter } from 'react-router-dom'

class LeftSidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.listFunction = [
            { param: 'subtract', name: 'subtract' },
            { param: 'add', name: 'add' },
            { param: 'diff', name: 'diff' },
            { param: 'startof', name: 'startof' },
            { param: 'endof', name: 'endof' },
            { param: 'format', name: 'format' },
            { param: 'weekday', name: 'weekday' },
            { param: 'day-in-month', name: 'day in month' },
            { param: 'get', name: 'get' },
            { param: 'set', name: 'set' },
        ]
    }

    redirect = (newParams) => {
        this.props.history.push(`/moment/${newParams}`)
    }

    render() {

        return (
            <div className="left-sidebar">
                {this.listFunction.map(item => (
                    <div key={item.param} onClick={() => this.redirect(item.param)} className="item">
                        {item.name}
                    </div>))}
            </div>
        )
    }
}

export default withRouter(LeftSidebar)