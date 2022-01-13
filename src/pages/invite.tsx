import { GetServerSideProps } from 'next';
import generateOAuth2 from "../Utils/generateOAuth2";
import { Permissions } from '../types';

export default function Login() {
    return (
        <h1>Oxe</h1>
    )
}

export const getServerSideProps: GetServerSideProps = async(ctx) => {
    const guildId = String(ctx.query.guildId || "");

    const url = generateOAuth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        redirect_uri: process.env.API_AUTH_CALLBACK,
        scopes: ["identify", "guilds", "bot", "applications.commands"],
        prompt: "none",
        response_type: "code",
        permissions: Permissions.ADMINISTRATOR,
        guildId
    })

    return {
        redirect: {
            destination: url,
            permanent: false
        }
    }
}