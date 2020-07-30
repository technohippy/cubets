export class CameraControl {
    setCamera(camera) {
        this.camera = camera;
        if (!this.container) {
            this.container = this.camera.renderer.container;
        }
        this.attachEvents();
    }
    _clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
}
