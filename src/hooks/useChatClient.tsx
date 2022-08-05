import * as React from "react";
import {ChatClient, SendMessageOptions} from '@azure/communication-chat';
import {AzureCommunicationTokenCredential} from '@azure/communication-common';
import {endpointUrl, userAccessToken} from "../utils/constants";

const createChatThreadRequest = {
    topic: "Calling Application"
};


interface UseChatClientProps {
    threadId: string
}

export const useChatClient = (props: UseChatClientProps) => {
    const chatClient = React.useMemo(() => new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken)), []);
    const chatThreadClient = React.useMemo(() => props.threadId ? chatClient.getChatThreadClient(props.threadId) : null, [chatClient, props.threadId]);

    const createThread = React.useCallback(async () => {

        const createChatThreadResult = await chatClient.createChatThread(
            createChatThreadRequest
        );
        return createChatThreadResult?.chatThread?.id;
    }, [chatClient]);

    const startRealtimeNotifications = React.useCallback(async (callback: any) => {
        await chatClient.startRealtimeNotifications();
        chatClient.on("chatMessageReceived", async (e) => {
            callback(e);
        });
    }, [chatClient]);

    const listChatThreads = React.useCallback(async () => {
        const threads = chatClient.listChatThreads();
        for await (const thread of threads) {
            console.log(`Chat Thread Id: ${thread.id}`);
        }
        return threads;
    }, [chatClient]);

    const sendMessage = React.useCallback(async ({content, senderDisplayName}: any) => {
        if (chatThreadClient != null) {

            const sendMessageRequest =
                {
                    content
                };
            //TODO ADD ATTACHMENT
            const sendMessageOptions: SendMessageOptions =
                {
                    senderDisplayName,
                    type: 'text',
                };
            return await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions)
        }
    }, [chatThreadClient]);


    const listMessages = React.useCallback(async () => {
        return chatThreadClient?.listMessages();
    }, [chatThreadClient]);

    const listParticipants = React.useCallback(async () => {
        return chatThreadClient?.listParticipants();
    }, [chatThreadClient]);

    const joinThread = React.useCallback(async (identity: string, name: string) => {
        // <Add a user as a participant to the chat thread>
        let result = null;
        if (chatThreadClient != null) {
            const addParticipantsRequest =
                {
                    participants: [
                        {
                            id: {communicationUserId: identity},
                            displayName: name
                        }
                    ]
                };
            result = await chatThreadClient.addParticipants(addParticipantsRequest);
        }
        return result;
    }, [chatThreadClient]);

    const removeParticipant = React.useCallback(async (participantId: string) => {
        await chatThreadClient?.removeParticipant({communicationUserId: participantId});
    }, [chatThreadClient]);

    return {
        createThread,
        sendMessage,
        listMessages,
        listParticipants,
        listChatThreads,
        removeParticipant,
        joinThread,
        startRealtimeNotifications
    };

}


