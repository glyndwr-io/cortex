<script lang="ts">
    import type { OutputProps } from "./$types";
    import type { SocketEvent, ThalamusPrediction } from "$lib/thalamus";
	import Card from "$lib/ui/Card.svelte";
	import Input from "$lib/ui/Input.svelte";
	import Button from "$lib/ui/Button.svelte";
	import Progress from "$lib/ui/Progress.svelte";
	import { onDestroy, onMount } from "svelte";
    import { enhance } from '$app/forms';
	import { browser } from "$app/environment";
    import { webSocket, traningQueue } from '$lib/stores'
	import { get } from "svelte/store";
    import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
    import type { ChartType } from 'chart.js'
    import type { SubmitFunction } from '$app/forms'
	import Textarea from "$lib/ui/Textarea.svelte";
	import Select from "$lib/ui/Select.svelte";
	import { goto } from "$app/navigation";
	import Filedrop from "$lib/ui/Filedrop.svelte";

    export let data: OutputProps
    let { datasets } = data
    $: ({ datasets} = data)

    enum Stage {
        PRE,
        TRAINING,
        POST,
    }

    interface TrainingUpdate {
        epoch: number
        trainLoss: number
        trainAccuracy: number
        validLoss: number
        validAccuracy: number
    }

    let percent = -1
    let updates: TrainingUpdate[] = []
    let stage = Stage.PRE
    let slug: string
    let predicting: boolean = false
    let prediction: ThalamusPrediction

    const events = {
        'trainingStart': () => {
            percent = 0
        },
        'epochStart': (data: TrainingUpdate) => {

        },
        'batchEnd': (data: TrainingUpdate) => {
            const {
                epoch,
                trainLoss,
                trainAccuracy,
                validLoss,
                validAccuracy,
            } = data

            updates[epoch] = {
                epoch,
                trainLoss,
                trainAccuracy,
                validLoss,
                validAccuracy,
            }
        },
        'epochEnd': (data: TrainingUpdate) => {
            const {
                epoch,
                trainLoss,
                trainAccuracy,
                validLoss,
                validAccuracy,
            } = data

            updates[epoch] = {
                epoch,
                trainLoss,
                trainAccuracy,
                validLoss,
                validAccuracy,
            }

            updates = updates
        },
        'trainingEnd': () => {
            stage = Stage.POST
            traningQueue.set([])
            percent = -1

            const canvas = document.getElementById('trainingChart') as HTMLCanvasElement
            if(!canvas) return

            const style = getComputedStyle(document.body)

            const chartData = {
                labels: [] as string[],
                datasets: [
                    {
                        label: 'Training Accuracy',
                        backgroundColor: style.getPropertyValue('--accent-purple'),
                        borderColor: style.getPropertyValue('--accent-purple'),
                        data: [] as number[],
                    },
                    {
                        label: 'Training Loss',
                        backgroundColor: style.getPropertyValue('--accent-red'),
                        borderColor: style.getPropertyValue('--accent-red'),
                        data: [] as number[],
                    },
                    {
                        label: 'Validation Accuracy',
                        backgroundColor: style.getPropertyValue('--accent-pink'),
                        borderColor: style.getPropertyValue('--accent-pink'),
                        data: [] as number[],
                    },
                    {
                        label: 'Validation Loss',
                        backgroundColor: style.getPropertyValue('--accent-yellow'),
                        borderColor: style.getPropertyValue('--accent-yellow'),
                        data: [] as number[],
                    },
                ]
            };

            updates.forEach(u => {
                chartData.labels.push(`Epoch ${u.epoch+1}`)
                chartData.datasets[0].data.push(u.trainAccuracy * 100)
                chartData.datasets[1].data.push(u.trainLoss * 100)
                chartData.datasets[2].data.push(u.validAccuracy * 100)
                chartData.datasets[3].data.push(u.validLoss * 100)
            })
            

            const config = {
                type: 'line' as ChartType,
                data: chartData,
                options: {}
            };
            
            window.chart = new Chart(canvas, config)
        },
    }

    const startTraining: SubmitFunction = () => {
        window.chart?.destroy()
        updates = []
        percent = -1
        stage = Stage.TRAINING
        traningQueue.set([0])

        return async ({update, result}) => {
            const { data } = result as any
            slug = data.slug
            update()
        }
    }

    const predict: SubmitFunction = () => {
        predicting = true
        return async ({result, update}) => {
            const { data } = result as any
            prediction = data as ThalamusPrediction
            predicting = false

            update()
        }
    }
    
    onMount(()=>{
        const socket = get(webSocket)
        if(socket === null) return

        Chart.register(
            LineController,
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement
        )

        socket.addEventListener('message', e => {
            const { event, data } = JSON.parse(e.data) as SocketEvent

            if(data) {
                percent = parseFloat(data.progress?.toString() || '')
                traningQueue.set([percent])
            }

            const callback = events[event as keyof typeof events]
            if(!callback) return

            callback(data as TrainingUpdate)
        })
    })
