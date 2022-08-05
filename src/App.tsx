import * as React from 'react';
import {useChatClient} from "./hooks/useChatClient";
import {initializeIcons, Spinner} from '@fluentui/react';
import {initializeFileTypeIcons} from '@fluentui/react-file-type-icons';
import HomeScreen from './screens/HomeScreen';
import {CustomTheme} from "./utils/models";
import ConfigurationScreen from "./screens/ConfigurationScreen";
import {getExistingThreadIdFromURL} from "./utils/getExistingThreadIdFromURL";
import {endpointUrl, userAccessToken} from "./utils/constants";
import {ChatScreen} from "./screens/ChatScreen";

initializeIcons();
initializeFileTypeIcons();

const webAppTitle = document.title;

interface StatusScreen {
    userId: string,
    displayName: string,
    threadId: string
}

function App() {
    const [page, setPage] = React.useState('home');

    const [status, setStatus] = React.useState <StatusScreen>({
        userId: '',
        displayName: '',
        threadId: ''
    });

    const {createThread, joinThread} = useChatClient({threadId: status.threadId});

    const [theme, setTheme] = React.useState<CustomTheme>();

    React.useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', event => {
                const colorScheme = event.matches ? "dark" : "light";
                setTheme({...theme, screenMode: colorScheme});
            });
    }, [theme]);

    React.useEffect(() => {
        if (status.threadId) {
            localStorage.setItem('status', JSON.stringify(status));
        }
    }, [status]);

    React.useEffect(() => {
        const savedStatus = localStorage.getItem('status');
        if (savedStatus) {
            const items: StatusScreen = JSON.parse(savedStatus);
            if (items) {
                setStatus(items);
            }
            if (items.threadId && items.displayName && items.userId) {
                setPage('chat');
                return;
            } else if (items.threadId) {
                setPage('configuration')
            }

        }
    }, []);


    const renderPage = (): JSX.Element => {
        switch (page) {
            case 'home': {
                document.title = `home - ${webAppTitle}`;
                return <HomeScreen screenMode={theme?.screenMode} threadId={status.threadId}
                                   setThreadId={(val) => setStatus({...status, threadId: val})}
                                   createThread={createThread}/>;
            }
            case 'configuration': {
                document.title = `configuration - ${webAppTitle}`;
                return (
                    <ConfigurationScreen
                        joinThread={joinThread}
                        joinChatHandler={() => {
                            setPage('chat');
                        }}
                        setUserId={(val) => setStatus((prevState) => ({...prevState, userId: val}))}
                        setDisplayName={(val) => setStatus((prevState) => ({...prevState, displayName: val}))}
                        threadId={status.threadId}
                    />
                );
            }
            case 'chat': {
                document.title = `chat - ${webAppTitle}`;
                if (userAccessToken && status.userId && status.displayName && status.threadId && endpointUrl) {
                    return (
                        <ChatScreen
                            token={userAccessToken}
                            userId={status.userId}
                            displayName={status.displayName}
                            endpointUrl={endpointUrl}
                            threadId={status.threadId}
                            endChatHandler={(isParticipantRemoved) => {
                                if (isParticipantRemoved) {
                                    setPage('removed');
                                } else {
                                    setPage('end');
                                }
                            }}
                        />
                    );
                }

                return <Spinner label={'Loading...'} ariaLive="assertive" labelPosition="top"/>;
            }
            default:
                document.title = `error - ${webAppTitle}`;
                throw new Error('Page type not recognized');
        }
    };

    if (getExistingThreadIdFromURL() && page === 'home') {
        setPage('configuration');
    }

    return renderPage();
}

export default App;
