interface setDb {
    setid: number,
    userEmail: string,
    title: string,
    description: string,
    ispublic: boolean
}

interface setInsertDb {
    userEmail: string,
    title: string,
    description: string,
    isPublic: boolean
}

const email = <string> sessionStorage.getItem('email');
document.addEventListener("DOMContentLoaded", async () => {
    const createSetButton = <HTMLElement>document.getElementById("createSetButton");

    fetchRestEndpoint(`http://localhost:3000/api/set/getSetByUser/${email}`, 'GET').then(async (result) => {
        await getMySets();
    });
    await getPublicSets();
    createSetButton.addEventListener("click", async () => {
        window.location.href = `createSet.html`;
    });
})

async function reload() {
    await getMySets();
    await getPublicSets();
}

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

async function getMySets() {
    const result = await fetchRestEndpoint(`http://localhost:3000/api/set/getSetByUser/${email}`, 'GET');
    let setList = <HTMLElement>document.getElementById("mySets");
    setList.innerHTML = "";
    result.forEach((oneSet: any) => {
        setList.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <table>
                        <tr>
                            <th class="th">
                                <h5 class="card-title">${oneSet._title}</h5>
                                <p class="card-text">${oneSet._description}</p> 
                            </th>
                            <th>
                                <a class="btn-edit" id="editButton" type="button" href="updateSet.html?&setid=${oneSet._id}&title=${oneSet._title}&description=${oneSet._description}">Edit</a>
                            </th>
                        </tr>
                    </table>
                    <a href="overviewElements.html?setid=${oneSet._id}" class="btn btn-primary">Go to Set</a>
                    <a href="learnSite.html?setid=${oneSet._id}" class="btn btn-secondary">Learn</a>
                </div>
            </div>`
    });
}

async function getPublicSets() {
    const result = await fetchRestEndpoint(`http://localhost:3000/api/set/getPublicSets`, 'GET');
    let setList = <HTMLElement>document.getElementById("otherSets");
    setList.innerHTML = "";
    result.forEach((oneSet: any) => {
        setList.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${oneSet._title}</h5>
                    <p class="card-text">${oneSet._description}</p> 
                    <a href="learnSite.html?setid=${oneSet._id}" class="btn btn-secondary">Learn</a>
                </div>
            </div>`
    })
}
