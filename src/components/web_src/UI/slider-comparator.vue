<template>
    <div class="ba-wrapper">
        <div class="ba-container" ref="container" @mousedown="startDrag" @touchstart="startDrag">
            <img :src="before" class="ba-img" />

            <div class="ba-overlay" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
                <img :src="after" class="ba-img" />
            </div>

            <div class="ba-divider" :style="{ left: sliderPosition + '%' }">
                <div class="ba-handle d-flex align-items-center justify-content-center">
                    <div class="ba-dot"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BeforeAfterSlider",

    props: {
        before: String,
        after: String
    },

    data() {
        return {
            sliderPosition: 50,
            dragging: false
        };
    },

    methods: {
        startDrag(e) {
            this.dragging = true;
            window.addEventListener("mousemove", this.onDrag);
            window.addEventListener("touchmove", this.onDrag);
            window.addEventListener("mouseup", this.stopDrag);
            window.addEventListener("touchend", this.stopDrag);
            this.onDrag(e);
        },

        onDrag(e) {
            if (!this.dragging) return;

            const rect = this.$refs.container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;

            let percent = ((clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));

            this.sliderPosition = percent;
        },

        stopDrag() {
            this.dragging = false;
            window.removeEventListener("mousemove", this.onDrag);
            window.removeEventListener("touchmove", this.onDrag);
            window.removeEventListener("mouseup", this.stopDrag);
            window.removeEventListener("touchend", this.stopDrag);
        }
    }
};
</script>

<style scoped>
.ba-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
}

.ba-container {
    position: relative;
    width: 100%;
    max-width: 700px;
    cursor: ew-resize;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f5f5f5;
}

.ba-img {
    width: 100%;
    height: auto;
    display: block;
    user-select: none;
    pointer-events: none;
}

.ba-overlay {
    position: absolute;
    inset: 0;
}

.ba-divider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6px;
    background: #888;
    transform: translateX(-3px);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    box-shadow: 0 0 4px rgba(0,0,0,0.3);
}

.ba-handle {
    width: 36px;
    height: 36px;
    background: transparent;
    border-radius: 50%;
    cursor: ew-resize;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ba-dot {
    width: 16px;
    height: 16px;
    background: #555;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

.ba-handle:hover .ba-dot {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
</style>