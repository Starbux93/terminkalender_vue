<template>
  <div class="card border-start" :class="cardClasses">
    <div
      class="card-header text-center"
      :class="cardHeaderClasses"
      role="button"
      @click="setActiveDay()"
    >
      <strong>{{ day.fullName }}</strong>
    </div>
    <div class="card-body">
      <transition name="fade" mode="out-in">
        <div v-if="day.events.length">
          <transition-group name="list">
            <CalendarEvent
              v-for="event in events"
              :key="event.title"
              :event="event"
              :day="day"
            >
              <template v-slot:eventPriority="slotProps">
                <h5>{{ slotProps.priorityDisplayName }}</h5>
              </template>
              <template v-slot>
                {{ event.title }}
              </template>
            </CalendarEvent>
          </transition-group>
        </div>
        <div v-else>
          <div class="alert alert-light text-center">
            <i>Keine Termine</i>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Store from "../store";
import CalendarEvent from "./CalendarEvent.vue";
export default {
  name: "CalendarDay",
  components: {
    CalendarEvent,
  },
  props: {
    day: Object,
    default: function () {
      return {
        id: -1,
        fullName: "Fehlender Wochentag",
        events: [],
      };
    },
    valiator: function (value) {
      if (Object.keys(value).includes("id")) {
        return true;
      }
    },
  },
  computed: {
      events() {
          return Store.getters.events(this.day.id)
      },
    cardClasses() {
      return this.day.id === Store.getters.activeDay().id
        ? ["border-primary"]
        : null;
    },
    cardHeaderClasses() {
      return this.day.id === Store.getters.activeDay().id
        ? ["bg-primary", "text-white"]
        : null;
    },
  },

  methods: {
    setActiveDay() {
      Store.mutations.setActiveDay(this.day.id);
    },
  },
};
</script>

<style>
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);

}

.list-move {
    transition: transform 0.8s ease;
}
.list-enter-active,
.list-leave-active {
    transition: all 1s ease;
}


</style>    