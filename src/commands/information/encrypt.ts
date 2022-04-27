import { Command, CommandCategories }                    from "../../handlers/command";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed }              from "discord.js";
import { Vibey }                                         from "../../handlers/client";
import { Crypter }                                       from "../../lib/text crypter/crypter";

export default class Encrypt extends Command{
    public category: CommandCategories = 'INFORMATION';

    public builder(): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
        return new SlashCommandBuilder()
            .setName('encrypt')
            .setDescription('Encrypt your messages')
            .addStringOption((cmd: SlashCommandStringOption) =>
                cmd
                    .setName('text')
                    .setDescription('The text you want to encrypt.')
                    .setRequired(true)
            );
    };

    async handle(interaction: CommandInteraction, client: Vibey){
        const text: string = interaction.options.getString('text');
        const encrypted: Crypter = Crypter.encrypt("salt", text);

        try{
            const embed: MessageEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Encryption Successful!')
                .addFields(
                    {name: "> Text", value: `${text}`, inline: false},
                    {name: "> Encrypted Text", value: `${encrypted}`, inline: false}
                )

            await interaction.reply({
                embeds: [embed]
            });
        }catch( e ) {
            await interaction.reply({
                content  : "There was an error in executing the command. I have told the developers about it.",
                ephemeral: true
            });
            return;
        }
    }
}