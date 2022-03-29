<script lang="ts">
    import {Button, Loading} from "attractions";
    import {ChevronRightIcon, MenuIcon, Trash2Icon} from "svelte-feather-icons";
    import {createEventDispatcher} from "svelte";
    import {flip} from 'svelte/animate';
    import {slide, blur, fly, fade} from 'svelte/transition'

    export let galaxies: Galaxy[]

    const dispatch = createEventDispatcher()

    let hoveringIdx: number = null
    let hoveringDelete: boolean = false

    function dragStart(event: DragEvent, idx: number) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.setData('text/plain', idx + '')
    }

    function dropMove(event: DragEvent, target: number) {
        event.dataTransfer.dropEffect = 'move'
        const start = parseInt(event.dataTransfer.getData("text/plain"))
        if (start < target) {
            galaxies.splice(target + 1, 0, galaxies[start])
            galaxies.splice(start, 1)
        } else {
            galaxies.splice(target, 0, galaxies[start])
            galaxies.splice(start + 1, 1)
        }
        dispatch('update', galaxies)
        hoveringIdx = null
        return false
    }

    function dropDelete(event: DragEvent) {
        event.dataTransfer.dropEffect = 'move'
        const idx = parseInt(event.dataTransfer.getData("text/plain"))
        galaxies.splice(idx, 1)
        dispatch('update', galaxies)
        hoveringDelete = false
        hoveringIdx = null
    }

</script>

{#if galaxies === null}
    <div class="flex center mt-5 mb-3 big-loading-dots">
        <Loading/>
    </div>
{:else}
    <div class="flex column">
        {#each galaxies as galaxy, idx (galaxy.name)}
            <div class="flex"
                 draggable={true}
                 animate:flip
                 on:dragstart={ev => dragStart(ev, idx)}
                 on:dragover|preventDefault={()=>false}
                 on:dragenter={() => hoveringIdx = idx}
                 on:drop|preventDefault={ev => dropMove(ev, idx)}
            >
                <Button class="galaxy my-1 flex py-0" rectangle filled style="flex:1"
                        on:click={()=>dispatch('select', galaxy)}>
                    <div class="flex content-between flex-1">
                        <div class="flex center">
                            {galaxy.name}
                            <ChevronRightIcon size="20"/>
                        </div>
                        <div class="py-3 pe-1 ps-3">
                            <MenuIcon size="20"/>
                        </div>
                    </div>
                </Button>
            </div>
        {/each}
        {#if hoveringIdx !== null}
            <div class="file-dropzone" class:galaxy-reverse={hoveringDelete} out:fade
                 on:dragenter={() => hoveringDelete = true}
                 on:dragleave={() => hoveringDelete = false}
                 on:dragover|preventDefault={() => false}
                 on:drop|preventDefault={dropDelete}
            >
                <div class="empty-layer">
                    <Trash2Icon size="24" class="me-2"/>
                    <div class="title svelte-11soqw8">delete galaxy</div>
                </div>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
  @import "src/styles/utils";
  @import "attractions/file-input/file-dropzone"; // delete zone

  .file-dropzone * {
    pointer-events: none !important;
    user-select: none;
  }

  .empty-layer {
    padding: 1rem !important;
  }

  .big-loading-dots :global(.spinner > div) {
    width: 2rem !important;
    height: 2rem !important;
  }
</style>
