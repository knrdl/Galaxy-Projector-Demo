<script lang="ts">
    import {
        Button, Dialog,
        Divider,
        Modal,
        TextField
    } from "attractions";
    import {
        CheckCircleIcon,
        CopyIcon, EditIcon,
        XIcon, CheckIcon
    } from "svelte-feather-icons";
    import {createEventDispatcher} from "svelte";

    export let open: boolean = false
    export let galaxies: Galaxy[]
    export let selectedGalaxyName: string
    export let currentState: ProjectorState

    let title: string = ''
    let mode: 'choose' | 'new' | 'update' = 'choose'
    const dispatch = createEventDispatcher()

    $: if (selectedGalaxyName) title = selectedGalaxyName

    let isNameTaken: boolean
    $: isNameTaken = galaxies?.some(gal => gal.name === title)

    function createNewGalaxy() {
        galaxies = [...galaxies, {stars: currentState.stars, nebula: currentState.nebula, name: title, selected: true}]
        dispatch('update', galaxies)
    }

    function updateSelectedGalaxy() {
        const selectedGalaxy = galaxies.find(g => g.name === selectedGalaxyName)
        if (selectedGalaxy) {
            selectedGalaxy.nebula = currentState.nebula
            selectedGalaxy.stars = currentState.stars
            selectedGalaxy.selected = true
            selectedGalaxy.name = title
            dispatch('update', galaxies)
        } else {
            createNewGalaxy()
        }
    }

    function leave() {
        dispatch('leave')
        title = ''
        mode = 'choose'
    }
</script>

<Modal bind:open={open} noClickaway={true} let:closeCallback>
    <Dialog title="Save Changes?" {closeCallback}>
        <Divider/>
        <div class="flex column center">
            <Button style="color: #2cff2c" on:click={()=>mode = 'update'} disabled={mode !== 'choose'}
                    filled={mode === 'update'}>
                <CheckCircleIcon size="20" class="me-2"/>
                Update Galaxy
            </Button>
            {#if mode === 'update'}
                <TextField bind:value={title} outline label="Galaxy Title" withItem>
                    <EditIcon size="24" class="item"/>
                </TextField>
                <div class="flex center">
                    <Button on:click={()=>{updateSelectedGalaxy();leave();closeCallback()}} disabled={!title}>
                        <CheckIcon size="20" class="me-2"/>
                        Ok
                    </Button>
                    <Button danger on:click={()=>mode = 'choose'}>
                        <XIcon size="20" class="me-2"/>
                        Cancel
                    </Button>
                </div>
                <Divider/>
            {/if}

            <Button on:click={()=>mode = 'new'} disabled={mode !== 'choose'} filled={mode === 'new'}>
                <CopyIcon size="20" class="me-2"/>
                New Galaxy
            </Button>
            {#if mode === 'new'}
                <TextField bind:value={title} outline label="Galaxy Title" withItem>
                    <EditIcon size="24" class="item"/>
                </TextField>
                <div class="flex center">
                    <Button on:click={()=>{createNewGalaxy();leave();closeCallback()}} disabled={!title || isNameTaken}>
                        <CheckIcon size="20" class="me-2"/>
                        Ok
                    </Button>
                    <Button danger on:click={()=>mode = 'choose'}>
                        <XIcon size="20" class="me-2"/>
                        Cancel
                    </Button>
                </div>
                <Divider/>
            {/if}

            <Button danger on:click={()=>{leave();closeCallback()}} disabled={mode !== 'choose'}>
                <XIcon size="20" class="me-2"/>
                Discard Changes
            </Button>
        </div>
    </Dialog>
</Modal>

<style lang="scss">
  @import "src/styles/utils";
</style>
