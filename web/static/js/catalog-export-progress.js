import socket from "./socket";

function followExportProgress(catalogId, structureProgCb, imageProgCb) {
    let channel = socket.channel("catalog:" + catalogId, {}),
        processedItems = 0,
        processedImages = 0;

    channel.join()
        .receive("ok", resp => {})
        .receive("error", resp => { console.log("Unable to join", resp); });

    channel.on("structure-export-progress", payload => {
        structureProgCb(++processedItems, payload.number_sections);
    });
    channel.on("structure-export-finished", payload => {
        structureProgCb(processedItems, payload.number_sections, "done");
    });

    channel.on("image-export-progress", payload => {
        imageProgCb(++processedImages, payload.number_images);
    });
    channel.on("image-export-finished", payload => {
        imageProgCb(processedImages, payload.number_images, "done");
    });

    channel.push("start-structure-export", {id: catalogId});
    channel.push("start-image-export", {id: catalogId});
}

export default followExportProgress;
