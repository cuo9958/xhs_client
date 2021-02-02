import React from 'react';
import axios from 'axios';
import cheerio from 'cheerio';

import SelectFile from '../../components/select_file';
import JianNumber from '../../components/jian_number';
import DataList from '../../components/data_list';
import { ipcRenderer } from 'electron';

function getData(obj: any, keys: string[]) {
  if (!obj || !keys || keys.length === 0) return '';
  return keys.reduce((pre, curr) => pre[curr], obj);
}
interface iState {
  timestamp: number;
  urls: string[];
  btnState: number;
  result: any[];
}

interface iRule {
  name: string;
  reg: any;
  type?: string;
  key?: string[];
  index?: number;
}
let rules: iRule[] = [
  {
    name: '作者地址',
    reg: "script[type='application/ld+json']",
    index: 0,
    type: 'json',
    key: ['author', 'url'],
  },
  {
    name: '昵称',
    reg: '.name',
  },
  {
    name: '笔记',
    reg: '.inner .note',
  },
  {
    name: '粉丝',
    reg: '.inner .fans',
  },
  {
    name: '赞藏数',
    reg: '.inner .collect',
  },
  {
    name: '标题',
    reg: '.note-top .title',
  },
  {
    name: '发布时间',
    reg: '.publish-date',
  },
  {
    name: '喜欢',
    reg: '.operation-block .like span',
  },
  {
    name: '评论',
    reg: '.operation-block .comment span',
  },
  {
    name: '点赞',
    reg: '.operation-block .star span',
  },
];

let timer: any = null;
let currIndex = -1;
export default class extends React.Component<any, iState> {
  constructor(props: any) {
    super(props);
    this.state = {
      timestamp: 1000,
      urls: [],
      btnState: 0,
      result: [],
    };
  }

  render() {
    return (
      <div id="home">
        <div className="top">
          <SelectFile onSelect={(str) => this.onTxtSelect(str)} />
          <JianNumber
            num={this.state.timestamp}
            onChange={(e) => this.onTimeChange(e)}
          />
          <button className="btn">设置规则</button>
          <button className="btn" onClick={() => this.start()}>
            {this.state.btnState === 0 ? '开始' : '暂停'}
          </button>
          {this.state.result.length > 0 && (
            <button onClick={() => this.down()} className="btn">
              下载
            </button>
          )}
        </div>
        <div id="content">
          <div>
            已上传{this.state.urls.length}条笔记，已查询
            {this.state.result.length}条数据，当前查询第{currIndex + 1}条。
          </div>
          <DataList rules={rules} list={this.state.result} />
        </div>
      </div>
    );
  }

  onTxtSelect(txts: string) {
    const list = txts.split(/[(\r\n)\r\n]+/);
    this.setState({
      urls: list,
    });
  }
  onTimeChange(timestamp: number) {
    this.setState({
      timestamp,
    });
  }
  start() {
    if (timer) {
      clearInterval(timer);
      this.setState(
        {
          btnState: 0,
        },
        () => {
          timer = null;
        }
      );
    } else {
      this.setState({
        btnState: 1,
      });
      currIndex = -1;
      timer = setInterval(() => this.getData(), this.state.timestamp);
    }
  }
  getData() {
    currIndex++;
    if (currIndex >= this.state.urls.length) {
      return this.start();
    }
    const url = this.state.urls[currIndex];
    console.log('获取url的内容', url);
    axios(url)
      .then((res) => {
        if (res.status === 200) {
          this.parseData(res.data);
        } else {
          console.log('失败的', url);
        }
      })
      .catch((err) => console.log(err));
  }

  parseData(htmls: any) {
    const $ = cheerio.load(htmls);
    const data: string[] = [];
    rules.forEach((item) => {
      let dom = $(item.reg);
      if (item.index !== undefined) {
        dom = dom.eq(item.index);
      }
      let txt: any = '';

      if (item.type === 'json') {
        txt = dom.html();
        try {
          const obj = JSON.parse(txt);
          txt = getData(obj, item.key || []);
        } catch (error) {
          console.log(error, txt);
        }
      } else {
        txt = dom.text();
      }
      data.push(txt);
      console.log('查询', item.name, txt);
    });
    this.state.result.push(data);
    this.forceUpdate();
  }

  down() {
    if (this.state.result.length === 0) return;
    let titles: string[] = [];
    rules.forEach((item) => titles.push(item.name));
    let list = [titles, ...this.state.result];
    ipcRenderer.send('write_xls', JSON.stringify(list));
  }
}
