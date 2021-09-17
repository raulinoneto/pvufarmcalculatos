// function coinsListener() {
//     let list = document.getElementById("coins-to-convert");
//     let opts = []

//     let coinsToConvert = JSON.parse(this.response)
//     for (let i = 0; i < coinsToConvert.length; i++) {
//         let opt = document.createElement("option");
//         opt.value = coinsToConvert[i].toUpperCase()
//         list.appendChild(opt)
//     }

//     console.log(list);

// };

// let coinsReq = new XMLHttpRequest();
// coinsReq.onload = coinsListener;
// coinsReq.open("GET", "https://api.coingecko.com/api/v3/simple/supported_vs_currencies", true);
// coinsReq.send();

let mamaData = {
    name: "Sunflower Mama",
    le: 850,
    timeToHarvest: 144
}

let babyData = {
    name: "Sunflower Sapling",
    le: 250,
    timeToHarvest: 72
}

function changePlant(e) {
    if (e.value != "NFT Plant") {
        let nftDetailsDiv = document.getElementById("nft-details")
        nftDetailsDiv.innerHTML = ""
        return
    }

    let divClass = "column is-two-fifths"
    let inputClass = "input is-primary"

    let le = document.createElement("input");
    le.id = "le-quantity"
    le.placeholder = "Fill LE Quantity"
    le.className = inputClass
    let leDiv = document.createElement("div");
    leDiv.className = divClass
    leDiv.appendChild(le)

    let htime = document.createElement("input");
    htime.id = "htime"
    htime.placeholder = "Fill Time to Harvest"
    htime.className = inputClass
    let htimeDiv = document.createElement("div");
    htimeDiv.className = divClass
    htimeDiv.appendChild(htime)

    let nftDetailsDiv = document.getElementById("nft-details")
    nftDetailsDiv.appendChild(leDiv)
    nftDetailsDiv.appendChild(htimeDiv)
}

function addPlant() {
    let plantToAdd = document.getElementById("plant-selector")
    let plantDetails = {}
    switch (plantToAdd.value) {
        case "Sunflower Mama":
            plantDetails = mamaData
            break;
        case "Sunflower Sapling":
            plantDetails = babyData
            break;
        case "NFT Plant":
            let le = document.getElementById("le-quantity")
            if (le.value == "") {
                le.className = "border-2 rounded-md border-red"
                alertNFT()
                return
            }

            let htime = document.getElementById("htime")
            if (htime.value == "") {
                htime.className = "border-2 rounded-md border-red"
                alertNFT()
                return
            }

            let alert = document.getElementById("alert-nft")
            if (alert != null) {
                alert.remove()
            }

            plantDetails = {
                name: "NFT Plant",
                le: le.value,
                timeToHarvest: htime.value
            }
            break;
    }

    let table = document.getElementById("plants-tab")
    table.className = "table"

    if (plantDetails.id == "" || plantDetails.id == undefined) {
        plantDetails.id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    }

    saveLocalStorage(plantDetails)
    generateRow(plantDetails)

    let nftDetailsDiv = document.getElementById("nft-details")
    plantToAdd.value = ""
    nftDetailsDiv.innerHTML = ""
}

function generateRow(plantDetails) {
    let tbody = document.getElementById("plants")

    let leh = plantDetails.le / plantDetails.timeToHarvest
    let led = leh * 24

    let row = document.createElement("tr");
    row.className = "bg-emerald-200"

    let nameTd = document.createElement("td");
    nameTd.className = "text-center"
    nameTd.innerHTML = plantDetails.name
    let lehTd = document.createElement("td");
    lehTd.className = "text-center"
    lehTd.innerHTML = Math.round((leh + Number.EPSILON) * 100) / 100
    let ledTd = document.createElement("td");
    ledTd.className = "text-center"
    ledTd.innerHTML = Math.round((led + Number.EPSILON) * 100) / 100

    let removeBtn = document.createElement("button");
    removeBtn.className = "button is-small is-danger"
    removeBtn.innerHTML = "Remove Plant"
    removeBtn.addEventListener("click", function () {
        row.remove()
        removeLocalStorage(plantDetails.id)
        if (tbody.childElementCount == 0) {
            let table = document.getElementById("plants-tab")
            table.className = "table is-hidden"
        }
        calculatePVU()
    })

    let actionTd = document.createElement("td");
    actionTd.className = "text-center"
    actionTd.appendChild(removeBtn)

    row.appendChild(nameTd)
    row.appendChild(lehTd)
    row.appendChild(ledTd)
    row.appendChild(actionTd)

    tbody.appendChild(row)
    calculatePVU()
}

function alertNFT() {
    let nftDetailsDiv = document.getElementById("nft-details")
    let message = document.createElement("p");
    message.id = "alert-nft"
    message.innerHTML = "Fill the red fields above"
    nftDetailsDiv.appendChild(message)
}

function saveLocalStorage(plantDetails) {
    let storedPlants = getStoredPlants()

    storedPlants.push(plantDetails)
    localStorage.setItem("pvu_plants", JSON.stringify(storedPlants))
}

function removeLocalStorage(plantID) {
    let storedPlants = getStoredPlants()

    for (let i = 0; i < storedPlants.length; i++) {
        if (storedPlants[i].id == plantID) {
            storedPlants.splice(i, 1)
        }
    }
    localStorage.setItem("pvu_plants", JSON.stringify(storedPlants))
}

function getStoredPlants() {
    let storedPlants = localStorage.getItem("pvu_plants")
    if (storedPlants == null) {
        storedPlants = Array()
    } else {
        storedPlants = JSON.parse(storedPlants)
    }
    return storedPlants
}

function fillStoredPlants() {
    let storedPlants = getStoredPlants()
    if (storedPlants.length == 0) {
        return
    }

    for (let i = 0; i < storedPlants.length; i++) {
        generateRow(storedPlants[i])
    }

    let table = document.getElementById("plants-tab")
    table.className = "table"
}

function calculatePVU() {
    let storedPlants = getStoredPlants()

    let totalHourly = 0
    for (let i = 0; i < storedPlants.length; i++) {
        totalHourly += (storedPlants[i].le / storedPlants[i].timeToHarvest) / 150
    }

    let hourly = document.createElement("p");
    hourly.id = "pvu-hourly"
    hourly.innerHTML = "Total PVU Hourly: " + Math.round((totalHourly + Number.EPSILON) * 100) / 100
    let daily = document.createElement("p");
    daily.id = "pvu-daily"
    daily.innerHTML = "Total PVU Daily: " + Math.round(((totalHourly * 24) + Number.EPSILON) * 100) / 100
    let weekly = document.createElement("p");
    weekly.id = "pvu-weeky"
    weekly.innerHTML = "Total PVU Weekly: " + Math.round(((totalHourly * 168) + Number.EPSILON) * 100) / 100
    let monthly = document.createElement("p");
    monthly.id = "pvu-mothly"
    monthly.innerHTML = "Total PVU Monthly: " + Math.round(((totalHourly * 720) + Number.EPSILON) * 100) / 100

    let pvuTotals = document.getElementById("pvu-earned")
    pvuTotals.innerHTML = ""
    pvuTotals.appendChild(hourly)
    pvuTotals.appendChild(daily)
    pvuTotals.appendChild(weekly)
    pvuTotals.appendChild(monthly)
}

fillStoredPlants()