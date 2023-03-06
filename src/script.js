import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { TextGeometry  } from 'three/examples/jsm/geometries/TextGeometry.js'
/**
 * Base 
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()



/**
 * Fonts
 */
const fontLoader = new FontLoader()
//differs from texture loader in that fontLoader uses a callback function to execute creation of geometry and material for the mesh
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Tim\'s Portfolio',
            {
                font: font,
                size: 0.4,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        /***
         * Load texture
         */
        const texture = new THREE.TextureLoader().load(
            '/textures/matcaps/3.png'
        )
        console.log(texture)
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: texture})
        //textMaterial.matcap(texture)
        //const textTexture = new THREE.TextureLoader().load('/textures/matcaps/1.png')
        //const textMaterial = new THREE.MeshBasicMaterial({ color : 'red' })
        
        const text = new THREE.Mesh(textGeometry, textMaterial)
        //    console.log(textMaterial)
        //textGeometry.center()
         textGeometry.computeBoundingBox()
         //textGeometry.boundingBox
        textGeometry.translate(
            -(textGeometry.boundingBox.max.x )* 0.5,
            -(textGeometry.boundingBox.max.y )* 0.5,
            -(textGeometry.boundingBox.max.z )* 0.5
        )
        textGeometry.center()
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)
        

        scene.add(text)
        
    }
)

//loading sphere
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/4-ghibli/px.png',
    '/textures/4-ghibli/nx.png',
    '/textures/4-ghibli/py.png',
    '/textures/4-ghibli/ny.png',
    '/textures/4-ghibli/pz.png',
    '/textures/4-ghibli/nz.png'
])

material.envMap = environmentMapTexture


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
//torus.position.x -= 1.5
sphere.position.y = 1
scene.add(sphere)
//scene.add(cube)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //text.rotation.y = elapsedTime
    //sphere.rotation.y = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()