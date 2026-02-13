<template>
    <div class="ba-container" ref="container" @mousedown="startDrag" @touchstart="startDrag">
        <img :src="before" class="ba-img" />

        <div class="ba-overlay" :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }">
            <img :src="after" class="ba-img" />
        </div>

        <div
    class="ba-divider"
    :style="{ left: sliderPosition + '%' }"
>
    <div class="ba-handle d-flex align-items-center justify-content-center">
        <span class="material-icons">compare_arrows</span>
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
.ba-container {
    position: relative;
    width: 100%;
    max-width: 700px;
    cursor: ew-resize;
    overflow: hidden;
    border-radius: 12px;
}

.ba-img {
    width: 100%;
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
    width: 8px;
    background: linear-gradient(180deg,
            #00CCCC,
            #05c2c2);
    transform: translateX(-4px);

    display: flex;
    align-items: center;
    justify-content: center;

    box-shadow:
        0 0 12px rgba(0, 0, 0, 0.45),
        0 0 24px #686868;

    border-radius: 4px;
}

.ba-handle {
    width: 60px;
    height: 60px;
    background: white;
    border-radius: 50%;
    cursor: ew-resize;

    border: 4px solid #00CCCC;

    box-shadow:
        0 6px 16px rgba(0, 0, 0, 0.35),
        0 0 18px #707070;

    transition: transform 0.15s ease,
        box-shadow 0.15s ease;
}

.material-icons {
    font-size: 28px;
    color: #00CCCC;
}

.ba-handle:hover {
    transform: scale(1.1);
    box-shadow:
        0 8px 22px rgba(0, 0, 0, 0.45),
        0 0 28px #00CCCC;
}
</style>
