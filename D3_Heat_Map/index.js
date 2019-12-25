async function getDataset(url) {
    return await fetch(url)
                        .then(response => response.json())
}

async function main() {

    var dataSet = await getDataset('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    console.log(dataSet)
}

main()