</script>

<h1>Train New Model</h1>
<Card>
    <form class="train" method="POST" action='?/train' use:enhance={startTraining}>
        <Input label="Model Name" name="title" required/>
        <Select label="Source Dataset" name="sourceDataset" required options={datasets}/>
        <Select label="Training Mode" name="mode" required value="classic" options={[{ label: 'Classic', value: 'classic' }]}/>
        <Input label="Epochs" name="epochs" required type="number" min="1" value="10"/>
        <Input label="Batch Size" name="batchSize" required type="number" min="1" value="32"/>
        <Input label="Training Split" name="trainingSplit" required type="number" min="0" max="1" step="0.1" value="0.2"/>
        <Input label="Validation Split" name="validationSplit" required type="number" min="0" max="1" step="0.1" value="0.2"/>
        <div class="three-cols">
            <Textarea label="Description" name="description" required/>
        </div>
        <div class="three-cols">
            <Button>Train Model</Button>
        </div>
    </form>
</Card>

<h2>Make a Prediction</h2>
<Card>
    <div class="split">
        <form class="predict" method="POST" action='?/predict' use:enhance={predict}>
            <Filedrop label="Drop Image for Prediction" name="prediction"/>
            <Button>Predict</Button>
        </form>
        <div class="prediction">
            {#if predicting}
                <h2>Predicting</h2>
                <Progress percent={-1} />
            {:else if prediction}
                <h2>Prediction: {prediction?.prediction}</h2>
                <p>Confidence: {prediction?.confidence.toFixed(2)}%</p>
            {/if}
        </div>
    </div>
</Card>

<h2>Training Data</h2>
<Card>
    <canvas id="trainingChart"></canvas>
    {#if stage === Stage.TRAINING}
        <Progress {percent} />
        <table>
            <thead>
                <tr>
                    <th>Epoch</th>
                    <th>Training Accuracy</th>
                    <th>Training Loss</th>
                    <th>Validation Accuracy</th>
                    <th>Validation Loss</th>
                </tr>
            </thead>
            <tbody>
                {#if updates.length > 0}
                {@const latest = updates[updates.length-1]}
                {@const latesValidAcc = latest.validAccuracy ?? updates[updates.length-2]?.validAccuracy}
                {@const latesValidLoss = latest.validLoss ?? updates[updates.length-2]?.validLoss}
                    <tr>
                        <td>{latest.epoch + 1}</td>
                        <td>{(latest.trainAccuracy * 100).toFixed(2)}%</td>
                        <td>{(latest.trainLoss * 100).toFixed(2)}%</td>
                        <td>{latesValidAcc ? (latesValidAcc * 100).toFixed(2)+'%' : ''}</td>
                        <td>{latesValidLoss ? (latesValidLoss * 100).toFixed(2)+'%' : ''}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
        <p>A full progress history and report will be available when the training is complete</p>
    {:else if stage === Stage.POST}
        <table>
            <thead>
                <tr>
                    <th>Epoch</th>
                    <th>Training Accuracy</th>
                    <th>Training Loss</th>
                    <th>Validation Accuracy</th>
                    <th>Validation Loss</th>
                </tr>
            </thead>
            <tbody>
                {#each updates as update}
                    <tr>
                        <td>{update.epoch + 1}</td>
                        <td>{(update.trainAccuracy * 100).toFixed(2)}%</td>
                        <td>{(update.trainLoss * 100).toFixed(2)}%</td>
                        <td>{update.validAccuracy ? (update.validAccuracy * 100).toFixed(2)+'%' : ''}</td>
                        <td>{update.validLoss ? (update.validLoss * 100).toFixed(2)+'%' : ''}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <Button on:click={()=>goto(`/models/${slug}`)}>Go to model</Button>
    {/if}
</Card>

<style>
    form.train {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    form.predict {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 20vh;
        gap: 1rem;
    }

    .prediction h2 {
        text-align: center;
    }

    .three-cols {
        grid-column: 1/4;
    }

    table {
        width: 100%;
        text-align: center;
    }

    p {
        text-align: center
    }
</style>