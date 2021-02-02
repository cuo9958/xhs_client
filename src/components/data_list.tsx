import React from 'react';

interface iProps {
  list: any[];
  rules: any[];
}
export default function (props: iProps) {
  return (
    <div className="data_list">
      <div className="data_list_title">
        {props.rules.map((item, index) => (
          <div key={index}>{item.name}</div>
        ))}
      </div>
      {props.list.map((item, index) => (
        <div className="data_list_item" key={index}>
          {item.map((data: any, jndex: number) => (
            <div className="data_list_item_row" key={jndex}>
              {data}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
