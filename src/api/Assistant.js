import {
    createAssistant,
    createThread,
    createMessage,
    runThread,
    retrieveRun,
    createFile,
    getThreadMessages,
    submitToolOutputs,
    deleteAssistant,
    getRunSteps,
    createFileForAssistant,
    deleteAllAssistantFiles,
} from "./OpenAI";

const assistantID = "asst_2uY1Kci4p7emB8bYmx0xwtGr"

async function resetAssistant() {
    await deleteAssistant(sessionStorage.getItem("assistantID"));
    sessionStorage.removeItem("threadID");
}

async function initThread(dataSources, selectedDay) {
    try {
        console.log("Initializing assistant");

        await deleteAllAssistantFiles(assistantID);

        let tools = [{ type: "code_interpreter" }, { type: "retrieval" }]
        let files = [];

        for (const [key, value] of Object.entries(dataSources, selectedDay)) {

            let dataName = key;
            let dataType = value.format;
            let data = value.data;

            console.log("Creating file for", dataName, data);

            let day = new Date(selectedDay);
            let fileName = dataName+"_"+day.getDate()+"-"+day.getMonth()+".csv";
            const fileData = new File([JSON.stringify(data)], fileName, {type: ("application/csv")});
            const file = await createFile(fileData);

            await createFileForAssistant(assistantID, file.id);

            files.push(file.id);

            console.log("Created", fileName, file.id);
        }

        const thread = await createThread();
        sessionStorage.setItem("threadID", thread.id);

    } catch (error) {
        console.error(error);
    }
}

async function runAssistant(prompt, setTempMessage) {
    try {
        let threadID = sessionStorage.getItem("threadID");

        console.log("Running assistant with prompt", prompt);

        // Pass in the user question into the existing thread
        await createMessage(threadID, prompt);

        // Use runs to wait for the assistant response and then retrieve it
        const run = await runThread(threadID, assistantID);
        console.log("Run created", run);
        let runStatus = await retrieveRun(threadID, run.id);
        console.log("Run status", runStatus.status);
        // Polling mechanism to see if runStatus is completed
        // This should be made more robust.
        while (runStatus.status !== "completed") {
            if (runStatus.status === "requires_action" && runStatus.required_action.type === "submit_tool_output") {
                console.log("Submitting tool outputs");
                await submitToolOutputs(threadID, run.id, runStatus.required_action.tool_output_ids);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await retrieveRun(threadID, run.id);
            console.log("Polling run status", runStatus.status);
            let runSteps = await getRunSteps(threadID, run.id);
            let leatestRunStep = runSteps.data[0];
            console.log("Latest run step type", runSteps.data[0].step_details.type);

            if (leatestRunStep.step_details.type === "message_creation") {
                let latestMessages = await getThreadMessages(threadID);
                let lastMessage = latestMessages.data[0];
                console.log("Latest message", lastMessage);
                if (lastMessage.content[0]) {
                    setTempMessage(lastMessage.content[0].text.value);
                } else {
                    setTempMessage("Thinking...");
                }
                // setTempMessage(leatestRunStep.status + " -  " + leatestRunStep.step_details.type);
            }
            if (leatestRunStep.step_details.type === "tool_call") {
                let latestMessages = await getThreadMessages(threadID);
                let lastMessage = latestMessages.data[0];
                console.log("Latest tool call", lastMessage);
                if (lastMessage.content[0]) {
                    setTempMessage(lastMessage.content[0].text.value);
                } else {
                    setTempMessage("Running...");
                }
                // setTempMessage(leatestRunStep.status + " -  " + leatestRunStep.step_details.type);
            }
        }

        // Get the last assistant message from the messages array
        const threadMessages = await getThreadMessages(threadID);

        // Find the last message for the current run
        const lastMessageForRun = threadMessages.data
            .filter(
                (message) => message.run_id === run.id && message.role === "assistant"
            )
            .pop();
            

        // If an assistant message is found, console.log() it
        if (lastMessageForRun) {
            console.log("Run completed:", lastMessageForRun.content[0].text.value);
            setTempMessage("Ready.");

            return lastMessageForRun.content[0].text.value;
        }
    } catch (error) {
        console.error(error);
    }
}

export { resetAssistant, initThread, runAssistant };
