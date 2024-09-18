/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 * 
 * Prof. Dan Keefe (dfk@umn.edu)
*/

import * as gfx from 'gophergfx'

export class ExampleApp extends gfx.GfxApp
{   
    private simulationTime = 0;
    private bird = new gfx.Mesh3();
    private birdRadius = 2;
    private targetSize = new gfx.Vector3(3, 12, 20);
    private target1Pos = new gfx.Vector3(21, 6, -35);
    private target2Pos = new gfx.Vector3(25, 6, -35);
    private target3Pos = new gfx.Vector3(23, 18, -35);


    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();
    }


    // --- Initialize the graphics scene ---
    createScene(): void
    {
        this.renderer.background = new gfx.Color(0.2, 0.6, 1.0);

        // Setup a camera
        this.camera.setPerspectiveCamera(60, 4/3, 0.01, 100.0);
        this.camera.position = new gfx.Vector3(0, 8, 20);
        this.camera.lookAt(new gfx.Vector3(0, 8, 0), gfx.Vector3.UP);

        // Create some lights
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);
        const pointLight = new gfx.PointLight(new gfx.Color(0.6, 0.6, 0.6));
        this.scene.add(pointLight);
        pointLight.position = new gfx.Vector3(10, 10, 10);

        // show xyz axes lines at the origin (can be useful for debugging)
        const axes = gfx.Geometry3Factory.createAxes(1);
        this.scene.add(axes);

        // ground
        const ground = gfx.Geometry3Factory.createBox(160, 20, 70);
        this.scene.add(ground);
        ground.position = new gfx.Vector3(0, -10, -35);
        const groundMaterial = new gfx.PhongMaterial();
        groundMaterial.setColor(new gfx.Color(0.3, 0.9, 0.4));
        ground.material = groundMaterial;

        // 3 targets
        const target1 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target1);
        target1.position = this.target1Pos;
        const targetMaterial = new gfx.PhongMaterial();
        targetMaterial.setColor(new gfx.Color(0.6, 0.4, 0.2));
        target1.material = targetMaterial;

        const target2 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target2);
        target2.position = this.target2Pos;
        target2.material = targetMaterial;

        const target3 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target3);
        target3.position = this.target3Pos;
        target3.material = targetMaterial;

        // launcher
        const launcher = gfx.Geometry3Factory.createCylinder(50, 1, 7);
        this.scene.add(launcher);
        launcher.position = new gfx.Vector3(-30, 1.5, -35);
        const launcherMaterial = new gfx.PhongMaterial();
        launcherMaterial.setColor(new gfx.Color(0, 0, 0));
        launcher.material = launcherMaterial;

        // bird
        this.bird = gfx.Geometry3Factory.createSphere(this.birdRadius);
        const birdMaterial = new gfx.PhongMaterial();
        birdMaterial.setColor(gfx.Color.RED);
        this.bird.material = birdMaterial;
        this.scene.add(this.bird);

        this.reset();
    }


    // Imagine this function and the calcBirdVel function below are some super-complex
    // functions that we need to debug.  In fact, this function is intentionally written
    // in a very strange way to make it difficult to follow. :)  How do we know if it is
    // working?  Printing out the pos and velocity can help a little, but those numbers
    // will change quickly each frame and are hard to interpret.  How else can we debug 3D 
    // graphics routines like these?
    calcBirdPos(t: number): gfx.Vector3 {
        const e = t / 4.0;
        const x = e * 52.0 - 30.0;
        const y = 30.0 * (-e * e + 1.2 * e) + 5.0;
        const z = -35.0;
        return new gfx.Vector3(x, y, z);
    }

    calcBirdVel(t: number): gfx.Vector3 {
        return gfx.Vector3.subtract(this.calcBirdPos(t + 0.5), this.calcBirdPos(t - 0.5));
    }


    reset(): void
    {
        this.simulationTime = 0;
    }


    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        this.simulationTime += deltaTime;

        this.bird.position = this.calcBirdPos(this.simulationTime);

        if (this.bird.position.y < 0) {
            this.reset();
        }
    }

}
