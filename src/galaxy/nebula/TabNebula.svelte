<script lang="ts">
    import {Breadcrumbs, Button, Divider, Dot, Label, Slider, Switch} from "attractions";
    import {
        ChevronRightIcon,
        PlusIcon,
        Trash2Icon, RepeatIcon
    } from "svelte-feather-icons";
    import {hsv2css} from '../../colorcalc'
    import SceneModeSelector from "./SceneModeSelector.svelte";
    import SceneSpeedSelector from "./SceneSpeedSelector.svelte";

    export let galaxy: Galaxy
    export let selectedIdx: number = null

    export let editorHsv: HSV

    function addScene() {
        galaxy.nebula.scene.colors = [...galaxy.nebula.scene.colors, {...editorHsv}]
        selectScene(galaxy.nebula.scene.colors.length - 1)
    }

    function selectScene(idx: number) {
        selectedIdx = idx
        editorHsv = galaxy.nebula.scene.colors[selectedIdx]
        onColorChange()
    }

    function setRandomScene() {
        editorHsv.h = Math.round(Math.random() * 360)
        editorHsv.s = Math.round(Math.random() * 100)
        editorHsv.v = Math.round(Math.random() * 100)
        galaxy.nebula.scene.colors[selectedIdx] = editorHsv
        onColorChange()
    }

    function deleteSelectedScene() {
        galaxy.nebula.scene.colors.splice(selectedIdx, 1)
        selectScene(Math.min(selectedIdx, galaxy.nebula.scene.colors.length - 1))
    }

    $: sceneMode = galaxy?.nebula.scene.colors.length > 1
    $: breadcrumbIndices = [...Array(galaxy?.nebula.scene.colors.length).keys()];

    function hslBg(index: number) {
        return `background: ${hsv2css(galaxy?.nebula.scene.colors[index])}`
    }

    let sceneColorsCss: string[] = []

    async function onColorChange() {
        sceneColorsCss = []
        for (let i = 0; i < galaxy?.nebula.scene.colors.length; i++) {
            sceneColorsCss.push(hslBg(i))
        }
        galaxy = galaxy // mark object as dirty
    }

    $: {
        if (selectedIdx === null) {
            selectScene(0)
        }
    }
</script>

<div class="flex center my-2">
    <Switch bind:value={galaxy.nebula.on}>
        <Label small class="ms-2">show</Label>
    </Switch>
</div>

{#if sceneMode}
    <Divider/>

    <div class="flex center mt-2">
        <SceneSpeedSelector bind:speed={galaxy.nebula.scene.speed} disabled={!galaxy.nebula.on}/>
        <div class="mx-1"></div>
        <SceneModeSelector bind:mode={galaxy.nebula.scene.mode} disabled={!galaxy.nebula.on}/>
    </div>

    <div class="mt-2 scenes">
        <Breadcrumbs items={breadcrumbIndices}>
            <div slot="item" let:item>
                {#if item === selectedIdx}
                    <Button outline round small class="p-0" disabled={!galaxy.nebula.on}>
                        <Dot class="p-3" style="{sceneColorsCss[item]}"/>
                    </Button>
                {:else}
                    <Button outline round small class="p-0" disabled={!galaxy.nebula.on}
                            on:click={()=>selectScene(item)}>
                        <Dot class="p-2" style="{sceneColorsCss[item]}"/>
                    </Button>
                {/if}
            </div>
            <ChevronRightIcon slot="separator" size="20"/>
        </Breadcrumbs>
    </div>
{/if}

<div class="my-2 hue-selector">
    <Label>Color</Label>
    <Slider bind:value={editorHsv.h} on:change={onColorChange} min={0} max={360} disabled={!galaxy.nebula.on}
            tooltips="never"/>
</div>
<div class="my-2">
    <Label>Intensity</Label>
    <Slider bind:value={editorHsv.s} on:change={onColorChange} min={1} max={100} disabled={!galaxy.nebula.on}
            tooltips="active">
        <span slot="tooltip-content" let:value={value}>
            {value} %
        </span>
    </Slider>
</div>
<div class="my-2">
    <Label>Light</Label>
    <Slider bind:value={editorHsv.v} on:change={onColorChange} min={1} max={100} disabled={!galaxy.nebula.on}
            tooltips="active">
        <span slot="tooltip-content" let:value={value}>
            {value} %
        </span>
    </Slider>
</div>

<div class="flex content-around mt-3">
    {#if sceneMode}
        <Button danger on:click={deleteSelectedScene} disabled={!galaxy.nebula.on}>
            <Trash2Icon size="20" class="me-2"/>
            scene
        </Button>
    {/if}
    <Button on:click={setRandomScene} disabled={!galaxy.nebula.on}>
        <RepeatIcon size="20" class="me-2"/>
        random
    </Button>
    <Button on:click={addScene} disabled={!galaxy.nebula.on}>
        <PlusIcon size="20" class="me-2"/>
        scene
    </Button>
</div>

<style lang="scss">
  @import "src/styles/utils";

  .hue-selector {
    :global(.slider .rail) {
      background: #{$hue-range} !important;
      background: -moz-#{$hue-range} !important;
      background: -webkit-#{$hue-range} !important;
    }

    :global(.slider .rail-disabled) {
      opacity: .33 !important;
    }

    :global(.slider .range-selection) {
      background: none !important;
    }
  }

  .scenes {
    :global(nav.breadcrumbs) {
      flex-wrap: wrap;
      row-gap: 10px;
    }
  }

</style>
