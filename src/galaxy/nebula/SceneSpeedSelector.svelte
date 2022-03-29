<script lang="ts">
    import {Button, Dropdown, DropdownShell} from "attractions";
    import {ChevronDownIcon, LoaderIcon} from "svelte-feather-icons";

    export let disabled: boolean = false
    export let speed: number

    const speeds = ['slowest', 'slower', 'slow', 'fast', 'faster', 'fastest']

    function setSpeed(idx: number) {
        speed = idx * 20
    }

    let speedtext: string
    $: speedtext = speeds[Math.min(speed / 20)]

    $: if (speed % 20 !== 0) {
        speed = Math.round(speed / 20) * 20
    }

</script>

<DropdownShell let:toggle class="me-1">
    <Button on:click={toggle} {disabled}>
        <LoaderIcon class="me-1" size="20"/>
        {speedtext}
        <ChevronDownIcon size="24" class="ms-2 dropdown-chevron"/>
    </Button>
    <Dropdown class="flex center column">
        {#each speeds as speed, idx}
            <Button small on:click={()=>{setSpeed(idx);toggle()}}>
                <div class="flex center" style="flex: 1">
                    {speed}
                </div>
            </Button>
        {/each}
    </Dropdown>
</DropdownShell>

<style lang="scss">
  @import "src/styles/utils";
</style>
