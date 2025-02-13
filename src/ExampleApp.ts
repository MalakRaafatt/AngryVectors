/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import {Arrow} from './Arrow'

export class ExampleApp extends gfx.GfxApp
{   
    private simulationTime = 0;
    private arrow = new Arrow();
    private bird = new gfx.Mesh3();
    private birdRadius = 2;
    private birdVelocity = new gfx.Vector3(0,0,0);
    private targetSize = new gfx.Vector3(3, 12, 20);
    private targets: gfx.Mesh3[] = [];
    private target1Pos = new gfx.Vector3(21, 6, -35);
    private target2Pos = new gfx.Vector3(25, 6, -35);
    private target3Pos = new gfx.Vector3(23, 18, -35);
    private initialBirdPos = new gfx.Vector3(-30, 5, -35);
    private running = false;
    private obstacle = new gfx.Mesh3();
    private obstacleRadius = 5;

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
        target1.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target1);

        const target2 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target2);
        target2.position = this.target2Pos;
        target2.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target2);

        const target3 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target3);
        target3.position = this.target3Pos;
        target3.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target3);

        // launcher
        const launcher = gfx.Geometry3Factory.createCylinder(50, 1, 7);
        this.scene.add(launcher);
        launcher.position = new gfx.Vector3(-30, 1.5, -35);
        launcher.material.setColor(new gfx.Color(0, 0, 0));

        // bird
        this.bird = gfx.Geometry3Factory.createSphere(this.birdRadius);
        this.bird.material.setColor(gfx.Color.RED);
        this.bird.position = this.initialBirdPos.clone();
        this.scene.add(this.bird);

        // obstacle
        this.obstacle = gfx.Geometry3Factory.createSphere(this.obstacleRadius);
        this.obstacle.material.setColor(gfx.Color.GREEN);
        this.obstacle.position = new gfx.Vector3(10, 6, -35);
        this.scene.add(this.obstacle);

        // arrow
        this.arrow = new Arrow(gfx.Color.YELLOW);
        this.scene.add(this.arrow);

        this.reset();
    }

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        this.simulationTime += deltaTime;

        const prevObstaclePos = this.obstacle.position.clone();
        this.obstacle.position.y = 15;
        //this.obstacle.position.y = Math.sin(this.simulationTime)*10 + 15;
        const obstacleVelocity = gfx.Vector3.subtract(this.obstacle.position, prevObstaclePos);
        obstacleVelocity.multiplyScalar(1.0/deltaTime);

        if (this.running) {

            // TODO: Update bird velocity (vel = vel + acceleration*dt)

            // TODO: Update bird position (pos = pos + vel*dt)

            // TODO: Bounce on the ground

            // TODO: Reset if the velocity is zero
            if (this.bird.position.y < 0 || this.bird.position.x > 50) {
                this.reset();
            }
        }

        this.arrow.position = this.bird.position;
        this.arrow.vector = this.birdVelocity;

        this.handleSphereCollision(this.bird.position, this.birdRadius, this.birdVelocity, this.obstacle.position, this.obstacleRadius, obstacleVelocity)

        this.targets.forEach((target) => {
            if (target.visible && this.sphereIntersectsBox(this.bird.position, this.birdRadius, target.position, this.targetSize)) {
                target.visible = false;
                // TODO: bounce off of the targets
            }
        });
    }

    handleSphereCollision(posA: gfx.Vector3, radiusA: number, velA: gfx.Vector3, posB: gfx.Vector3, radiusB : number, velB: gfx.Vector3) {
        // TODO: calculate the normal and distance between spheres

        // TODO: if the distance is less than the radius of two spheres, reflect on the normal
    }

    sphereIntersectsBox(spherePos: gfx.Vector3, sphereRad: number, boxPos: gfx.Vector3, boxSize: gfx.Vector3): boolean
    {
        const xMin = boxPos.x - boxSize.x/2;
        const xMax = boxPos.x + boxSize.x/2;
        const yMin = boxPos.y - boxSize.y/2;
        const yMax = boxPos.y + boxSize.y/2;
        const zMin = boxPos.z - boxSize.z/2;
        const zMax = boxPos.z + boxSize.z/2;

        if (((spherePos.x + sphereRad >= xMin) && (spherePos.x - sphereRad <= xMax)) && 
            ((spherePos.y + sphereRad >= yMin) && (spherePos.y - sphereRad <= yMax)) &&
            ((spherePos.z + sphereRad >= zMin) && (spherePos.z - sphereRad <= zMax))) {
            return true;
        } else {
            return false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.running) {
            const mousePosition = this.getNormalizedDeviceCoordinates(event.x, event.y);
            this.birdVelocity = gfx.Vector3.subtract(new gfx.Vector3(30*mousePosition.x-5, 30*mousePosition.y+5, -35),this.arrow.position) 
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.running) {
            this.running = true;
        }
    }

    reset(): void
    {
        this.running = false;
        this.birdVelocity = new gfx.Vector3(0,0,0);
        this.bird.position = this.initialBirdPos.clone();
        this.simulationTime = 0;
        this.targets.forEach((target) => {
            target.visible = true;
        });
    }

    onKeyDown(event: KeyboardEvent): void {
        this.reset();
    }
}
