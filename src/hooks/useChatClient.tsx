import * as React from "react";
import {ChatClient, SendMessageOptions} from '@azure/communication-chat';
import {AzureCommunicationTokenCredential} from '@azure/communication-common';


// Your unique Azure Communication service endpoint
const endpointUrl = 'https://chat-quickstart.communication.azure.com/';
// The user access token generated as part of the pre-requisites
const userAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmE1NjgxMzkwLTIzMzYtNDc2ZS1iN2M4LTViODdjOWZiYTk0YV8wMDAwMDAxMi1mNmQ5LTkwZWQtZWVmMC04YjNhMGQwMDllYTYiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTkzMTY0NjQiLCJleHAiOjE2NTk0MDI4NjQsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiJhNTY4MTM5MC0yMzM2LTQ3NmUtYjdjOC01Yjg3YzlmYmE5NGEiLCJpYXQiOjE2NTkzMTY0NjR9.AB3T_3x5oSHB1wyWeMMJuCramqGpMj7KO2TtiRnxy2568Xhg7nJai9wotM1FgDkwkhGqCvsH-XcmHV_JOJHZq3bwAKygZqsZ14U26XtXnve4gLLXOO0lC_wI-F1mT1xiAl5TnzG2HKZBmorxWkE_EeEn-yUI4MpYFt_nQimWEOjoe8BrOx823x1VQnmFDTh7DmyEg8TFhc6EoWfv1nbNuocjeqaSf6LxTfmQAXH_dpDyNQmkUsMb4qvpwy1bLB9AtNk-Uti4OfTOGXBi2-nobHYSFow-ZCq6FjlTZlTbnMqBRb_eD6-TVjKb9IxkIfSogUIkXS3CF0-xRGlwbTlp6A';

const createChatThreadRequest = {
    topic: "Hello, World!"
};
const createChatThreadOptions = {
    participants: [
        {
            id: {communicationUserId: '8:acs:a5681390-2336-476e-b7c8-5b87c9fba94a_00000012-f6d9-90ed-eef0-8b3a0d009ea6'},
            displayName: 'Yoelkys'
        }
    ]
};

export const useChatClient = () => {
    const chatClient = React.useMemo(() => new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken)), []);
    const [state, setState] = React.useState({chatThreadId: ''})


    React.useEffect(() => {
        const createChatThread = async () => {

            const createChatThreadResult = await chatClient.createChatThread(
                createChatThreadRequest,
                createChatThreadOptions
            );
            await setState({chatThreadId: createChatThreadResult?.chatThread?.id || ''})


            await chatClient.on('realTimeNotificationConnected', () => {
                console.log("Real time notification is now connected!");
                // your code here
            });


            // await chatClient.on("chatMessageReceived", (e) => {
            //     console.log("Notification chatMessageReceived! " + e.message);
            //     // your code here
            // });

            // // subscribe to realTimeNotificationDisconnected event
            // await chatClient.on('realTimeNotificationDisconnected', () => {
            //     console.log("Real time notification is now disconnected!");
            //     // your code here
            // });
        }
        createChatThread();
    }, [chatClient])

    const chatThreadClient = React.useMemo(() => {
        return chatClient.getChatThreadClient(state.chatThreadId);
    }, [state.chatThreadId, chatClient]);

    const listChatThreads = React.useCallback(async () => {
        const threads = chatClient.listChatThreads();
        for await (const thread of threads) {
            // your code here
            console.log(`Chat Thread Id: ${thread.id}`);
        }
    }, [chatClient]);

    const sendMessage = React.useCallback(async () => {
        const sendMessageRequest =
            {
                content: 'Please take a look at the attachment'
            };
        const sendMessageOptions: SendMessageOptions =
            {
                senderDisplayName: 'Jack',
                type: 'text',
                metadata: {
                    'hasAttachment': 'true',
                    'attachmentUrl': 'https://contoso.com/files/attachment.docx'
                }
            };
        const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
        const messageId = sendChatMessageResult.id;
        console.log(`Message sent!, message id:${messageId}`);
    }, [chatThreadClient]);


    const listMessages = React.useCallback(async () => {
        return chatThreadClient.listMessages();
    }, [chatThreadClient]);

    const listParticipants = React.useCallback(async () => {
       return chatThreadClient.listParticipants();

    }, [chatThreadClient]);

    const removeParticipant = React.useCallback(async (participantId) => {
        await chatThreadClient.removeParticipant({communicationUserId: participantId});
        await listParticipants();
    }, [chatThreadClient,listParticipants]);

    return {state, sendMessage, listMessages, listParticipants, listChatThreads, removeParticipant};

}


