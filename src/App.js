import React, { Component } from 'react'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromRaw } from 'draft-js';

const content = {
  "entityMap": {},
  "blocks": [{
    "key": "637gr", "text": "Initialized from content state.",
    "type": "unstyled",
    "depth": 0, "inlineStyleRanges": [],
    "entityRanges": [],
    "data": {}
  }]
};

export default class App extends Component {

  constructor() {
    super()
    const contentState = convertFromRaw(content);
    this.state = {
      contentState,
    }
    this.onContentStateChange = this.onContentStateChange.bind(this)

  }

  onContentStateChange = (data) => {
    this.setState({
      contentState: data
    })
  };

  uploadImageCallBack(file) {
    const form = new FormData();
    form.append('image', file);
    return axios.post('http://110.74.194.125:3535/api/images', form)
      .then(response => {
        return {
          data: {
            link: response.data.url
          }
        }
      });
  }

  render() {

    return (
      <div style={{ width: "50%", margin: "auto" }}>
        <div>
          <Editor
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: this.uploadImageCallBack,
                previewImage: true,
                alt: { present: true, mandatory: false },
                inputAccept: 'image/jpeg,image/jpg,image/png',
                defaultSize: {
                  height: '300px',
                  width: '300px',
                },
              }
            }}

            onContentStateChange={this.onContentStateChange}
            onTab={(event) => {
              console.log(event);
            }}
          />
        </div>
      </div>
    )
  }
}

