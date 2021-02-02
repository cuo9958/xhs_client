import React from 'react';

interface iProps {
  num: number;
  onChange: (num: number) => void;
}
export default class extends React.Component<iProps> {
  render() {
    return (
      <div className="jian_number btn">
        <input
          type="text"
          value={this.props.num}
          name="jian_number"
          className="jian_number_input"
          onChange={(e) => this.onChange(e)}
        />
        时间(毫秒)
      </div>
    );
  }
  onChange(e: any) {
    let res = e.target.value * 1;
    if (!isNaN(res)) {
      this.props.onChange(res);
    }
  }
}
