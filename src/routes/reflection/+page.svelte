<script>
    import MirrorApp from '$reflectionApp/MirrorApp.svelte';
    import ControllerView from '$reflectionApp/ControllerView/ControllerView.svelte';
</script>

<style lang="scss">
    section.reflection-page {
        padding: 50px 0;
    
        .reflection-app {
            margin: 0 auto;
            width: 1200px;

            h1{
                margin: 0;
            }
            ul.intro { 
                padding: 0; 
                margin: 0; 
                li{
                    list-style: none;
                }
            }

            ol li{
                padding: 5px 0;
                margin: 0;
            }
           
            .interactioon-container{
                margin-top: 50px;
                display: flex;
                gap: 10px;
            }            
        }
    }
</style>

<section class="reflection-page">

    <div class="reflection-app">

        <h1>Reflection</h1>
        <p>An interactive sandbox that illustrates a few principle concepts of how reflections work.</p>
        
        <ul class="intro">
            <li><strong>Left box</strong> - Features a front-facing mirror simulation of a room where users can view the "subject" with reflections on one, two, or three mirrors.</li>
            <li><strong>Right box</strong> - Presents a top-down view controller that allows users to manipulate the elements and explore concepts related to the subject (cube).</li>
        </ul>

        <h2>Concepts</h2>
        <ol>
            <li>
                <strong>Equal Angles</strong> - "When a ray of light encounters a surface, the angles that the incoming and outgoing light make with the surface are equal."
                <ul>
                    <li>To simulate a ray bouncing off a surface, drag the circle around the subject (square)</li>
                    <li>Note: Limited to single bounce for this concept</li>
                </ul>
            </li>

            <li>
                <strong>Single Mirror</strong> - This concept involves a single mirror virtual room that reflects position and distance from a straight view.
                <ul>
                    <li>Users can toggle the back mirror in the room by clicking on the gray bar to simulate the concept</li>
                    <li>They can also drag and move the square subject around to view the mirrored subject position and distance in the virtual room</li>
                </ul>
            </li>

            <li>
                <strong>Parallel Mirror (Constrained infinite reflections)</strong> -  This concept features a virtual room with an added second mirror that simulates parallel reflection.   
                <ul>
                    <li>Users can toggle the left and right mirrors in the room by clicking on the gray bar to simulate this concept</li>
                </ul>
            </li>

            <li>
                <strong>Three Mirrors</strong> - This concept involves a virtual room that simulates the impact of a third mirror in adding more virtual rooms. 
                <ul>
                    <li>Users can toggle all three (back, left, and right) mirrors in the room by clicking on the gray bars to simulate this concept</li>
                </ul>
            </li>
        </ol>

        <div class="interactioon-container">
            <MirrorApp />
            <ControllerView />
        </div>
        
    </div>

</section>