<template>
    <transition name="fade">
        <div v-if="state.isVisible" class="loader-overlay">
            <div class="loader-content">
                <div class="car-container">
                    <div class="droplets">
                        <div v-for="i in 6" :key="i" class="drop"></div>
                    </div>
                    
                    <div class="water-waves"></div>
                    <span class="material-icons car-icon">directions_car</span>
                </div>

                <div class="progress-wrapper">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p class="loader-text">
                        {{ state.message }}<span class="loading-dots"></span>
                    </p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { loaderState as state } from '@/loaderState';
</script>

<style scoped>
.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(10, 15, 28, 0.9);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
}

.car-container {
    position: relative;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px; 
}

.car-icon {
    font-size: 80px;
    color: #a3e635;
    animation: car-bounce 0.8s infinite alternate ease-in-out;
    z-index: 2;
}

.water-waves {
    position: absolute;
    bottom: 0;
    width: 100px;
    height: 15px;
    background: rgba(163, 230, 53, 0.2);
    border-radius: 50%;
    animation: water-pulse 0.8s infinite alternate ease-in-out;
    filter: blur(4px);
}

.droplets {
    position: absolute;
    top: 0;
    width: 80px;
    height: 50px;
    display: flex;
    justify-content: space-around;
    z-index: 3;
}

.drop {
    width: 3px;
    height: 13px;
    background: #a3e635;
    border-radius: 50%;
    opacity: 0;
    animation: drop-fall-on-car 0.6s infinite linear;
}

.drop:nth-child(1) { animation-delay: 0.1s; }
.drop:nth-child(2) { animation-delay: 0.4s; }
.drop:nth-child(3) { animation-delay: 0.2s; }
.drop:nth-child(4) { animation-delay: 0.5s; }
.drop:nth-child(5) { animation-delay: 0.3s; }
.drop:nth-child(6) { animation-delay: 0.6s; }

.progress-wrapper {
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
}

.progress-fill {
    height: 100%;
    width: 40%;
    background: #a3e635;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(163, 230, 53, 0.5);
    animation: progress-indeterminado 1.8s infinite ease-in-out;
}

.loader-text {
    color: #a3e635;
    font-weight: bold;
    text-align: center;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 0.8rem;
    text-shadow: 0 0 8px rgba(163, 230, 53, 0.3);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-dots::after {
    content: '...';
    display: inline-block;
    width: 20px;
    text-align: left;
    animation: dots 1.5s steps(4, end) infinite;
}


@keyframes progress-indeterminado {
    0% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(50%);
    }
    100% {
        transform: translateX(250%);
    }
}

@keyframes car-bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
}

@keyframes dots {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
}

@keyframes water-pulse {
    from { transform: scaleX(0.8); opacity: 0.4; }
    to { transform: scaleX(1.2); opacity: 0.1; }
}

@keyframes drop-fall-on-car {
    0% { transform: translateY(0) scaleY(1); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translateY(60px) scaleY(0.5); opacity: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>