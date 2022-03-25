module.exports = {
    tags: ['owner'],
    cmd: ['bio', 'setstatus'],
    help: ['setbio'],
    owner: true,
    exec: async (m: { reply: (arg0: string) => void }, client: { setStatus: (arg0: any) => any }, { args }: any) => {
        try {
            if (args.length < 1) return m.reply('apa bang?')
            const _text = args.join(' ')
            await client.setStatus(_text)
            m.reply('success.')
        } catch (error) {
            m.reply('error')
            console.log(error);
        }
    }
}