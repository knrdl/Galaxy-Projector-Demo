<script lang="ts">
    import {PowerIcon} from "svelte-feather-icons";
    import {Button, Loading} from "attractions";

    export let on: boolean = null
    let lastVal: boolean = null

    let loading: boolean = false

    function toggle() {
        loading = true
        setTimeout(() => {
            if (loading) {
                on = !on
                loading = false
            }
        }, 333)
    }

    $: if (on !== lastVal) {
        loading = false
        lastVal = on
    }
</script>

<div class="power-btn">
    <Button round neutral={!on} filled={on} outline on:click={toggle} class="galaxy" disabled={loading}>
        {#if loading}
            <Loading class="loading"/>
        {:else}
            <PowerIcon size="20"/>
        {/if}
    </Button>
</div>

<style lang="scss">
  @import "src/styles/utils";

  .power-btn {
    :global(.loading) {
      width: 20px !important;
      height: 20px !important;
    }
  }
</style>
