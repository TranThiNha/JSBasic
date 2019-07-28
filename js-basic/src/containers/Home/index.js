import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { routes } from '../../constants/routeConfig'

class Home extends React.Component {
    
    render() {
        return (
            <div className="home">
                <Link to={routes.moment.path}>Moment</Link>
                <Link to={routes.newspaper.path}>Newspaper</Link>
            </div>
        )
    }

}

export default withRouter(Home)