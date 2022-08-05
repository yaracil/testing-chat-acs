// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {TextFieldStyleProps, inputBoxStyle, inputBoxTextStyle} from '../assets/styles/TextImputField.styles';
import {ENTER_KEY} from '../utils/constants';

import React from 'react';
import {TextField} from '@fluentui/react';

interface DisplayNameFieldProps {
    setText(displayName: string): void;

    setEmptyWarning(isEmpty: boolean): void;

    isEmpty: boolean;
    defaultName?: string;

    validateName?(): void;

    inputName: string,
    inputLabel: string,
    inputPlaceholder: string
}


const TEXTFIELD_EMPTY_ERROR_MSG = 'Cannot be empty';

const DisplayNameFieldComponent = (props: DisplayNameFieldProps): JSX.Element => {
    const {setText, setEmptyWarning, isEmpty, defaultName, validateName, inputName, inputPlaceholder, inputLabel} = props;

    const onTextChange = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
    ): void => {
        if (newValue === undefined) {
            return;
        }

        setText(newValue);
        if (!newValue) {
            setEmptyWarning(true);
        } else {
            setEmptyWarning(false);
        }
    };

    return (
        <TextField
            autoComplete="off"
            defaultValue={defaultName}
            inputClassName={inputBoxTextStyle}
            label={inputLabel}
            className={inputBoxStyle}
            onChange={onTextChange}
            id={inputName}
            placeholder={inputPlaceholder}
            onKeyDown={(ev) => {
                if (ev.which === ENTER_KEY) {
                    validateName && validateName();
                }
            }}
            styles={TextFieldStyleProps}
            errorMessage={isEmpty ? TEXTFIELD_EMPTY_ERROR_MSG : undefined}
        />
    );
};

export const CustomTextField = (props: DisplayNameFieldProps): JSX.Element => <DisplayNameFieldComponent {...props} />;
