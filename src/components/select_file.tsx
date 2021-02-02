import React from 'react';

interface iProps {
  onSelect: (str: string) => void;
}
export default class extends React.Component<iProps> {
  render() {
    return (
      <div className="select_file btn">
        <label className="select_file_label">
          <input
            ref="file"
            onChange={() => this.onChange()}
            type="file"
            name="filename"
            className="select_file_input"
          />
          选择文件
        </label>
      </div>
    );
  }
  onChange() {
    const fileinput: any = this.refs.file;
    if (fileinput.files && fileinput.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = (evt: any) => {
        if (evt.target.readyState == FileReader.DONE) {
          this.props.onSelect(evt.target.result);
        }
      };
      reader.readAsText(fileinput.files[0]);
    }
  }
}
