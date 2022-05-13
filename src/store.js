import { calendarWeekData } from "./seed";
import { reactive, readonly } from "vue";


const state = reactive({
    calendarWeekData,
    activeView: "CalendarWeek",
    activeOrdering: "title"
});


const getters = {
    activeDay: () => state.calendarWeekData.find((day) => day.active),
    activeView: () => state.activeView,
    activeOrdering: () => state.activeOrdering,
    events: (dayId) =>  {
        const dayObj = state.calendarWeekData.find((day) => day.id === dayId);
         return dayObj.events.sort((eventA, eventB) => {
            if (eventA[state.activeOrdering] > eventB[state.activeOrdering]) {
                return 1;
            } else if (eventA[state.activeOrdering] < eventB[state.activeOrdering]) {
                return -1;
            } else { 
                return 0;
            }
        })
    }
};

const mutations = {
    storeEvent (eventDO) {
        const activeDay = getters.activeDay();
        activeDay.events.push({
            title: eventDO.title,
            edit: false,
            color: eventDO.color,
            priority: Number(eventDO.priority),
        })
    },
    setActiveOrdering(ordering) {
        state.activeOrdering = ordering;
    },

    setActiveView(view) {
        state.activeView = view;
    },

    editEvent(dayId, eventTitle) {
        state.calendarWeekData.map((dayObj) => {
            dayObj.events.map((event) => {
                event.edit = false;
            });
        });
        const dayObj = state.calendarWeekData.find((day) => day.id === dayId);
        const eventObj = dayObj.events.find((event) => event.title === eventTitle);
        eventObj.edit = true;

    },
 deleteEvent(dayId, eventTitle) {
     const dayObj = state.calendarWeekData.find((day) => day.id === dayId);
     const eventIndex = dayObj.events.findIndex((event) => event.title === eventTitle);
     dayObj.events.splice(eventIndex, 1);
 },
 updateEvent(dayId, oldEventTitle, newEvent) {
    newEvent.title = newEvent.title !== "" ? newEvent.title : oldEventTitle;
    const dayObj = state.calendarWeekData.find((day) => day.id === dayId);
    const eventObj = dayObj.events.find((event) => event.title === oldEventTitle);
    eventObj.title = newEvent.title;
    eventObj.priority = Number(newEvent.priority);
    eventObj.edit = false;

 },
 setActiveDay(dayId) {
     state.calendarWeekData.map((dayObj) => {
         dayObj.id === dayId ? (dayObj.active = true) : (dayObj.active = false)
     })
 }
};

export default {
    state: readonly(state),
    getters,
    mutations,
} 