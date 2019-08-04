import React from "react";
import axios from "axios";
import _ from "lodash";

class Newspaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.keyword = "có thể thông qua";
    this.listWord = this.keyword.split(" ");
    this.arrKeyword = [];
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.findKeyword();
    }
  }

  findKeyword = () => {
    this.state.data &&
      this.state.data.forEach(item => {
        if (_.find(this.listWord, o => _.toLower(o) === _.toLower(item.word))) {
          this.arrKeyword.push(item);
        }
      });
    this.checkKeyword();
  };

  fetchData = async () => {
    let token = "";
    //login
    await axios
      .post("https://sso.reputa.vn/api/login", {
        password: "BAteam@2019",
        type: "LOGIN_REQUEST",
        username: "demo"
      })
      .then(rsLogin => {
        if (rsLogin.status === 200) {
          token = rsLogin.data.token;
        }
      });

    // get data newspaper
    await axios
      .post(
        "https://api.reputa.vn/newspaper/text-position/get-all",
        {
          ids: ["3939503848909830504"],
          indices: ["orm_article_190723"]
        },
        {
          headers: {
            Authorization: "VTCCSSO " + token
          }
        }
      )
      .then(rsNewspaper => {
        if (rsNewspaper.data.code === 0) {
          this.setState({ data: rsNewspaper.data.data });
        }
      });
  };

  checkKeyword = () => {
    let findout = [];
    for (let i = 0; i < this.arrKeyword.length; i++) {
      findout.push(this.arrKeyword[i]);
      for (let j = i+1; j < this.arrKeyword.length; j++) {
        if (i === j) {
          break;
        }
        let a = this.arrKeyword[i];
        let b = this.arrKeyword[j];
        if (a.y >= b.y + b.h || a.y + a.h <= b.y) {
          break;
        }
        else{
          findout.push(b)
        }
      }
      this.checkNearly(findout);
      findout = [];
    }
  };

  checkNearly = arr => {
    arr = _.orderBy(arr, 'x', 'asc')
    let pic = document.getElementById("news");
    if (arr.length === this.listWord.length) {
      for (let index = 0; index < arr.length - 1; index++) {
        const element = arr[index];
        if (element.x + 1.5 * element.w < arr[index + 1].x) {
          return;
        }
      }
      let divColor = document.createElement("div");
      document.body.appendChild(divColor);
      this.setDivAttr(
        divColor,
        arr[arr.length - 1].x + arr[arr.length - 1].w - arr[0].x,
        arr[0].h,
        arr[0].x,
        arr[0].y + pic.offsetTop
      );
    }
  };

  setDivAttr = (div, width, height, left, top) => {
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.position = "absolute";
    div.style.backgroundColor = "#f1202020";
    div.style.top = top + "px";
    div.style.left = left + "px";
    div.style.zIndex = 99999;
  };

  render() {
    return (
      <div>
        <img
          style={{ width: "auto", height: "auto", position: "relative" }}
          id="news"
          alt="newspaper"
          src={require("../../assets/media/images/newspaper.jpg")}
        />
      </div>
    );
  }
}

export default Newspaper;
