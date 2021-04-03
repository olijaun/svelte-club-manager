import streamSaver from 'streamsaver';

declare global {
    interface Window {
        writer: WritableStreamDefaultWriter<any>;
    }
}

export async function download(filename: string, res: Response) {
    console.log("saving to " + filename);
    const fileStream = streamSaver.createWriteStream(filename);

    const readableStream = res.body;

    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
        return readableStream.pipeTo(fileStream)
            .then(() => console.log('done writing'))
    }

    window.writer = fileStream.getWriter();

    const reader = res.body.getReader();
    const pump = () => reader.read()
        .then(res => res.done
            ? window.writer.close()
            : window.writer.write(res.value).then(pump))

    pump();
}