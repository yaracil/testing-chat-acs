export const endpointUrl = 'https://chat-quickstart.communication.azure.com/';
export const userAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmE1NjgxMzkwLTIzMzYtNDc2ZS1iN2M4LTViODdjOWZiYTk0YV8wMDAwMDAxMy0wODY4LTE3NDQtM2VmMC04YjNhMGQwMGJhNDciLCJzY3AiOjE3OTIsImNzaSI6IjE2NTk2MTEwMTgiLCJleHAiOjE2NTk2OTc0MTgsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiJhNTY4MTM5MC0yMzM2LTQ3NmUtYjdjOC01Yjg3YzlmYmE5NGEiLCJpYXQiOjE2NTk2MTEwMTh9.Agh8JELqMsOYrtSOhsSkAxgCjeaB0qCc7HlpbJy9b886AejnWR1vBSYGqLv9ONGeqidf5qT7AOi9-8c_4Yt5XY2l4V9thXU2m6MedZhUQaXPwUr9YxOYzMdnxQ_Qh8padXY2y6QvJISLNsli5Vw5yIMbzswnpnKSR961hdjTes04Ph3eKWUFur7yAQxLT8b-W5v0FXFka2zgCvJ1rXKpixyMSkB77FuAI9ARWdIWPSxxr6LzIU0r3lH8f_je9o9nxJSDhtsA8sevvdbR4j-0l4AXHPc1jf2Otj3dlJXJiHiCFSw96RHI5r6F5WIf0-eWDuGgL2C9gnxuZZ9610UM1A';

export const CAT = '🐱';
export const MOUSE = '🐭';
export const KOALA = '🐨';
export const OCTOPUS = '🐙';
export const MONKEY = '🐵';
export const FOX = '🦊';

export const ENTER_KEY = 13;

export const getBackgroundColor = (avatar: string): { backgroundColor: string } => {
    switch (avatar) {
        case CAT:
            return {
                backgroundColor: 'rgb(255, 250, 228)'
            };

        case MOUSE:
            return {
                backgroundColor: 'rgb(232, 242, 249)'
            };

        case KOALA:
            return {
                backgroundColor: 'rgb(237, 232, 230)'
            };

        case OCTOPUS:
            return {
                backgroundColor: 'rgb(255, 240, 245)'
            };

        case MONKEY:
            return {
                backgroundColor: 'rgb(255, 245, 222)'
            };

        case FOX:
            return {
                backgroundColor: 'rgb(255, 231, 205)'
            };

        default:
            return {
                backgroundColor: 'rgb(255, 250, 228)'
            };
    }
};

