<script lang="ts">
    import {onMount} from "svelte";
    import {hsv2css} from "../colorcalc";

    export let galaxy: Galaxy
    export let hsv: HSV

    let starPattern: [number, number][] = []
    let starRotationDeg: number = 0
    let nebulaRotationDeg: number = 0

    onMount(() => {
        for (let i = 0; i < 150; i++) {
            starPattern.push([Math.random() * 100, Math.random() * 100])
        }
        starPattern = starPattern

        setInterval(() => {
            if (galaxy) {
                if (galaxy.stars.on) {
                    starRotationDeg += .05 + galaxy.stars.speed / 1000
                    starRotationDeg %= 360
                }
                if (galaxy.nebula.on) {
                    nebulaRotationDeg += .05
                    nebulaRotationDeg %= 360
                }
            }
        }, 10)
    })

    $: hslFill = hsv ? `fill: ${hsv2css(hsv)}` : ''

</script>
<div class="outer">
    <svg viewBox="0 0 100 100" class="preview ambient"
         xmlns="http://www.w3.org/2000/svg">
        <circle cx=50 cy=50 r="50" fill="#333"/>
    </svg>
    {#if galaxy.nebula.on}
        <svg viewBox="0 0 200 200" class="preview"
             style="transform: rotate({nebulaRotationDeg}deg); {hslFill};"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="displacementFilter">
                    <feTurbulence type="turbulence" baseFrequency="0.09"
                                  numOctaves="3" result="turbulence"/>
                    <feDisplacementMap in2="turbulence" in="SourceGraphic"
                                       scale="60" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
            </defs>

            <circle cx="90" cy="90" r="70"
                    style="filter: url(#displacementFilter)"/>
        </svg>
    {/if}
    {#if galaxy.stars.on}
        <svg viewBox="0 0 100 100" class="preview"
             style="transform: rotate({starRotationDeg}deg); opacity: {15+galaxy.stars.brightness*0.85}%"
             xmlns="http://www.w3.org/2000/svg">
            {#each starPattern as star}
                <circle cx={star[0]} cy={star[1]} r="1" fill="#2299FF"/>
            {/each}
        </svg>
    {/if}
</div>

<style lang="scss">
  @import "src/styles/utils";

  .outer {
    height: 10rem;
    width: 10rem;
  }

  svg.preview {
    border-radius: 50%;
    height: 10rem;
    width: 10rem;
    position: absolute;
  }

  .ambient {
    background: black;
    box-shadow: -5px 0 20px #000, /* outer left */
    5px 0 20px #000; /* outer right */
  }
</style>
