/**
 * Created on 2021.05.15
 *
 */

/**
* Make publication list of a researchmap permalink at ul#publist.
* @param {string} permalink - A researchmap permalink of a researcher.
* @param {string} ulid - Id of HTML <ul> tag.
* @param {int} limit - Maximum number of retrieved items.
* @param {string} from_date - Starting publication date e.g. 2016 or 2016-01-01.
* @param {string} to_date - Ending publication date e.g. 2016 or 2016-01-01.
*/
function publist(permalink, ulid='publist', limit=100, from_date='', to_date=''){

    let publicationList = document.querySelector(`ul#${ulid}`);  // target html element
    
    const baseurl = 'https://api.researchmap.jp'
    const achievement_type = 'published_papers';  // published_papers
    const myHeaders = new Headers({'Accept': 'application/json'});
    let query_params = {};
    if (limit) { query_params["limit"] = limit; } // default = 100
    if (from_date) { query_params["from_date"] = from_date; }
    if (to_date) { query_params["to_date"] = to_date; }
    const qs = new URLSearchParams(query_params);
    const url = `${baseurl}/${permalink}/${achievement_type}?${qs}`;
    
    fetch(url, {method: 'GET', headers: myHeaders})
        .then((response) => {
            console.log(`Status: ${response.status}; ${response.url}`); // 200: ok
            return response.json()
        })
        .then((data) => {
            if (!data.hasOwnProperty("items")){
                throw new Error('data has no items');
            }
            for (const item of data["items"]) {
                if(!item["identifiers"] || !item["identifiers"]["doi"] || !item["paper_title"]["en"] || item["published_paper_type"] != 'scientific_journal'){
                    continue;
                }
                let listItem = document.createElement('li');
                listItem.appendChild(
                    document.createElement('strong')
                ).innerHTML = item["paper_title"]["en"];
                let journal = item["publication_name"]["en"];
                let year = item["publication_date"].slice(0, 4);
                let doistr = item["identifiers"]["doi"][0];
                listItem.appendChild(document.createElement('i')).textContent = `, ${journal} (${year}) `;
                let alink = document.createElement('a');
                alink.textContent = doistr;
                alink.setAttribute('href', `https://doi.org/${doistr}`);
                listItem.appendChild(alink);
                
                publicationList.appendChild(listItem);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    
/**
* make publication list of researchers specified by multiple permalinks of researchmap
* Target html element: ul#publist
* @param {string[]} permalinks - Array of researchmap permalinks.
* @param {string} ulid - Id of HTML <ul> tag.
* @param {int} limit - Maximum number of retrieved items for each permalink.
* @param {string} from_date - Starting publication date e.g. 2016 or 2016-01-01.
* @param {string} to_date - Ending publication date e.g. 2016 or 2016-01-01.
*/
function publistMulti(permalinks, ulid='publistMulti', limit=100, from_date='', to_date=''){

    const publicationList = document.querySelector(`ul#${ulid}`);  // target html element
    
    const baseurl = 'https://api.researchmap.jp'
    const achievement_type = 'published_papers';  // published_papers
    const myHeaders = new Headers({'Accept': 'application/json'});
    let query_params = {};
    if (limit) { query_params["limit"] = limit; } // default = 100
    if (from_date) { query_params["from_date"] = from_date; }
    if (to_date) { query_params["to_date"] = to_date; }
    const qs = new URLSearchParams(query_params); 
    const urls = permalinks.map((plink) => `${baseurl}/${plink}/${achievement_type}?${qs}`);
    const fetchRequests = urls.map((url)=> fetch(url, {method: 'GET', headers: myHeaders}));

    let dataarr = [];  // all items of multiple permalinks
    let datamap = new Map();  // to delete duplicate of items

    Promise.all(fetchRequests) // multiple fetch
        .then((responses) => { // status check for debug
            for(let res of responses) {
                console.log(`Status: ${res.status}; ${res.url}`); // 200: ok
            }
            return responses;
        })
        .then(async (responses) => { // resolve response bodies and sorting
            const resolved = await Promise.all(responses.map((res) => res.json()));
            for (let resol of resolved) {
                if (resol.hasOwnProperty("items")){ 
                    resol["items"].forEach((item) => dataarr.push(item)); // get .items of researchmap API
                }
            }
            // dataarr contains all items of published_paper of multiple permalinks
            for (let item of dataarr){
                if(item["identifiers"] && item["identifiers"]["doi"] && item["paper_title"]["en"] && item["published_paper_type"] == 'scientific_journal'){
                    // show only scientific_journal with doi and english title
                    const doi = item["identifiers"]["doi"][0].toLowerCase(); // use doi[0] as index
                    if(doi){
                        datamap.set(doi, item);  // excluding duplication by doi
                    }
                }
            }
            // sort by publication date
            let sortarr = Array.from(datamap.values());  // reconvert to an array
            sortarr.sort(function(a, b) {
                if(!a.hasOwnProperty("publication_date") || !b.hasOwnProperty("publication_date")){
                    return 0;
                }
                if (a["publication_date"] > b["publication_date"]) {
                    return -1;  // RCO: -1
                } else {
                    return 1;   // RCO: 1
                }
             });
            // console.log(sortarr);
            // html
            for (let item of sortarr) {
                let listItem = document.createElement('li');
                listItem.appendChild(document.createElement('strong')).innerHTML = item["paper_title"]["en"];
                let journal = item["publication_name"]["en"];
                let year = item["publication_date"].slice(0, 4);
                listItem.appendChild(document.createElement('i')).textContent = `, ${journal} (${year}) `;
                var alink = document.createElement('a');
                let doistr = item["identifiers"]["doi"][0];
                alink.textContent = doistr;
                alink.setAttribute('href', `https://doi.org/${doistr}`);
                listItem.appendChild(alink);
                    publicationList.appendChild(listItem);
            };
        })
        .catch((err) => {
            console.error('Error:', err);
        });
    }
