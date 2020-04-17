import React from 'react';
import { render } from 'react-dom';

import { clipboard, ipcRenderer } from 'electron';

import database from './database';

const writeToClipboard = content => {
  clipboard.writeText(content);
};

class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      clippings: [
        {
          content: 'Lol',
          id: 123,
        },
      ],
    };

    this.addClipping = this.addClipping.bind(this);
    this.fetchClippings = this.fetchClippings.bind(this);
    this.handleWriteToClipboard = this.handleWriteToClipboard.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('create-new-clipping', this.addClipping);

    this.fetchClippings();
  }

  fetchClippings() {
    database('clippings')
      .select()
      .then(clippings => this.setState({clippings}));
    console.log(this.state)
  }

  addClipping() {
    const content = clipboard.readText();

    database('clippings')
      .insert({content})
      .then(this.fetchClippings)

  }

  handleWriteToClipboard() {
    const clipping = this.state.clippings[0];
    if (clipping) writeToClipboard(clipping);
  }

  render() {
    return (
      <div className="container">
        <header className="controls">
          <button id="copy-from-clipboard" onClick={this.addClipping}>
            Copy from Clipboard
          </button>
        </header>

        <section className="content">
          <div className="clippings-list">
            {this.state.clippings.map(clipping => (
              <Clipping content={clipping.content} key={clipping.id} />
            ))}
          </div>
        </section>
      </div>
    );
  }
}

const Clipping = ({ content }) => {
  return (
    <article className="clippings-list-item">
      <div className="clipping-text" disabled>
        {content}
      </div>
      <div className="clipping-controls">
        <button onClick={() => writeToClipboard(content)}>
          &rarr; Clipboard
        </button>
        <button>Update</button>
      </div>
    </article>
  );
};

render(<Application />, document.getElementById('application'));
