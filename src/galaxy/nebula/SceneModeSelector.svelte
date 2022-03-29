<script lang="ts">
    import {Button, Dropdown, DropdownShell} from "attractions";
    import {ActivityIcon, ChevronDownIcon, HeartIcon} from "svelte-feather-icons";

    export let mode: SceneMode
    export let disabled: boolean = false

    const FlashIcon = ActivityIcon
    const BreathIcon = HeartIcon
</script>

<DropdownShell let:toggle class="ms-1">
    <Button on:click={toggle} {disabled}>
        {#if mode === 'flash'}
            <FlashIcon class="me-1" size="20"/>
        {/if}
        {#if mode === 'breath'}
            <BreathIcon class="me-1" size="20"/>
        {/if}
        {mode}
        <ChevronDownIcon size="24" class="ms-2 dropdown-chevron"/>
    </Button>
    <Dropdown>
        <Button style="width: 100%" on:click={()=>{mode = 'flash';toggle()}}>
            <FlashIcon class="me-1" size="20"/>
            flash
        </Button>
        <Button style="width: 100%" on:click={()=>{mode = 'breath';toggle()}}>
            <BreathIcon class="me-1" size="20"/>
            breath
        </Button>
    </Dropdown>
</DropdownShell>

<style lang="scss">
  @import "src/styles/utils";
</style>
