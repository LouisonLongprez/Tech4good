<template>
  <div class="calendar-page flex flex-col p-4 bg-white text-black min-h-screen w-full">
    <!-- Titre -->
    <h1 class="text-3xl font-bold mb-6 text-center">Calendrier</h1>

    <!-- Contrôles du calendrier -->
    <div class="flex justify-between items-center w-full mb-6">
      <button @click="prevMonth" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black">‹</button>
      <div class="text-xl font-semibold text-center flex-grow">
        {{ currentMonthName }} {{ currentYear }}
      </div>
      <button @click="nextMonth" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black">›</button>
    </div>

    <!-- Jours de la semaine -->
    <div class="grid grid-cols-7 text-center font-semibold border-b pb-2">
      <div v-for="day in weekdays" :key="day" class="text-black uppercase">
        {{ day }}
      </div>
    </div>

    <!-- Grille du mois -->
    <div class="grid grid-cols-7 flex-grow border-l border-t">
      <!-- Cases vides avant le premier jour -->
      <div v-for="blank in firstDayOffset" :key="'b'+blank" class="border-r border-b"></div>

      <!-- Jours du mois -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        @click="selectDay(day)"
        :class="[
          'border-r border-b p-2 cursor-pointer transition-all flex flex-col',
          selectedDay === day ? 'bg-blue-100' : 'hover:bg-gray-100'
        ]"
      >
        <!-- Numéro du jour -->
        <div class="text-sm font-bold mb-1">{{ day }}</div>

        <!-- Événements -->
        <div v-if="events[day]?.length" class="flex flex-col gap-1 overflow-hidden">
          <span
            v-for="(event, i) in events[day]"
            :key="i"
            class="text-xs bg-blue-200 text-blue-800 rounded px-1 truncate"
          >
            {{ event.time }} – {{ event.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- Aperçu des événements -->
    <div v-if="selectedDay" class="mt-6 p-4 border rounded bg-gray-50">
      <h2 class="font-semibold mb-2 text-center">
        Événements du {{ selectedDay }}/{{ currentMonth + 1 }}/{{ currentYear }}
      </h2>
      <div v-if="events[selectedDay]?.length">
        <div v-for="(event, i) in events[selectedDay]" :key="i" class="mb-2">
          <strong>{{ event.time }}</strong> – {{ event.title }}
        </div>
      </div>
      <div v-else class="text-center">Aucun événement prévu.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())
const selectedDay = ref(null)

const events = ref({
  5: [{ title: 'Mentorat A', time: '10:00' }, { title: 'Réunion B', time: '14:00' }],
  12: [{ title: 'Mentorat C', time: '09:00' }],
  20: [{ title: 'Webinaire', time: '16:00' }]
})

const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const weekdays = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

const daysInMonth = computed(() => {
  return new Array(new Date(currentYear.value, currentMonth.value + 1, 0).getDate()).fill(0).map((_, i) => i + 1)
})

const firstDayOffset = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1
})

const currentMonthName = computed(() => monthNames[currentMonth.value])

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDay.value = null
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDay.value = null
}

const selectDay = (day) => {
  selectedDay.value = day
}
</script>

<style scoped>
.calendar-page {
  width: 100%;
  height: 100%;
}

.grid > div {
  min-height: 100px; /* hauteur des cases */
}
</style>
