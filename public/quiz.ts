async function fetchRestEndpoint(route: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: object): Promise<any> {
    let options: any = {method};
    if (data) {
        options.headers = {'Content-Type': 'application/json'};
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}

const queryParams = new URLSearchParams(window.location.search);
const getSetId = <number><unknown>queryParams.get('setid');

async function getQuestions() {
    const allElements = await fetchRestEndpoint(`http://localhost:3000/api/setElement/getSetElementsBySetId/${getSetId}`, 'GET');
    let questionList = <HTMLElement>document.getElementById("questionList");
    const elementLength = allElements.length;
    questionList.innerHTML += `<h4 class="headlineBetween">${elementLength} Questions</h4>`;

    allElements.forEach((element: any) => {
        questionList.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Definition / Translation for "${element._word}":</h5>
                    <input type="text" id="definition${element._id}">
                </div>
            </div>`
    });

    questionList.innerHTML += `<button class="btn btn-primary" id="finish">Finish Quiz</button>`;
}

async function checkAnswers(){
    const allElements = await fetchRestEndpoint(`http://localhost:3000/api/setElement/getSetElementsBySetId/${getSetId}`, 'GET');
    let resultList = <HTMLElement>document.getElementById("resultList");
    resultList.innerHTML += `<h4>Results:</h4>`
    const elementLength = allElements.length;
    let correctAnswers: number = 0;

    allElements.forEach((element: any) => {
        let curTextField = <HTMLInputElement>document.getElementById(`definition${element._id}`);
        let correct: boolean;

        correct = curTextField.value.toUpperCase() == element._definition.toUpperCase();
        if(correct){
            correctAnswers++;
        }

        resultList.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${element._word} = ${curTextField.value} --> ${correct ? "CORRECT" : "WRONG"}</h5>
                    <p>${correct ? "" : `Correct Answer: ${element._definition}`}</p>
                </div>
            </div>`
    });

    resultList.innerHTML += `<h3>${correctAnswers} out of ${elementLength} words correct! (${(correctAnswers * 100 / parseInt(elementLength)).toFixed(0)}%)</h3>`;
}

document.addEventListener("DOMContentLoaded", async () => {
    await getQuestions();

    const button = <HTMLElement>document.getElementById('finish');
    button.addEventListener('click', async function () {
        await checkAnswers();
    });
});