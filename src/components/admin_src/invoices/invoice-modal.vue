<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card" style="background: #0f172a; padding: 2rem; border-radius: 12px; width: 100%; max-width: 700px; border: 1px solid #334155;">
            
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="text-white m-0 d-flex align-items-center gap-2">
                    <span class="material-symbols-outlined" style="color:#a3e635;">receipt_long</span>
                    Detalles de la Factura {{ invoice?.invoice_number }}
                </h4>
                <button class="btn btn-sm text-muted" @click="$emit('close')">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div v-if="invoice">
                <div class="invoice-info mb-4 d-flex justify-content-between bg-dark p-3 rounded" style="border: 1px solid #334155;">
                    <div>
                        <span class="text-muted d-block small mb-1">Fecha de Creación</span>
                        <span class="text-white fw-bold">{{ invoice.created_at }}</span>
                    </div>
                    <div>
                        <span class="text-muted d-block small mb-1">Cliente</span>
                        <span class="text-white fw-bold">{{ invoice.user_name || '#' + invoice.user_id }}</span>
                    </div>
                    <div class="text-end">
                        <span class="text-muted d-block small mb-1">Total Cobrado</span>
                        <span class="text-success fw-bold fs-5">{{ invoice.total }} €</span>
                    </div>
                </div>

                <h6 class="text-white mb-3" style="border-bottom: 1px solid #334155; padding-bottom: 5px;">Desglose de Ítems</h6>

                <div v-if="!invoice.items || invoice.items.length === 0" class="text-center text-muted py-3">
                    Esta factura no tiene ítems detallados o proviene de una cita base sin productos.
                </div>

                <div v-else class="table-responsive" style="max-height: 300px;">
                    <table class="table table-dark table-sm align-middle m-0" style="background: transparent;">
                        <thead>
                            <tr style="border-bottom: 2px solid #334155;">
                                <th class="text-muted bg-transparent border-0 pb-2">Tipo</th>
                                <th class="text-muted bg-transparent border-0 pb-2">Descripción</th>
                                <th class="text-center text-muted bg-transparent border-0 pb-2">Cantidad</th>
                                <th class="text-end text-muted bg-transparent border-0 pb-2">Precio U.</th>
                                <th class="text-end text-muted bg-transparent border-0 pb-2">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in invoice.items" :key="index" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                                <td class="bg-transparent border-0 py-3">
                                    <span v-if="item.type === 'product'" class="badge bg-primary">Producto</span>
                                    <span v-else-if="item.type === 'appointment'" class="badge bg-warning text-dark">Cita/Servicio</span>
                                    <span v-else class="badge bg-secondary">Otro</span>
                                </td>
                                <td class="text-white bg-transparent border-0 py-3">
                                    <div v-if="item.type === 'product'">
                                        <div class="fw-bold">{{ item.name }}</div>
                                    </div>
                                    <div v-else-if="item.type === 'appointment'">
                                        <div class="fw-bold">{{ item.service || 'Servicio General' }}</div>
                                        <small class="text-muted d-block">{{ item.appointment_date }} | {{ item.vehicle || 'Vehículo Genérico' }}</small>
                                    </div>
                                </td>
                                <td class="text-center text-white bg-transparent border-0 py-3">{{ item.quantity }}</td>
                                <td class="text-end text-white bg-transparent border-0 py-3">{{ item.price }} €</td>
                                <td class="text-end fw-bold text-white bg-transparent border-0 py-3">{{ item.subtotal }} €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4 text-end">
                <button class="btn btn-secondary" @click="$emit('close')">Cerrar</button>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'InvoiceModal',
    props: {
        show: Boolean,
        invoice: Object
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
