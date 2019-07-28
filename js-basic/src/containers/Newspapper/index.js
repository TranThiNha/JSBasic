import React from 'react'
import axios from 'axios'

class Newspaper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        let token = "";
        //login
        await axios.post("https://sso.reputa.vn/api/login", {
            password: "BAteam@2019",
            type: "LOGIN_REQUEST",
            username: "demo"
        }).then(rsLogin => {
            if (rsLogin.status === 200) {
                token = rsLogin.data.token
            }
        })

        // get data newspaper
        await axios.post('https://api.reputa.vn/newspaper/text-position/get-all', {
            ids: ["3939503848909830504"],
            indices: ["orm_article_190723"]
        }, {
                headers: {
                    Authorization: "VTCCSSO " + token,
                }
            },
        ).then(rsNewspaper => {
            if (rsNewspaper.data.code === 0) {
                this.setState({ data: rsNewspaper.data.data }, () => {
                    this.state.data.forEach((item, index) => {
                        this.paint(item, index)
                    })
                })
            }
        })
    }

    paint = (item, index) => {
        let divColor = document.getElementById(index)
        divColor.style.width = item.w + "px";
        divColor.style.height = item.h + "px"
        divColor.style.position = "absolute";
        divColor.style.backgroundColor = "#f1202020";
        divColor.style.top = item.y + "px";
        divColor.style.left = item.x + "px";
        divColor.style.zIndex = 99999;
    }

    render() {
        return (
            <div>
                <img style={{ width: 'auto', height: 'auto', position: "relative" }} id="news" alt="newspaper" src={require('../../assets/media/images/newspaper.jpg')} />
                {this.state.data && this.state.data.map((item, index) => (
                    <div id={index} key={index}></div>
                ))}
            </div>
        )
    }
}

export default Newspaper