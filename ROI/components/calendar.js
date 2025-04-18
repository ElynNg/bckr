import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatDateToYYYYMMDD } from "utils/utils";
import { useSelector } from "react-redux";
import { DEFAULT_COLOR } from "../../../../utils/color";
import { updateEvent } from "../../../../reducers/v2/admin/overview";
import { useDispatch } from "react-redux";
import axios from "axios";

const Calendar = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(useSelector((state) => state.v2_overview.content).projects);
  const [events, setEvent] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDateToYYYYMMDD(new Date(), "-"));
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [eventChange, setEventChange] = useState(false);

  useEffect(() => {
    setEvent(
      data.map((item, index) => {
        return {
          id: item.project_seq,
          title: item.title,
          start: item.start_date,
          end: handleDateChange(item.end_date, 1),
          color: DEFAULT_COLOR()[Math.floor(Math.random() * DEFAULT_COLOR().length)],
        };
      }),
    );
  }, [data]);

  const handleEventUpdate = (event) => {
    const updatedEvent = {
      ...event.event,
      id: event.event.id,
      start: formatDateToYYYYMMDD(event.event.start, "-"),
      end: formatDateToYYYYMMDD(event.event.end, "-"),
    };

    setEvent(
      events.map((e) => {
        if (e.id == updatedEvent.id) {
          e.start = updatedEvent.start;
          e.end = handleDateChange(updatedEvent.end, -1);
        }

        return e;
      }),
    );

    setData(
      data.map((item) => {
        if (item.project_seq == updatedEvent.id) {
          item.start_date = updatedEvent.start;
          item.end_date = handleDateChange(updatedEvent.end, -1);
        }
        return item;
      }),
    );
    setEventChange(true);
    dispatch(updateEvent(data));
    setSelectedEvent(data.filter((item) => item.project_seq == updatedEvent.id));
  };

  const upload = async (e) => {
    if (eventChange) {
      try {
        await axios.post("/api/v2/overview/update/event", e).finally(() => {
          setEventChange(false);
        });
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  useEffect(() => {
    if (eventChange && selectedEvent.length > 0) {
      const updatedEvent = selectedEvent[0];
      upload({
        id: updatedEvent.project_seq,
        start: updatedEvent.start_date,
        end: updatedEvent.end_date,
      });
      setEventChange(false);
    }
  }, [eventChange, selectedEvent]);

  useEffect(() => {
    if (data) {
      let filteredEvents = data.filter(
        (item) => item.start_date <= selectedDate && item.end_date >= selectedDate,
      );
      let prjIds = [...new Set(filteredEvents.map((item) => item.project_seq))];
      setSelectedEvent(prjIds.map((id) => filteredEvents.find((item) => item.project_seq === id)));
    }
  }, [selectedDate]);

  return (
    <>
      <div className="calendar-area">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          initialView="dayGridMonth"
          editable={true}
          events={events}
          eventDrop={handleEventUpdate}
          eventResize={handleEventUpdate}
          dateClick={(clickInfo) => {
            setSelectedDate(clickInfo.dateStr);
          }}
          eventClick={(clickInfo) => {
            setSelectedEvent(data.filter((item) => item.project_seq == clickInfo.event.id));
          }}
        />
      </div>
      <div className="project-info-area">
        {!selectedEvent || selectedEvent.length === 0 ? (
          <p>No result.</p>
        ) : (
          selectedEvent.map((project, index) => (
            <div key={index} style={{ padding: "10px" }}>
              <h2>{project.title}</h2>
              <p>- Start date: {project.start_date}</p>
              <p>- End date: {project.end_date}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const handleDateChange = (inputDate, days) => {
  let date = new Date(inputDate);
  date.setDate(date.getDate() + days);
  return formatDateToYYYYMMDD(date, "-");
};

export default Calendar;
