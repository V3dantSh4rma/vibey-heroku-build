import { CommandInteraction } from "discord.js";
import axios                  from "axios";

export async function alertError(Interaction: CommandInteraction, Error: any, CommandName: string){
    const params: any = {
        username: "Error handler",
        avatar_url: Interaction.user.avatarURL(),
        embeds: [
            {
                "title": "Command Error",
                "color": 15258703,
                "fields": [
                    {
                        name: "> Command",
                        value: CommandName,
                        inline: false
                    },
                    {
                        name: "> Error",
                        value: Error,
                        inline: false
                    }
                ]
            }
        ]
    };


    await axios.post(process.env.WEBHOOK_URL as string, JSON.stringify(params));
}