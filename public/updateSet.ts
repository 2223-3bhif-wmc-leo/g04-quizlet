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

document.addEventListener("DOMContentLoaded", async () => {
    let inputForm = <HTMLElement>document.getElementById("inputForm");

    await getElements();
});
async function getElements() {
    // TODO: get all elements from set
    const allElements = await fetchRestEndpoint(`http://localhost:3000/api/setElement/getSetElementsBySetId/${getSetId}`, 'GET');
    let elementList = <HTMLElement>document.getElementById("elementList");
    allElements.forEach((element: any) => {
        elementList.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${element._word}</h5>
                    <p class="card-text">${element._definition}</p> 
                </div>
            </div>`
    });
}