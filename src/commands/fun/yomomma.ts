import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, User }                    from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import axios, { AxiosResponse }                        from "axios";

export default class Yomomma extends Command {
    public category: CommandCategories = "FUN";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("yomomma")
            .setDescription("Yo momma so fat.")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to use this command on.")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ) {

        try {
            const user: ( User | null )   = interaction.options.getUser("user");
            const res: AxiosResponse<any> = await axios.get<string>(process.env.YOMOMMA_API as string);

            if( user ) {
                await interaction.reply(`<@!${ user.id }>, ${ res.data.joke }`);
            }

            await interaction.reply(`${ res.data.joke }`);
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}