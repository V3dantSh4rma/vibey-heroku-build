import { Command, CommandCategories }                  from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, User } from "discord.js";
import { Vibey }                                       from "../../handlers/client";
import { Canvacord }                                   from "canvacord";

export default class Trigger extends Command {
    public category: CommandCategories = "IMAGE";

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName("trigger")
            .setDescription("Trigger your avatar.")
            .addUserOption(( user: SlashCommandUserOption )=>
                user
                    .setName("user")
                    .setDescription("The user you want to trigger the avatar of.")
                    .setRequired(false)
            );
    }

    async handle( interaction: CommandInteraction, client: Vibey ): Promise<void> {
        const user: ( User | null ) = interaction.options.getUser("user") ?? interaction.user;

        try {

            if( !interaction?.guild?.me?.permissions.has("ATTACH_FILES") ) {
                await interaction.reply("I require \"ATTACH_FILES\" permission to use this command.");
                return;
            }

            const trigger: Buffer               = await Canvacord.trigger(`${ user.avatarURL({ format: "png" }) }`);
            const attachment: MessageAttachment = new MessageAttachment(trigger, "trigger.gif");


            await interaction.reply({ files: [ attachment ] });
        } catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}