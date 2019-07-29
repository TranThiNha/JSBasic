import React from 'react'
import axios from 'axios'
import _ from 'lodash'

class Newspaper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
        this.keyword = "thượng viện";
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
                this.setState({ data: rsNewspaper.data.data })
            }
        })
    }

    setDivAttr = (div, width, height, left, top) => {
        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.position = "absolute";
        div.style.backgroundColor = "#f1202020";
        div.style.top = top + "px";
        div.style.left = left + "px";
        div.style.zIndex = 99999;
    }

    paint = (item, index) => {
        let pic = document.getElementById("news");
        let secondWord = this.state.data[index + 1];
        let divColor = document.createElement('div');
        divColor.id = index;
        document.body.appendChild(divColor);
        if (secondWord.x < item.x) {
            this.setDivAttr(divColor, item.w, item.h, item.x, item.y + pic.offsetTop)

            let divAfter = document.createElement('div');
            divAfter.id = index + 1;
            document.body.appendChild(divAfter);
            this.setDivAttr(divAfter, secondWord.w, secondWord.h, secondWord.x, secondWord.y + pic.offsetTop)
        }
        else {
            this.setDivAttr(divColor, secondWord.x + secondWord.w - item.x, item.h > secondWord.h ? item.h : secondWord.h, item.x, (item.y < secondWord.y ? item.y : secondWord.y) + pic.offsetTop)
        }
    }

    render() {
        return (
            <div>
                <img style={{ width: 'auto', height: 'auto', position: "relative" }} id="news" alt="newspaper" src={require('../../assets/media/images/newspaper.jpg')} />
                {this.state.data && this.state.data.map((item, index) => {
                    let words = item.word + (this.state.data[index + 1] && " " + this.state.data[index + 1].word)
                    return _.includes(_.toLower(words), _.toLower(this.keyword)) && this.paint(item, index)
                })}
            </div>
        )
    }
}

export default Newspaper