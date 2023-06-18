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
let curCardIndex = 0;


async function showCurrentCard(): Promise<number> {
    const allElements = await fetchRestEndpoint(`http://localhost:3000/api/setElement/getSetElementsBySetId/${getSetId}`, 'GET');
    let card = <HTMLElement>document.getElementById("vocabCard");

    const currentVocabulary = allElements[curCardIndex];
    let curWord = currentVocabulary._word;
    let curDef = currentVocabulary._definition;

    card.innerHTML =
        `<div class="card">
            <div class="card-body">
            <h1>${curWord}</h1>
            </div>
        </div>`;

    return allElements.length;
}

document.addEventListener("DOMContentLoaded", async () => {
    const setLength = await showCurrentCard();

    const prevButton = <HTMLElement>document.getElementById('prev');
    const nextButton = <HTMLElement>document.getElementById('next');

    prevButton.addEventListener('click', async function () {
        if(curCardIndex !== 0){
            curCardIndex--;
            await showCurrentCard()
        }
    });

    nextButton.addEventListener('click', async function () {
        if(curCardIndex !== setLength - 1){
            curCardIndex++;
            await showCurrentCard()
        }
    });
});