// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
    AzureCommunicationTokenCredential,
    CommunicationTokenRefreshOptions,
    CommunicationUserIdentifier
} from '@azure/communication-common';
import {AbortSignalLike, OperationOptions} from '@azure/core-http';
import {
    CommunicationAccessToken,
    CommunicationIdentityClient,
    CommunicationUserToken,
    TokenScope
} from '@azure/communication-identity';

const appSettings = require('../appsettings.json');

/**
 * Create credentials that auto-refresh asynchronously.
 */
export const createAutoRefreshingCredential = async (userId: string, currentToken: string): Promise<AzureCommunicationTokenCredential> => {

    const options: CommunicationTokenRefreshOptions = {
        token: currentToken,
        tokenRefresher: refreshTokenAsync(userId),
        refreshProactively: true
    };

    return new AzureCommunicationTokenCredential(options);

};

const refreshTokenAsync = (userIdentity: string): ((abortSignal?: AbortSignalLike) => Promise<string>) => {
    const user: CommunicationUserIdentifier = {
        communicationUserId: userIdentity
    };
    return async (): Promise<string> => {
        const token = await getToken(user, ['chat', 'voip']);
        const userToken: CommunicationUserToken = {
            user,
            ...token
        };
        return userToken.token;
    };
};

export const getToken = (
    user: CommunicationUserIdentifier,
    scopes: TokenScope[],
    options?: OperationOptions
): Promise<CommunicationAccessToken> => getIdentityClient().getToken(user, scopes);

// lazy init to allow mocks in test
let identityClient: CommunicationIdentityClient | undefined = undefined;
const getIdentityClient = (): CommunicationIdentityClient =>
    identityClient ?? (identityClient = new CommunicationIdentityClient(getResourceConnectionString()));

export const getResourceConnectionString = (): string => {
    const resourceConnectionString = process.env['ResourceConnectionString'] || appSettings.ResourceConnectionString;

    if (!resourceConnectionString) {
        throw new Error('No ACS connection string provided');
    }

    return resourceConnectionString;
};
