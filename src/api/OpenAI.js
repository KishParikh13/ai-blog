import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

// get new completion
async function getCompletion(messages) {
    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
    return completion.choices[0].message;
}

export {
    getCompletion,
}