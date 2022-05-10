import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/dialog'

function App() {
  function executeCommands() {
    invoke('simple_command')
    invoke('command_with_message', { message: 'some message' }).then(message => {
      console.log('command_with_messge', message)
    })
    invoke('command_with_object', { message: { field_str: 'some message', field_u32: 12 }}).then(message => {
      console.log('command_with_object', message)
    })

    for (let arg of [1, 2]) {
      invoke('command_with_error', { arg }).then(message => {
        console.log('command_with_error', message)
      }).catch(message => {
        console.error('command_with_error', message)
      })
    }

    invoke('async_command', { arg: 14 }).then(message => {
      console.log('async_command', message)
    })
  }

  function openDialog () {
    open().then(files => console.log(files))
  }

  function emitMessage() {
    emit('front-to-back', "hello from front")
  }

  useEffect(() => {
    let unlisten: any;
    async function f() {
      unlisten = await listen('back-to-front', event => {
        console.log(`back-to-front ${event.payload} ${new Date()}`)
      });
    }
    f();

    return () => {
      if (unlisten) {
        unlisten();
      }
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.

          <br></br>
          Hello Tauri
        </p>
        <button onClick={executeCommands}>Click to execute command</button>
        <button onClick={openDialog}>Click to open dialog</button>
        <button onClick={emitMessage}>Click to emit message</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
