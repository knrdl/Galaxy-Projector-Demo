<script lang="ts">
    import {Button, Card, SnackbarContainer, Tab,} from 'attractions';
    import {
        ChevronLeftIcon,
        CloudIcon,
        StarIcon,
    } from 'svelte-feather-icons'
    import {slide, blur, fly, fade} from 'svelte/transition'
    import GalaxyList from "./GalaxyList.svelte";
    import PowerBtn from "./PowerBtn.svelte";
    import Background from "./Background.svelte";
    import ModalSave from "./galaxy/ModalSave.svelte";
    import LivePreview from "./galaxy/LivePreview.svelte";
    import TabStars from "./galaxy/stars/TabStars.svelte";
    import TabNebula from "./galaxy/nebula/TabNebula.svelte";
    import isEqual from "lodash/isEqual"
    import cloneDeep from "lodash/cloneDeep"

    let snackbar: SnackbarContainer

    let galaxies: Galaxy[] = [{
        "name": "green nebula",
        "nebula": {"on": true, "scene": {"speed": 100, "mode": "flash", "colors": [{"h": 120, "s": 100, "v": 100}]}},
        "stars": {"speed": 50, "on": false, "brightness": 30},
        selected: false
    }, {
        "name": "stars only",
        "nebula": {"on": false, "scene": {"speed": 50, "mode": "flash", "colors": [{"h": 120, "s": 99, "v": 100}]}},
        "stars": {"on": true, "brightness": 100, "speed": 50},
        selected: false
    }, {
        "name": "rainbow change",
        "nebula": {
            "on": true,
            "scene": {
                "speed": 20,
                "mode": "breath",
                "colors": [
                    {"h": 0, "s": 100, "v": 100},
                    {"h": 51, "s": 100, "v": 100},
                    {"h": 120, "s": 100, "v": 100},
                    {"h": 182, "s": 100, "v": 100},
                    {"h": 245, "s": 100, "v": 100},
                    {"h": 287, "s": 100, "v": 100}
                ]
            }
        },
        "stars": {"on": false, "brightness": 30, "speed": 50},
        selected: false
    }]
    let selectedTab: 'stars' | 'nebula' = 'stars'

    let currentState: ProjectorState = null
    let lastState: ProjectorState = null
    let selectedGalaxyName: string = null
    let selectedGalaxyChanged: boolean = false

    let editorHsv: HSV = {h: 0, s: 0, v: 0}

    let showModal: boolean = false

    function selectGalaxy(galaxy: Galaxy) {
        selectedGalaxyName = galaxy.name
        currentState = {nebula: galaxy.nebula, stars: galaxy.stars, power: true}
        lastState = cloneDeep(currentState)
        selectedGalaxyChanged = false
        editorHsv = galaxy.nebula.scene.colors[0]
    }

    $: if (currentState && !isEqual(currentState, lastState)) {
        lastState = cloneDeep(currentState)
        selectedGalaxyChanged = true
    }

</script>

<div class="snackbar-outer">
    <SnackbarContainer bind:this={snackbar}>
    </SnackbarContainer>
</div>

<ModalSave bind:open={showModal} {galaxies} {selectedGalaxyName} {currentState}
           on:leave={()=>selectedGalaxyName = null} on:update={ev => galaxies = ev.detail}/>

<main class="flex center">
    <Card outline class="container mt-4">
        <header class="flex content-between items-center mb-2">
            {#if selectedGalaxyName}
                <Button neutral on:click={()=>{selectedGalaxyChanged ? showModal=true : selectedGalaxyName = null }}>
                    <ChevronLeftIcon size="20"/>
                </Button>
                <div class="flex center">
                    <Tab value="stars" name="galaxy-menu" style="flex-grow:1" bind:group={selectedTab}>
                        <div class="flex center" style="min-width: 6rem">
                            <StarIcon size="20" class="me-2"/>
                            <span>stars</span>
                        </div>
                    </Tab>
                    <Tab value="nebula" name="galaxy-menu" bind:group={selectedTab}>
                        <div class="flex center" style="min-width: 6rem">
                            <CloudIcon size="20" class="me-2"/>
                            <span>nebula</span>
                        </div>
                    </Tab>
                </div>
            {:else}
                <h1>Galaxy Projector</h1>
            {/if}
            <PowerBtn on={currentState?.power}/>
        </header>

        {#if selectedGalaxyName}
            <div transition:fade|local>
                <div class="flex center mb-3 pt-3">
                    <LivePreview bind:hsv={editorHsv} bind:galaxy={currentState}/>
                </div>

                {#if selectedTab === 'stars'}
                    <TabStars bind:galaxy={currentState}/>
                {:else if selectedTab === 'nebula'}
                    <TabNebula bind:editorHsv={editorHsv} bind:galaxy={currentState}/>
                {/if}
            </div>
        {:else}
            <div transition:blur|local>
                <GalaxyList {galaxies} on:select={ev => selectGalaxy(ev.detail)}
                            on:update={ev => galaxies = ev.detail}/>
            </div>
        {/if}
    </Card>
</main>
<Background/>

<style lang="scss">
  @import "src/styles/utils";

  main {
    :global(.container) {
      min-width: 400px;
    }
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  h1 {
    color: #2d119e;
    text-transform: uppercase;
    font-size: 1.8em;
    font-weight: 100;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 1rem;
  }

  .snackbar-outer {
    position: fixed;
    right: 1em;
    bottom: 1em;
  }
</style>

