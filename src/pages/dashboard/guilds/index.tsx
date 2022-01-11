import React, { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { GuildData, URLS, User } from '../../../types';
import { Permissions } from '../../../Constants';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import _GuildCard from '../../../components/GuildCard';
import { useRouter } from 'next/router';
import { createState } from '../../../Utils/states';

export default function DashboardGuilds({ token, user }: { token: string; user: User }) {
    const [guilds, setGuilds] = useState<GuildData[] | null | any>(null);
    const [_guilds, _setGuilds] = useState<GuildData[] | null | any>(null);

    useEffect(() => {
        (async() => {
            if(guilds) setGuilds(guilds)
            else {
                const res = await axios.get(URLS.GUILDS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });
                
                const data = res.data;

                const filter = await axios.get("/api/guilds/filter", {
                headers: {
                    guilds: (data || []).map(g => g.id).join(",")
                }
                }).then(x => x.data)
                
                console.log("fetch guilds")
                setGuilds(data.filter(x => filter.data.guilds.includes(x.id)));
                _setGuilds(data);
            }
            })()
    }, [guilds])
    
    return (
        <main>
            <NavBar user={user} />
            <SideBar user={user} guilds={guilds} />
            
            <div className={"content"}>
                {_guilds?.filter(x => !!(x.permissions & Permissions.ADMINISTRATOR))
                .sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
                .sort((a, b) => {
                    if(guilds.find(g => g.id == a.id)) return -1;
                    else return 1;
                })
                .map((guild: GuildData) => {
                return (
                    <_GuildCard key={guild.id} guild={guild} has={!!guilds.find(g => g.id == guild.id)} />
                );
                })}
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async(ctx) => {
    const { ['lunarydash.token']: token } = parseCookies(ctx)
    
    
    if(!token) {
        return propsRedirect()
    }

    try {
        const user = await fetch(URLS.USER, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(res => res.json());
    
        return {
            props: {
                token,
                user,
                bot_api: process.env.BOT_API
            }
        }
    } catch(e) {
        return propsRedirect()
    }

    function propsRedirect() {
        const state = createState({ url: ctx.req.url });

        return {
            redirect: {
                destination: `/api/auth/login?state=${state}`,
                permanent: false
            }
        }
    }
}