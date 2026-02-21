<template>
    <div class="liquid-bg">
        <div class="blobs">
            <div class="liquid"></div>
            <div v-for="n in 8" :key="n" class="blob"></div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="0">
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  
          0 1 0 0 0  
          0 0 1 0 0  
          0 0 0 18 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </defs>
        </svg>
    </div>
</template>

<script>
export default {
    name: "LiquidBackground"
};
</script>

<style lang="scss" scoped>
$blob-count: 8;

.liquid-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

.blobs {
    width: 100%;
    height: 100%;
    filter: url('#goo');
    position: relative;

    .liquid {
        position: absolute;
        top: -2%;
        left: -10%;
        width: 120%;
        height: 10px;
        background: rgba(248, 248, 248, 0.6);
        border-radius: 10%;
        animation: liquid 3s forwards;
    }

    .blob {
        position: absolute;
        top: 0;
        width: 30px;
        height: 30px;
        margin: 0;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: drip_one 3s forwards;

        @for $i from 1 through $blob-count {
            &:nth-child(#{$i + 1}) {
                left: ((($i)-2)*13)-1%;
            }
        }

        &:nth-of-type(4n-7) {
            width: 65px;
            animation: drip_four 3s forwards;
        }

        &:nth-of-type(3n-2) {
            width: 26px;
        }

        &:nth-of-type(2) {
            width: 22px;
        }

        &:nth-of-type(8) {
            animation: drip_five 3s forwards;
        }

        &:nth-of-type(4n+2) {
            height: 56px;
            animation: drip_two 3s forwards;
        }

        &:nth-of-type(6n-2) {
            height: 42px;
            animation: drip_three 3s forwards;
        }
    }
}

@keyframes drip_one {
    from {
        top: 0;
        background: rgba(108, 210, 255, 0.6);
    }

    to {
        top: 103%;
        background: #1eddff59;
    }
}

@keyframes drip_two {
    from {
        top: 0;
        background: rgba(108, 210, 255, 0.6);
    }

    to {
        top: 104%;
        background: #fff;
    }
}

@keyframes drip_three {
    from {
        top: 0;
        height: 52px;
        background: rgba(108, 210, 255, 0.6);
    }

    to {
        top: 102%;
        height: 132px;
        background: #fff;
    }
}

@keyframes drip_four {
    from {
        top: 0;
        width: 65px;
        height: 30px;
        background: rgba(108, 210, 255, 0.6);
    }

    to {
        top: 102%;
        width: 75px;
        height: 45px;
        background: #fff;
    }
}

@keyframes drip_five {
    from {
        top: 0;
        height: 30px;
        background: rgba(108, 210, 255, 0.6);
    }

    to {
        top: 102%;
        height: 72px;
        background: #fff;
    }
}

@keyframes liquid {
    from {
        height: 15px;
        background: rgba(255, 255, 255, 0.6);
    }

    to {
        height: 109%;
        background: #fff;
    }
}

[data-theme="dark"] {

    .liquid,
    .blob {
        background: rgba(82, 177, 85, 0.35);
    }
}
</style>