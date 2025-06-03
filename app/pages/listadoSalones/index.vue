<template>
    <div class="max-w-5xl mx-auto p-4 sm:px-50"> 
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">

            <h1 class="text-2xl font-bold mb-2 sm:mb-0">Listado de Salones</h1>
            <div class="sm:ml-[200px]">
                <Button @click="irANuevoSalon">Crear Salón Nuevo</Button>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 rounded-md">
                <thead>
                      <tr class="bg-gray-800 text-white">
                        <th class="text-left p-3 border-b border-gray-300">Nombre</th>
                        <th class="text-left p-3 border-b border-gray-300">Ubicación</th>
                        <th class="text-left p-3 border-b border-gray-300">Capacidad</th>
                        <th class="p-3 border-b border-gray-300 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="salon in salones" :key="salon.id" class="hover:bg-gray-700 text-white">
                        <td class="p-3 border-b border-gray-300">{{ salon.name }}</td>
                        <td class="p-3 border-b border-gray-300">{{ salon.location }}</td>
                        <td class="p-3 border-b border-gray-300">{{ salon.space }}</td>
                        <td class="p-3 border-b border-gray-300 text-center">
                            <Button size="sm" @click="() => irAEditarSalon(salon.id)">
                                Editar
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const salones = ref([])

function irANuevoSalon() {
    router.push('/creacionSalones')
}

function irAEditarSalon(id) {
    router.push(`/creacionSalones/${id}`)
}

async function cargarSalones() {
    try {
    
        const response = await fetch('')
        const data = await response.json()
        salones.value = data.data
    } catch (error) {
        console.error("Error al cargar salones:", error)
    }
}

onMounted(() => {
    cargarSalones()
})

</script>
