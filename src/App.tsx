import React from 'react';
import {useChatClient} from "./hooks/useChatClient";

function App() {

    const chatThread = useChatClient();


    return <div>Hello chatThread: {chatThread.state.chatThreadId} </div>;
}

export default App;
