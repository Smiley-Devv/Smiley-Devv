import React, { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { APIGuildResponse, Guild , GuildData, URLS, User } from '../../../../types';
import { Permissions } from '../../../../Constants';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import NavBar from '../../../../components/NavBar';
import SideBar from '../../../../components/SideBar';
import Toggle, { CheckRadio } from '../../../../components/Toggle';
import _GuildCard from '../../../../components/GuildCard';
import { createState } from '../../../../Utils/states';
import fetch from 'node-fetch';
import Script from 'next/script';
import initializerFirebases from '../../../../Utils/initializerFirebase';
global.axios = axios;

export default function DashboardGuilds({ token, user, guild, database, reqToken }: { reqToken: string; token: string; user: User, guild: Guild, database: any; }) {
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
    }, [guilds]);

    useEffect(() => {
        localStorage.setItem("reqToken", reqToken);
    }, [token])
    return (
        <>
            <main>
                <NavBar user={user} />
                <SideBar user={user} guilds={guilds} guild={guild} />
                
                <div className={"content"}>
                    {/* <div className="select-wrapper" data-send-on-save>
                            <div className="select" id="muterole">
                                <div className="select__trigger">
                                    <p>{(function() {
                                        let a = "Selecionar Cargo"
                                        if(database.muterole) {
                                            const role = guild.roles.filter(x => !x.managed && x.id != guild.id).find(x => x.id == database.muterole)
                                            if(role) {
                                                a = role.name
                                            }
                                        }
                                        return a
                                    })()}</p>
                                </div>
                                <form onSubmit={(e) => e.preventDefault() }><p className="select-menu-search"><input type="text" autoComplete='off' placeholder="Nome/ID" name="search" /><i className="icon fas fa-search"></i></p></form>
                                <div className="custom-options close" id="co-chat_modlogs">
                                    <span className="custom-option" data-value="none" data-li="Selecionar Cargo">Nenhum</span>
                                    {guild.roles.filter(x => !x.managed && x.id != guild.id).map(x => <span className="custom-option" style={{color: `#${Number(x.color).toString(16)}`}} data-color={`#${Number(x.color).toString(16)}`} data-value={x.id} data-li={x.name} key={x.id}>{x.name}</span>)}
                                </div>
                        </div>
                    </div> */}

                    <div className="page-title">
                        <br />
                        <h2><strong><i className="fas fa-hammer"></i> MODERAÇÃO</strong></h2>
                    </div>

                    <br />
                    <div className="card">
                        <div className="card-title">
                            <h3><strong><i className="fas fa-cog"></i> GERAL</strong></h3>
                        </div>
                        <div className="card-content">
                            <CheckRadio>
                                <Toggle name="mandatory_reason" id="mandatory_reason" data-send-on-save bitfield /><label style={{marginLeft: '1%', fontSize: '18px'}}><strong>Tornar motivo para punições obrigatório</strong></label>
                                <p>Permitir que uma punição usando o bot(Lunar) só seja efetuada com um motivo especificado.<br />Essa opção só ira ser aplicada para usuários que não possuem um cargo com a permissão <code>Punir sem motivo</code>.</p>
                            </CheckRadio>
                            
                            <hr />

                            <CheckRadio>
                                <Toggle name="log_unban" id="log_unban" data-send-on-save bitfield /><label style={{marginLeft: '1%', fontSize: '18px'}}><strong>Registrar evento Unban</strong></label>
                                <p>Registrar no canal de modlogs quando um banimento for retirado.<br />Para mostrar o motivo e o autor, você precisa dar ao bot permissão de <code>Ver registro de autoria</code>.</p>
                            </CheckRadio>

                            <hr />

                            <CheckRadio>
                                <Toggle type="checkbox" name="log_events" id="log_events" data-send-on-save bitfield /><label style={{marginLeft: '1%', fontSize: '18px'}}><strong>Eventos de banimento de log não feitos através do bot(Lunar)</strong></label>
                                <p>Registrar no canal de modlogs e punições quando um banimento for aplicado e não tenha sido feito pelo bot(Lunar).<br />Para mostrar o motivo e o autor, você precisa dar ao bot permissão de <code>Ver registro de autoria</code>.</p>
                            </CheckRadio>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title">
                            <h3><strong><i className="fas fa-cog"></i> MODERADORES</strong></h3>
                        </div>
                        <div className="card-content">
                            
                        </div>
                    </div>
                </div>
            </main>

            <Script
                src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js'
                onLoad={() => {
                    // $("#mandatory_reason").prop('checked', false);
                    
                    // Select Menu
                    $(".select").hover(function() {
                        const menuID = this.id
                        const menu = $(this)
                        menu.addClass("open")
                    
                        menu.find(".custom-options").find("span").each(function() {
                            const option = $(this)
                    
                            option.click(function() {
                                const o = $(this)
                                menu.find(".custom-options span.selected").map(function() {
                                    const op = $(this)
                                    op.removeClass("selected")
                                })
                                if(!o.hasClass("selected")) {
                                    o.addClass("selected")
                                    menu.find("div.select__trigger p").text(o.attr("data-li") || o.text())
                                }
                            })
                        })
                        menu.find("input").keyup(function() {
                            const value = String($(this).val() || "")
                            menu.find("span").each(function(i, x) {
                                const option = $(this)
                                
                                if((option.text() || "").indexOf(value) > -1 || (option.attr('data-value') || "") == value) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            });
                        })
                    }, function() {
                        const menu = $(this)
                        menu.find("input").val("")
                        menu.removeClass("open")
                        menu.find("span").each(function(i, x) {
                            const option = $(this).show()
                        })
                    })
                }}
            />

            <Script />


        </>
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
        }).then(res => res.json()) as User;
        
        try {
            const guild = await fetch(`${process.env.BOT_API}`.replace(/\/$/, '') + "/api/guild/" + ctx.query.guild)
            .then(res => res.json()) as APIGuildResponse;

            if(guild.status == 404 || !guild?.data) return {
                redirect: {
                    destination: '/invite?guild=' + ctx.query.guild,
                    permanent: false,
                }
            }

            const dbs = initializerFirebases()

            const database = (await dbs.guilds.ref(`Servers/${guild.data.id}`).once('value')).val()

            const baseToken = `${Number(user.id).toString(12)}-${Number(ctx.query.guild).toString(36)}-`

            if(!global.tokens || (typeof global.tokens == "object" && !Array.isArray(global.tokens))) {
                global.tokens = {}
            }

            const [oldToken] = Object.entries(global.tokens).find(([k, v]) => k.startsWith(baseToken)) || []
            console.log(oldToken)
            if(oldToken) {
                delete global.tokens[oldToken]
            }

            const newToken = baseToken + Math.random().toString(36).split(".")[1]

            global.tokens[newToken] = {
                guild: ctx.query.guild,
                user: user.id,
                token: token,
            }

            console.log(global.tokens)

            return {
                props: {
                    token,
                    user,
                    guild: guild.data,
                    database: database,
                    reqToken: newToken,
                }
            }
        } catch (e) {
            return {
                redirect: {
                    destination: '/500?error=' + encodeURI(e.message),
                    permanent: false,
                }
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

/*
Test Function

function request() {
    axios.patch("/api/guilds/869916717122469898", { 
        token: localStorage.getItem("reqToken")
    }).then(({ data }) => {
        console.log(data);
        localStorage.setItem("reqToken", data.data.token);
    })
}
*/