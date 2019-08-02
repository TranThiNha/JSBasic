import React from "react";
import axios from "axios";
import _ from "lodash";

class Newspaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.keyword = "cuộc bầu cử thượng viện";
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
    this.arrKeyword = _.orderBy(this.arrKeyword, "y", "asc");
    let index = -1;
    let line = -1;
    let findout = [];
    this.arrKeyword.forEach(a => {
      if (a.y + a.h !== line) {
        this.checkNearly(findout);
        findout = [];
        index = -1;
        line = a.y + a.h;
      }

      let itemIndex = _.findIndex(
        this.listWord,
        o => _.toLower(o) === _.toLower(a.word)
      );
      if (index === -1 || itemIndex === 0) {
        index = itemIndex;
        findout.push(a);
      }

      if (itemIndex === index + 1) {
        index = itemIndex;
        findout.push(a);
      }
    });
  };

  checkNearly = arr => {
    //inline
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

  paint = (item, index) => {
    let pic = document.getElementById("news");
    let secondWord = this.state.data[index + 1];
    let divColor = document.createElement("div");
    divColor.id = index;
    document.body.appendChild(divColor);
    if (secondWord.x < item.x) {
      this.setDivAttr(divColor, item.w, item.h, item.x, item.y + pic.offsetTop);

      let divAfter = document.createElement("div");
      divAfter.id = index + 1;
      document.body.appendChild(divAfter);
      this.setDivAttr(
        divAfter,
        secondWord.w,
        secondWord.h,
        secondWord.x,
        secondWord.y + pic.offsetTop
      );
    } else {
      this.setDivAttr(
        divColor,
        secondWord.x + secondWord.w - item.x,
        item.h > secondWord.h ? item.h : secondWord.h,
        item.x,
        (item.y < secondWord.y ? item.y : secondWord.y) + pic.offsetTop
      );
    }
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
