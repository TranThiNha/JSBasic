import React from "react";
import axios from "axios";
import _ from "lodash";

class Newspaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
    this.keyword = "Thượng viện Nhật Bản";
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
    this.checkInline();
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

  checkInline = () => {
    let findout = [];
    for (let i = 0; i < this.arrKeyword.length - 1; i++) {
      findout.push(this.arrKeyword[i]);
      for (let j = i+1; j < this.arrKeyword.length; j++) {
        let a = this.arrKeyword[i];
        let b = this.arrKeyword[j];
        const maxDiff = a.h > b.h ? a.h / 2 : b.h / 2;
      
        if (!(Math.abs(a.y - b.y)> maxDiff)) {
          findout.push(b);
          // _.remove(this.arrKeyword, o => o.x === b.x && o.y === b.y) 
          // console.log('zzz arrKeyword', this.arrKeyword)
        }
      }
      this.checkNearly(findout);
      findout = [];
    }
  };

  checkNearly = arr => {
    arr = _.orderBy(arr, 'x', 'asc');
    if (arr.length >= this.listWord.length) {
      let flag = -1;
      for (let index = 0; index < arr.length - 1; index++) {
          const element = arr[index];
          if (_.findIndex(this.listWord, o => o === element.word) === flag + 1){
            flag++;
            if (this.listWord.length === 1){
              this._paint(arr, index);
            }
            if (element.x + 1.5 * element.w > arr[index + 1].x) {
              if (flag === this.listWord.length - 2){
                this._paint(arr, index+1);
                flag = -1;
              }
          }
          else flag = -1;
        }
        else{
          flag = -1;
        }
      }
    }
  };

  _paint = (arr, end) => {
    let pic = document.getElementById("news");
    let divColor = document.createElement("div");
    document.body.appendChild(divColor);
    if (this.listWord.length === 1){
      this.setDivAttr(
        divColor,
        arr[end].w,
        arr[end].h,
        arr[end].x,
        arr[end].y + pic.offsetTop
      );
    }
    else{
    let start =  end - this.listWord.length + 1;
    this.setDivAttr(
      divColor,
      arr[end].x + arr[end].w - arr[start].x,
      arr[end].h > arr[start].h ? arr[end].h : arr[start].h,
      arr[start].x,
      arr[start].y < arr[end].h ? arr[start].y + pic.offsetTop : arr[end].y + pic.offsetTop
    );
    }
  }

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
