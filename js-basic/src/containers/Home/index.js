import React from 'react'
import { Link, withRouter } from 'react-router-dom'

class Home extends React.Component {
    
    render() {
        return (
            <div className="home">
                <Link to='/moment/subtract'>Moment</Link>
                <Link to='/newspaper'>Newspaper</Link>
            </div>
        )
    }

}

export default withRouter(Home)