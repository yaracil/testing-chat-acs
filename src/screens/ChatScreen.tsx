import {Stack} from '@fluentui/react';
import React from 'react';

import {chatCompositeContainerStyle, chatScreenContainerStyle} from '../assets/styles/ChatScreen.styles';
import {CustomTextField} from "../components/CustomTextField";
import {useChatClient} from "../hooks/useChatClient";
import {ChatMessage, ChatMessageReceivedEvent, ChatMessageType} from "@azure/communication-chat";

interface ChatScreenProps {
    token: string;
    userId: string;
    displayName: string;
    endpointUrl: string;
    threadId: string;

    endChatHandler(isParticipantRemoved: boolean): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
    const {displayName, threadId} = props;
    const [messageToSend, setMessageToSend] = React.useState('');
    const [emptyWarning, setEmptyWarning] = React.useState(false);
    // const [participants, setParticipants] = React.useState([]);
    const [messages, setMessages] = React.useState<(ChatMessage | undefined)[]>([]);

    const {sendMessage, listMessages, startRealtimeNotifications} = useChatClient({threadId: props.threadId});

    const fetchMessages = React.useCallback(async () => {
        const response = await listMessages();
        const messages_ = [];
        let msg = await response?.next();
        while (!msg?.done) {
            messages_.push(msg?.value)
            msg = await response?.next();
        }
        setMessages(messages_);
    }, [listMessages]);

    React.useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    React.useEffect(() => {
        startRealtimeNotifications((msg: ChatMessageReceivedEvent) => {
                if (msg) {
                    setMessages((prevState) => [...[{
                        id: msg?.id,
                        version: msg?.version,
                        sequenceId: "",
                        createdOn: msg.createdOn,
                        sender: msg.sender,
                        content: {message: msg.message},
                        type: msg.type as ChatMessageType,
                        senderDisplayName: msg.senderDisplayName,
                    }], ...prevState])
                }
            }
        )
    }, [startRealtimeNotifications]);

    const validateMessage = async () => {
        if (!messageToSend) {
            setEmptyWarning(true);
        } else {
            setEmptyWarning(false);
            await setMessageToSend('');
            const result = await sendMessage({content: messageToSend, senderDisplayName: displayName});
            if (result?.id) {
                fetchMessages();
            }
        }
    };

    if (threadId) {
        return (
            <Stack className={chatScreenContainerStyle}>
                <Stack.Item className={chatCompositeContainerStyle}>
                    <CustomTextField setText={(val) => setMessageToSend(val)}
                                     setEmptyWarning={setEmptyWarning}
                                     validateName={validateMessage}
                                     defaultName={messageToSend}
                                     isEmpty={emptyWarning}
                                     inputName={"messageToSend"}
                                     inputLabel={"New message"}
                                     inputPlaceholder={"Write a message"}/>

                </Stack.Item>

                {
                    messages.map((msg, index) =>
                        <Stack.Item key={index} className={chatCompositeContainerStyle}>
                            <p><b>{msg?.senderDisplayName} :</b> {msg?.content?.message} </p>
                        </Stack.Item>)
                }
            </Stack>
        );
    }
    return <>Initializing...</>;
};
