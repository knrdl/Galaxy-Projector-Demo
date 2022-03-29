<script lang="ts">
    import {Label, Slider, Switch} from "attractions";

    export let galaxy: Galaxy
</script>

<div class="flex center my-2">
    <Switch bind:value={galaxy.stars.on}>
        <Label small class="ms-2">show</Label>
    </Switch>
</div>
<div class="my-2">
    <Label>Brightness</Label>
    <Slider bind:value={galaxy.stars.brightness} min={0} max={100} disabled={!galaxy.stars.on} tooltips="active">
        <span slot="tooltip-content" let:value={value}>
            {value} %
        </span>
    </Slider>
</div>
<div class="my-2">
    <Label>Speed</Label>
    <Slider bind:value={galaxy.stars.speed} min={0} max={100} disabled={!galaxy.stars.on} tooltips="active">
        <span slot="tooltip-content" let:value={value}>
            {value} %
        </span>
    </Slider>
</div>

<style lang="scss">
  @import "src/styles/utils";
</style>
