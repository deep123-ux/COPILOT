const API_KEY = "";

async function askGemini(scenario, metadata, message){

const prompt = `
You are a scenario based copilot.

Scenario:
${scenario}

Metadata:
${metadata}

User Question:
${message}

Respond based on the scenario.
`;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{ text: prompt }
]
}
]
})
}
);

const data = await response.json();

return data.candidates[0].content.parts[0].text;

}