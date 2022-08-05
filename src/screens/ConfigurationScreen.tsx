// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {CAT, FOX, KOALA, MONKEY, MOUSE, OCTOPUS} from '../utils/constants';
import {FocusZone, FocusZoneDirection, PrimaryButton, Spinner, Stack, Text, useTheme} from '@fluentui/react';
import React, {useCallback, useEffect, useState} from 'react';
import {
    buttonStyle,
    buttonWithIconStyles,
    chatIconStyle,
    mainContainerStyle
} from '../assets/styles/ConfigurationScreen.styles';
import {
    avatarListContainerStackTokens,
    avatarListContainerStyle,
    headerStyle,
    labelFontStyle,
    largeAvatarContainerStyle,
    largeAvatarStyle,
    leftPreviewContainerStackTokens,
    leftPreviewContainerStyle,
    namePreviewStyle,
    responsiveLayoutStackTokens,
    responsiveLayoutStyle,
    rightInputContainerStackTokens,
    rightInputContainerStyle,
    smallAvatarContainerStyle,
    smallAvatarStyle
} from '../assets/styles/ConfigurationScreen.styles';

import {Chat20Filled} from '@fluentui/react-icons';
import {CustomTextField} from '../components/CustomTextField';
import {AddChatParticipantsResult} from "@azure/communication-chat";

// These props are set by the caller of ConfigurationScreen in the JSX and not found in context
export interface ConfigurationScreenProps {
    joinChatHandler(): void;

    setUserId(userId: string): void;

    setDisplayName(displayName: string): void;

    threadId: string;

    joinThread(identity: string, name: string): Promise<AddChatParticipantsResult | null>;
}

// ConfigurationScreen states
const CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING = 1;
const CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT = 2;
const CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD = 3;
const CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT = 4;

const ALERT_TEXT_TRY_AGAIN = "You can't be added at this moment. Please wait at least 60 seconds to try again.";
const AVATAR_LABEL = 'Avatar';
const ERROR_TEXT_THREAD_INVALID = 'Thread Id is not valid, please revisit home page to create a new thread';
const ERROR_TEXT_THREAD_NULL = 'Thread id is null';
const INITIALIZE_CHAT_SPINNER_LABEL = 'Initializing chat client...';
const JOIN_BUTTON_TEXT = 'Join chat';
const LOADING_SPINNER_LABEL = 'Loading...';
const NAME_DEFAULT = 'Name';
const PROFILE_LABEL = 'Your profile';

/**
 * There are four states of ConfigurationScreen.
 * 1. Loading configuration screen state. This will show 'loading' spinner on the screen.
 * 2. Join chat screen. This will show a name selector.
 * 3. Invalid thread state. This will show 'thread id is not valid' on the screen.
 * 4. Loading chat spinner. This will show 'initializing chat client' spinner on the screen.
 *
 * @param props
 */
