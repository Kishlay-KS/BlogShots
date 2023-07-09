const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: "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"
});

const openai = new OpenAIApi(configuration);

module.exports = openai;




const generateMeta = async (title) => {
    const description = await openai.createChatCompletion(
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `Come up with a description for a video titled ${title}`
                }
            ],
        }
    )
    console.log(description.data.choices[0].message);
}

const readline = require('readline');
const data = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
)
data.question('Youtube video title :\n', generateMeta);
