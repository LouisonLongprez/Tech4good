<template>
  <div class="calendar-page">
    <!-- Header -->
    <header class="header">
      <div class="user-info">
        <img src="./personalpicture.png" class="avatar" />
        <div>
          <h1>Alexis</h1>
          <p>Matricule #873873</p>
        </div>
      </div>
      <div class="roadmap">
        <span>{{ monthName }} {{ year }}</span>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
      </div>
    </header>

    <!-- Calendar -->
    <section class="calendar-grid">
      <div class="day header" v-for="d in daysOfWeek" :key="d">{{ d }}</div>

      <div v-for="(cell, index) in calendarCells" :key="index" class="day" :class="{ empty: !cell.day, event: cell.event }">
        <div v-if="cell.day">{{ cell.day }}</div>
        <span v-if="cell.event" class="event-label">{{ cell.event }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
defineOptions({ name: "AppCalendar" });
import { ref, computed } from "vue";

// Date actuelle
const today = new Date();
const month = ref(today.getMonth());
const year = ref(today.getFullYear());

// Jours de la semaine
const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Noms des mois
const monthNames = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

const monthName = computed(() => monthNames[month.value]);

// Exemple d'événements
const events = {
  "2025-09-14": "Réunion",
  "2025-09-23": "Formation",
};

// Génération du calendrier
const calendarCells = computed(() => {
  const firstDay = new Date(year.value, month.value, 1);
  const lastDay = new Date(year.value, month.value + 1, 0);

  const startDay = (firstDay.getDay() + 6) % 7; // Lundi = 0
  const totalDays = lastDay.getDate();

  const cells = [];

  // Cases vides avant le 1er
  for (let i = 0; i < startDay; i++) {
    cells.push({ day: null });
  }

  // Jours du mois
  for (let d = 1; d <= totalDays; d++) {
    const dateKey = `${year.value}-${String(month.value + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      day: d,
      event: events[dateKey] || null,
    });
  }

  return cells;
});
</script>

<style scoped>
.calendar-page {
  background: #f9fafb;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: sans-serif;
  color: #111;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.roadmap {
  text-align: right;
}

.progress-bar {
  width: 150px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-top: 5px;
}

.progress {
  width: 40%;
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

/* Calendar grid plein écran */
.calendar-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 6px;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.day {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 6px;
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.day.header {
  background: transparent;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  color: #374151;
}

.day.empty {
  background: transparent;
  box-shadow: none;
}

.event {
  background: #dbeafe;
  border: 1px solid #3b82f6;
}

.event-label {
  margin-top: auto;
  font-size: 10px;
  background: #3b82f6;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  align-self: center;
}
</style>
