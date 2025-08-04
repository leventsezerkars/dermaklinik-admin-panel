<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header">
      <h2 class="card-title fw-bolder">Calendar</h2>

      <div class="card-toolbar">
        <button class="btn btn-flex btn-primary" @click="newEvent()">
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
          </span>
          Add Event
        </button>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body">
      <!--begin::Calendar-->
      <FullCalendar
        class="demo-app-calendar"
        :options="calendarOptions"
      ></FullCalendar>
      <!--end::Calendar-->
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->

  <NewEventModal></NewEventModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import NewEventModal from "@/components/modals/forms/NewEventModal.vue";
import { Modal } from "bootstrap";
import moment from "moment";

export default defineComponent({
  name: "calendar-app-1",
  components: {
    FullCalendar,
    NewEventModal,
  },
  setup() {
    const todayDate = moment().startOf("day");
    const YM = todayDate.format("YYYY-MM");
    const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
    const TODAY = todayDate.format("YYYY-MM-DD");
    const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");

    const events = [
      {
        title: "All Day Event",
        start: YM + "-01",
        description: "Toto lorem ipsum dolor sit incid idunt ut",
        className: "fc-event-danger fc-event-solid-warning",
      },
      {
        title: "Reporting",
        start: YM + "-14T13:30:00",
        description: "Lorem ipsum dolor incid idunt ut labore",
        end: YM + "-14",
        className: "fc-event-success",
      },
      {
        title: "Company Trip",
        start: YM + "-02",
        description: "Lorem ipsum dolor sit tempor incid",
        end: YM + "-03",
        className: "fc-event-primary",
      },
      {
        title: "ICT Expo 2017 - Product Release",
        start: YM + "-03",
        description: "Lorem ipsum dolor sit tempor inci",
        end: YM + "-05",
        className: "fc-event-light fc-event-solid-primary",
      },
      {
        title: "Dinner",
        start: YM + "-12",
        description: "Lorem ipsum dolor sit amet, conse ctetur",
        end: YM + "-10",
      },
      {
        id: 999,
        title: "Repeating Event",
        start: YM + "-09T16:00:00",
        description: "Lorem ipsum dolor sit ncididunt ut labore",
        className: "fc-event-danger",
      },
      {
        id: 1000,
        title: "Repeating Event",
        description: "Lorem ipsum dolor sit amet, labore",
        start: YM + "-16T16:00:00",
      },
      {
        title: "Conference",
        start: YESTERDAY,
        end: TOMORROW,
        description: "Lorem ipsum dolor eius mod tempor labore",
        className: "fc-event-primary",
      },
      {
        title: "Meeting",
        start: TODAY + "T10:30:00",
        end: TODAY + "T12:30:00",
        description: "Lorem ipsum dolor eiu idunt ut labore",
      },
      {
        title: "Lunch",
        start: TODAY + "T12:00:00",
        className: "fc-event-info",
        description: "Lorem ipsum dolor sit amet, ut labore",
      },
      {
        title: "Meeting",
        start: TODAY + "T14:30:00",
        className: "fc-event-warning",
        description: "Lorem ipsum conse ctetur adipi scing",
      },
      {
        title: "Happy Hour",
        start: TODAY + "T17:30:00",
        className: "fc-event-info",
        description: "Lorem ipsum dolor sit amet, conse ctetur",
      },
      {
        title: "Dinner",
        start: TOMORROW + "T05:00:00",
        className: "fc-event-solid-danger fc-event-light",
        description: "Lorem ipsum dolor sit ctetur adipi scing",
      },
      {
        title: "Birthday Party",
        start: TOMORROW + "T07:00:00",
        className: "fc-event-primary",
        description: "Lorem ipsum dolor sit amet, scing",
      },
      {
        title: "Click for Google",
        url: "http://google.com/",
        start: YM + "-28",
        className: "fc-event-solid-info fc-event-light",
        description: "Lorem ipsum dolor sit amet, labore",
      },
    ];
    const newEvent = () => {
      const modal = new Modal(document.getElementById("kt_modal_add_event"));
      modal.show();
    };

    const calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      initialDate: TODAY,
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,

      views: {
        dayGridMonth: { buttonText: "month" },
        timeGridWeek: { buttonText: "week" },
        timeGridDay: { buttonText: "day" },
      },

      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: events,
      dateClick: newEvent,
      eventClick: newEvent,
    };

    return {
      calendarOptions,
      newEvent,
    };
  },
});
</script>

<style lang="scss">
.fc .fc-button {
  padding: 0.75rem 1.25rem;
  box-shadow: none !important;
  border: 0 !important;
  border-radius: 0.475rem;
  vertical-align: middle;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