export default (props: ConfigurationScreenProps): JSX.Element => {
    const avatarsList = [CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX];
    const [name, setName] = useState('');
    const [identityText, setIdentityText] = useState('');

    const [emptyWarning, setEmptyWarning] = useState({name: false, identityText: false, tokenText: false});

    const [selectedAvatar, setSelectedAvatar] = useState(CAT);
    const [configurationScreenState, setConfigurationScreenState] = useState<number>(
        CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING
    );

    const [disableJoinChatButton, setDisableJoinChatButton] = useState<boolean>(false);
    const theme = useTheme();

    const {
        joinChatHandler,
        setUserId,
        setDisplayName,
        threadId,
        joinThread
    } = props;

    // Used when new user is being registered.
    const setupAndJoinChatThreadWithNewUser = useCallback(() => {
        const internalSetupAndJoinChatThread = async (): Promise<void> => {

            if (!threadId) {
                throw new Error(ERROR_TEXT_THREAD_NULL);
            }

            await setUserId(identityText);
            await setDisplayName(name);
            const result = await joinThread(identityText, name);
            if (!result) {
                alert(ALERT_TEXT_TRY_AGAIN);
                setDisableJoinChatButton(false);
                return;
            }
            setTimeout(() => {
                setDisableJoinChatButton(false);
                joinChatHandler();
            }, 2000)
        };
        internalSetupAndJoinChatThread();
    }, [name, identityText, threadId, joinChatHandler,  setDisplayName, setUserId, joinThread]);

    useEffect(() => {
        if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING) {
            const setScreenState = async (): Promise<void> => {
                try {
                    // if (!(await checkThreadValid(threadId))) {
                    //   throw new Error(ERROR_TEXT_THREAD_NOT_RECORDED);
                    // }
                } catch (error) {
                    setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD);
                    return;
                }
                setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT);
            };
            setScreenState();
        }
    }, [configurationScreenState]);

    const smallAvatarContainerClassName = useCallback(
        (avatar: string) => {
            return smallAvatarContainerStyle(avatar, selectedAvatar, theme);
        },
        [selectedAvatar, theme]
    );

    const validateName = (): void => {
        if (!name) {
            setEmptyWarning({...emptyWarning, name: true});
        } else if (!identityText) {
            setEmptyWarning({...emptyWarning, identityText: true});
        } else {
            setEmptyWarning({name: false, identityText: false, tokenText: false});
            setDisableJoinChatButton(true);
            setConfigurationScreenState(CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT);
            setupAndJoinChatThreadWithNewUser();
        }
    };

    const onAvatarChange = (newAvatar: string): void => {
        setSelectedAvatar(newAvatar);
    };

    const displaySpinner = (spinnerLabel: string): JSX.Element => {
        return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top"/>;
    };

    const displayJoinChatArea = (): JSX.Element => {
        return (
            <Stack
                horizontal
                wrap
                horizontalAlign="center"
                verticalAlign="center"
                tokens={responsiveLayoutStackTokens}
                className={responsiveLayoutStyle}
            >
                <Stack horizontalAlign="center" tokens={leftPreviewContainerStackTokens}
                       className={leftPreviewContainerStyle}>
                    <Text role={'heading'} aria-level={1} className={headerStyle}>
                        {PROFILE_LABEL}
                    </Text>
                    <div className={largeAvatarContainerStyle(selectedAvatar)}>
                        <div aria-label={`${selectedAvatar} avatar`} className={largeAvatarStyle}>
                            {selectedAvatar}
                        </div>
                    </div>
                    <Text className={namePreviewStyle(name !== '')}>{name !== '' ? name : NAME_DEFAULT}</Text>
                </Stack>
                <Stack className={rightInputContainerStyle} tokens={rightInputContainerStackTokens}>
                    <Text id={'avatar-list-label'} className={labelFontStyle}>
                        {AVATAR_LABEL}
                    </Text>
                    <FocusZone direction={FocusZoneDirection.horizontal}>
                        <Stack
                            horizontal
                            className={avatarListContainerStyle}
                            tokens={avatarListContainerStackTokens}
                            role="list"
                            aria-labelledby={'avatar-list-label'}
                        >
                            {avatarsList.map((avatar, index) => (
                                <div
                                    role="listitem"
                                    id={avatar}
                                    key={index}
                                    data-is-focusable={true}
                                    className={smallAvatarContainerClassName(avatar)}
                                    onClick={() => onAvatarChange(avatar)}
                                >
                                    <div className={smallAvatarStyle}>{avatar}</div>
                                </div>
                            ))}
                        </Stack>
                    </FocusZone>
                    <CustomTextField
                        inputLabel={'Name'}
                        inputName={'displayName'}
                        inputPlaceholder={'Enter your name'}
                        setEmptyWarning={(val) => setEmptyWarning({...emptyWarning, name: val})}
                        validateName={validateName}
                        isEmpty={emptyWarning.name}
                        setText={setName}
                    />
                    <CustomTextField
                        inputLabel={'User Identity'}
                        inputName={'userIdentity'}
                        inputPlaceholder={'Enter your user identity'}
                        setEmptyWarning={(val) => setEmptyWarning({...emptyWarning, identityText: val})}
                        validateName={validateName}
                        isEmpty={emptyWarning.identityText}
                        setText={setIdentityText}
                    />
                    <PrimaryButton
                        disabled={disableJoinChatButton}
                        className={buttonStyle}
                        styles={buttonWithIconStyles}
                        text={JOIN_BUTTON_TEXT}
                        onClick={validateName}
                        onRenderIcon={() => <Chat20Filled className={chatIconStyle}/>}
                    />
                </Stack>
            </Stack>
        );
    };

    const displayInvalidThreadError = (): JSX.Element => {
        return (
            <div>
                <p>{ERROR_TEXT_THREAD_INVALID}</p>
            </div>
        );
    };

    const displayWithStack = (child: JSX.Element): JSX.Element => {
        return (
            <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
                {child}
            </Stack>
        );
    };

    if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_LOADING) {
        return displaySpinner(LOADING_SPINNER_LABEL);
    } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_JOIN_CHAT) {
        return displayWithStack(displayJoinChatArea());
    } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_INVALID_THREAD) {
        return displayWithStack(displayInvalidThreadError());
    } else if (configurationScreenState === CONFIGURATIONSCREEN_SHOWING_SPINNER_INITIALIZE_CHAT) {
        return displaySpinner(INITIALIZE_CHAT_SPINNER_LABEL);
    } else {
        throw new Error('configuration screen state ' + configurationScreenState.toString() + ' is invalid');
    }
};
