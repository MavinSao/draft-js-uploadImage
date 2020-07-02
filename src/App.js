import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios'
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
      dataHtml: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    });
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
    const { editorState } = this.state;
    return (
      <div>
        <div style={{ width: "50%", margin: "auto" }}>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
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
                  height: 'auto',
                  width: '100%',
                },
              }
            }}
            onEditorStateChange={this.onEditorStateChange}
          />

          {/* <div style={ dangerouslySetInnerHTML={{
            __html: this.state.dataHtml
          }}></div> */}

          <textarea
            style={{ width: "100%", margin: "auto" }}
            cols="50"
            rows="30"
            disabled
            value={this.state.dataHtml}
          />
        </div>
      </div>
    );
  }
}

