import React, { createContext, useEffect, useState } from 'react';

import { User, UserWithGuilds, AbstractGuild, Guild } from '../@types';
import { createAPIClient } from '../services/ApiService';
import { ApolloError, gql, NetworkStatus, ServerError, ServerParseError } from '@apollo/client';
import { Client } from '../services/ClientService';
import { NetworkError } from '@apollo/client/errors';
import { Utils } from '../utils';

const guildUrlString = /\/dashboard\/guilds\/(\d*)(\/.*)?/i

interface APIContextData {
    signed: boolean;
    loading: boolean;
    user: UserWithGuilds;
    guild?: Guild;

    checkGuild: (guildId: string) => boolean;
    fetchGuild: (id: string) => Promise<Guild[]>;
    fetchUserGuilds: () => Promise<AbstractGuild[]>;
}

const APIContext = createContext<APIContextData>({} as APIContextData);

export class APIProvider extends React.Component<React.PropsWithChildren, {
    loading: boolean;
    user: UserWithGuilds;
    token: string;
    guild: Guild;
}> {

    constructor(props: React.PropsWithChildren) {
        super(props);

        this.state = {
            loading: true,
            user: null, 
            guild: null,
            token: null,
        }
    }

    async componentDidUpdate() {
        const pathname = window.location.pathname;

        if(guildUrlString.test(pathname)) {
            const guildId = pathname.replace(guildUrlString, '$1');

            if(this.state.guild?.id !== guildId) {
                await this.fetchGuild(guildId);
            }
        } else if(this.state.guild) {
            this.setState({ guild: null });
        }
    }

    checkGuild(guildId: string) {
        return this.state.guild?.id === guildId;
    }

    async fetchGuild(id: string) {
        const guild: Guild = {
            id: 'id',
            name: '🌇 Lunar City',
            banner: null,
            channels: [
                {
                    id: '002',
                    name: 'rules',
                    nsfw: false,
                    parent_id: '001',
                    position: 1,
                    type: 0,
                },
                {
                    id: '005',
                    name: 'news',
                    nsfw: false,
                    parent_id: '001',
                    position: 1,
                    type: 5,
                },
                {
                    id: '004',
                    name: 'chat',
                    nsfw: false,
                    parent_id: '003',
                    position: 1,
                    type: 0,
                },
            ],
            roles: [],
            features: ['ANIMATED_ICON'],
            icon: 'a_e32c439c0f444ee342ff89e631957af9',
            owner_id: '842170079520096276'
        };

        this.setState({ guild });

        return guild;
    }

    async fetchUserGuilds() {
        
    }

    render(): React.ReactNode {
        const { 
            props: { children },
            state: { loading, user, guild },
            fetchUserGuilds,
            fetchGuild,
            checkGuild,
        } = this;

        return (
            <APIContext.Provider value={{
                signed: !!user, 
                loading, 
                user, 
                guild,
                checkGuild: checkGuild.bind(this),
                fetchUserGuilds: fetchUserGuilds.bind(this), 
                fetchGuild: fetchGuild.bind(this),
            }}>
                {children}
            </APIContext.Provider>
        )
    }
}

export default APIContext;