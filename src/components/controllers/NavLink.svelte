<script>
    import { Link } from "svelte-routing";

    export let to = "";
    export let baseClass = "";

    function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
        const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

        // The object returned here is spread on the anchor element's attributes
        if (isActive) {
            return { class: baseClass + " active" };
        }
        return { class: baseClass };
    }
</script>

<style>

</style>

<Link to="{to}" getProps="{getProps}">
    <slot/>
</Link>