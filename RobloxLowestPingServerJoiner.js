const gameId = window.location.href.split('/')[4];

let minPing = Number.MAX_VALUE;
let jobId;

async function checkServers(gameId, nextPageCursor) {
    await fetch(`https://games.roblox.com/v1/games/${gameId}/servers/Public?sortOrder=Desc&excludeFullGames=true&limit=100${nextPageCursor ? `&cursor=${nextPageCursor}` : ''}`)
        .then(response => response.json())
        .then(async data => {
            data.data.forEach(serverData => {
                let ping = serverData.ping
                if (ping < minPing) {
                    minPing = ping
                    jobId = serverData.id
                }
            });
            if (data.nextPageCursor != null) {
                await checkServers(gameId, data.nextPageCursor);
            }
        })
}

await checkServers(gameId);
Roblox.GameLauncher.joinGameInstance(gameId, jobId);
