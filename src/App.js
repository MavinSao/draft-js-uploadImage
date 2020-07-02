import React, { Component } from 'react'
import axios from 'axios'
import { Editor } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

export default class App extends Component {

  constructor(props) {
    super(props);
    const html = '';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
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
                height: '300px',
                width: '300px',
              },
            }
          }}
          onEditorStateChange={this.onEditorStateChange}

        />
        <textarea
          rows={30}
          cols={50}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </div>
    );
  }
}

