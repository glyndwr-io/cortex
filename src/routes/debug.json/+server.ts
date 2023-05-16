import { ThalamusAPI } from "$lib/thalamus"

export async function GET() {
    const thalamus = new ThalamusAPI('6fa459ea-ee8a-3ca4-894e-db77e160355e')

    const config = {
        targetDataset: 'demo',
        epochs: 2
    }

    await thalamus.trainModel('demo', config)

    return new Response()

    let val = 0
    const inter = setInterval(() => {
        global.events.emit('message', {
            orgID: 'a',
            permission: 0,
            message: val
        })
        val += 0.1
        if(val > 1.0)
            clearInterval(inter)
    }, 1000)
    
    return new Response()
}