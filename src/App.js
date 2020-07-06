import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import axios from 'axios'
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import parse from 'html-react-parser';
import SyntaxHighlighter from 'react-syntax-highlighter';
import sanitizeHtml from 'sanitize-html'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      dataHtml: '',
      dataArr: []
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
      dataHtml: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }, () => {
      this.splitContent()
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

  splitContent = () => {
    const content = this.state.dataHtml
    var dataSlipt = content.split(/\n/)
    this.setState({
      dataArr: [...dataSlipt]
    })
  }

  cleanHtmlString = (html) => {
    var clean = sanitizeHtml(html, {
      allowedTags: ['br', 'div'],
    });
    var cleanHtml = clean.replace(/<br \/>/g, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    return cleanHtml
  }

  render() {
    const { editorState } = this.state;
    let regex = /^<pre>/;
    return (
      <div>

        <div style={{ width: "50%", margin: "auto" }}>
          <h1>Render Content Here</h1>
          <div style={{ margin: "0px 20px" }}>{
            this.state.dataArr.map((data) => <div>{regex.test(data) ? <SyntaxHighlighter language="javascript" style={docco}>{this.cleanHtmlString(data)}</SyntaxHighlighter> : parse(data)}</div>)
          }</div>
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

