// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
    IImageStyles,
    Icon,
    Image,
    Link,
    List,
    PrimaryButton,
    Spinner,
    Stack,
    Text,
    mergeStyles
} from '@fluentui/react';
import React, {useCallback, useState} from 'react';
import {
    buttonStyle,
    buttonWithIconStyles,
    configContainerStackTokens,
    configContainerStyle,
    containerTokens,
    containerStyle,
    headerStyle,
    listIconStyle,
    listItemStackTokens,
    listItemStyle,
    imgStyle,
    listStyle,
    nestedStackTokens,
    infoContainerStyle,
    infoContainerStackTokens,
    videoCameraIconStyle
} from '../assets/styles/HomeScreen.styles';

import {Chat20Filled, ChatArrowBack16Filled} from '@fluentui/react-icons';
import heroSVG from '../assets/images/hero.svg';
import heroDarkModeSVG from '../assets/images/hero_dark.svg';
import {ScreenMode} from "../utils/models";
import {CustomTextField} from "../components/CustomTextField";

const imageStyleProps: IImageStyles = {
    image: {
        height: '100%'
    },

    root: {}
};

const HOMESCREEN_SHOWING_START_CHAT_BUTTON = 1;
const HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD = 2;

/**
 * HomeScreen has two states:
 * 1. Showing start chat button
 * 2. Showing spinner after clicking start chat
 *
 * @param props
 */
export interface ConfigurationScreenProps {
    screenMode: ScreenMode;
    threadId: string;

    createThread(): Promise<string | undefined>;

    setThreadId(newThreadId: string): void;
}

export default (props: ConfigurationScreenProps): JSX.Element => {
    const spinnerLabel = 'Creating a new chat thread...';
    const iconName = 'SkypeCircleCheck';
    const headerTitle = 'Exceptionally simple chat app';
    const startChatButtonText = 'Start chat';
    const joinChatButtonText = 'Join chat';
    const listItems = [
        'Launch a conversation with a single click',
        'Real-time messaging with indicators',
        'Invite up to 250 participants',
        'Learn more about this'
    ];

    const [homeScreenState, setHomeScreenState] = useState<number>(HOMESCREEN_SHOWING_START_CHAT_BUTTON);

    const {screenMode, threadId, setThreadId, createThread} = props;

    const imageProps = {src: screenMode === 'light' ? heroSVG.toString() : heroDarkModeSVG.toString()};

    const [joinField, setJoinField] = React.useState('');
    const [emptyWarning, setEmptyWarning] = React.useState(false);

    const onCreateThread = async (): Promise<void> => {
        setHomeScreenState(HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD);

        if (threadId) {
            window.location.href += `?threadId=${threadId}`;
            return;
        }

        const newThreadId = await createThread();
        if (!newThreadId) {
            console.error('Failed to create a thread, returned threadId is undefined or empty string');
            return;
        } else {
            setThreadId(newThreadId);
            setTimeout(() => {
                window.location.href += `?threadId=${newThreadId}`;
            }, 2000);

        }
    };

    const displayLoadingSpinner = (spinnerLabel: string): JSX.Element => {
        return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top"/>;
    };

    const onRenderListItem = useCallback(
        (item?: string, index?: number): JSX.Element => {
            const listText =
                index !== 3 ? (
                    <Text>{item}</Text>
                ) : (
                    <Text>
                        {item}{' '}
                        <Link href="https://docs.microsoft.com/azure/communication-services/overview"
                              aria-label={`${item} sample`}>
                            {'sample'}
                        </Link>
                    </Text>
                );

            return (
                <Stack horizontal tokens={listItemStackTokens} className={listItemStyle}>
                    <Icon className={mergeStyles(listIconStyle, {color: 'blue'})} iconName={iconName}/>
                    {listText}
                </Stack>
            );
        },
        []
    );

    const validateFieldText = async () => {
        if (!joinField) {
            setEmptyWarning(true);
        } else {
            setEmptyWarning(false);
            await setThreadId(joinField);
            onCreateThread();
        }
    };

    const displayHomeScreen = (): JSX.Element => {
        return (
            <Stack
                horizontal
                wrap
                horizontalAlign="center"
                verticalAlign="center"
                tokens={containerTokens}
                className={containerStyle}
            >
                <Stack className={infoContainerStyle} tokens={infoContainerStackTokens}>
                    <Text role={'heading'} aria-level={1} className={headerStyle}>
                        {headerTitle}
                    </Text>
                    <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
                        <Stack tokens={nestedStackTokens}>
                            <List className={listStyle} items={listItems} onRenderCell={onRenderListItem}/>
                        </Stack>
                        <PrimaryButton
                            id="startChat"
                            aria-label="Start chat"
                            text={startChatButtonText}
                            className={buttonStyle}
                            styles={buttonWithIconStyles}
                            onClick={() => {
                                onCreateThread();
                            }}
                            onRenderIcon={() => <Chat20Filled className={videoCameraIconStyle}/>}
                        />
                        <Stack>
                            <CustomTextField setText={setJoinField}
                                             setEmptyWarning={setEmptyWarning}
                                             validateName={validateFieldText}
                                             isEmpty={emptyWarning}
                                             inputName={"threaId"}
                                             inputLabel={"Enter thread ID"}
                                             inputPlaceholder={"Write a thread ID"}/>
                            <PrimaryButton
                                style={{marginTop: 10}}
                                id="joinChat"
                                aria-label="Join to chat"
                                text={joinChatButtonText}
                                className={buttonStyle}
                                styles={buttonWithIconStyles}
                                onClick={validateFieldText}
                                onRenderIcon={() => <ChatArrowBack16Filled className={videoCameraIconStyle}/>}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Image styles={imageStyleProps} alt="Welcome to the ACS Chat sample app"
                       className={imgStyle} {...imageProps} />
            </Stack>
        );
    };

    if (homeScreenState === HOMESCREEN_SHOWING_START_CHAT_BUTTON) {
        return displayHomeScreen();
    } else if (homeScreenState === HOMESCREEN_SHOWING_LOADING_SPINNER_CREATE_THREAD) {
        return displayLoadingSpinner(spinnerLabel);
    } else {
        throw new Error('home screen state ' + homeScreenState.toString() + ' is invalid');
    }
};
