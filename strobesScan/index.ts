import core = require('azure-pipelines-task-lib/task');
const fetch = require('node-fetch');


type jsonResponseType = {
    task_id: string;
}


async function run() {
    try {
        const scanApi: string = "/api/v1/cicd/scan/"
        const strobesUrl: string | undefined = core.getInput('strobes_url', true);
        const token: string | undefined = core.getInput('auth_token', true);
        const configName: string | undefined = core.getInput('config_name', true);
        const branch: string | undefined = core.getInput('target', true);
        const rules: string | undefined = core.getInput('rules', false)

        console.log("Starting Strobes scan")
        let scan_url: string = strobesUrl + scanApi;
        let jsonResponse: jsonResponseType = { task_id: '' };
        let taskId: string | undefined;

        const fetchRes = await fetch(scan_url, {
            method: 'POST',
            body: JSON.stringify({
                configuration_name: configName,
                target: branch,
            }),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'token ' + token
            },
        })
        jsonResponse = await fetchRes.json();
        taskId = jsonResponse.task_id;

        if (typeof taskId !== 'undefined' && taskId) {
            // Do scan status and result thing
            const statusApi: string = "/api/v1/cicd/status/"
        }
    } catch (error: any) {
        core.setResult(core.TaskResult.Failed, error.message);
    }
}


run();