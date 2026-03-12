<!--
SI VAN A UTILIZAR ESTE COMP

- Precio normal:
:amount="49.99"

- Precio con descuento (muestra precio antiguo y % descuento):
:amount="29.99" :oldAmount="49.99"

- Tamaño (sm o md o lg):
size="lg"

- Moneda:
:locale= "es | en" :currency= "EUR | USD"
-->

<template>
    <div class="price-wrapper">
        <span :class="currentPriceClass">
            {{ formatCurrency(amount) }}
        </span>

        <span v-if="oldAmount" class="price-old">
            {{ formatCurrency(oldAmount) }}
        </span>

        <span v-if="discountPercentage" class="price-discount">
            -{{ discountPercentage }}%
        </span>
    </div>
</template>

<script>
export default {

    //La moneda dependerá de la elecion del usuario desde la configuracion de usuario osea que vendra desde el backend
    name: "BasePrice",

    props: {
        amount: { type: [String, Number], required: true },
        oldAmount: { type: [String, Number], default: null },
        size: { type: String, default: "md" },
        locale: { type: String, default: "es" },
        currency: { type: String, default: "EUR" }
    },

    computed: {
        discountPercentage() {
            if (!this.oldAmount) return null;
            return Math.round(((this.oldAmount - this.amount) / this.oldAmount) * 100);
        },

        currentPriceClass() {
            return [
                "price-current",
                `price-current--${this.size}`,
                { "price-current--offer": this.oldAmount }
            ];
        }
    },

    methods: {
        formatCurrency(value) {
            if (value == null || isNaN(value)) return "";

            let formatted = Number(value).toFixed(2);

            const symbols = {
                EUR: "€",
                USD: "$"
            };
            const symbol = symbols[this.currency] || this.currency;

            if (this.locale === "es") {
                formatted = formatted.replace(".", ",");
                return formatted + " " + symbol;
            } else {
                return symbol + formatted;
            }
        }
    }
};
</script>

<style scoped>
.price-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-current {
    font-weight: 600;
}

.price-current--sm {
    font-size: 0.9rem;
}

.price-current--md {
    font-size: 1.2rem;
}

.price-current--lg {
    font-size: 1.6rem;
}

.price-current--offer {
    color: #e63946;
}

.price-old {
    text-decoration: line-through;
    color: #777;
    font-size: 0.9rem;
}

.price-discount {
    background: #e63946;
    color: white;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
}
</style>