/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Calendar system
*/

import { addWeeks, startOfWeek, format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, dateFnsLocalizer, Views, SlotInfo } from "react-big-calendar";
import { useMemo, useState, useCallback } from "react";
import RoomSelector from "@/components/ui/RoomSelector";
import ReserveButton from "@/components/ui/ReserveButton";

const locales = { fr } as const;
const localizer = dateFnsLocalizer({
    format,
    parse: (dateString: string, _formatString: string, _backupDate: Date) => new Date(dateString),
    startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
    getDay: (date: Date) => date.getDay(),
    locales,
});
export type Room = string;
export type CalendarEvent = {
    title: string;
    start: Date;
    end: Date;
    room?: Room;
    allDay?: boolean;
};

export default function BookingCalendarSection() {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.WEEK);
    const [room, setRoom] = useState<Room>("Salle 601");
    const rooms: Room[] = ["Salle 601", "Salle 602", "Salle 603"];

        const allEvents = useMemo<CalendarEvent[]>(() => {
            return [
                {
                    title: "Kick-off mini_printf", // Mercredi 22/10/2025 09:00–10:00 [601]
                    start: new Date(2025, 9, 22, 9, 0),
                    end: new Date(2025, 9, 22, 10, 0),
                    room: "Salle 601",
                },
                {
                    title: "Bootstrap mini_printf",
                    start: new Date(2025, 9, 22, 10, 0), // Mercredi 22/10/2025 10:00–12:00 [601]
                    end: new Date(2025, 9, 22, 12, 0),
                    room: "Salle 601",
                },
            ];
        }, []);

        const events = useMemo<CalendarEvent[]>(() => {
            return allEvents.filter((e) => !room || e.room === room);
        }, [allEvents, room]);

    const weekLabel = useMemo(() => {
        const end = addDays(currentWeekStart, 6);
        return `${format(currentWeekStart, "dd/MM", { locale: fr })} - ${format(end, "dd/MM", { locale: fr })}`;
    }, [currentWeekStart]);

    const onPrev = useCallback(() => setCurrentWeekStart((d) => addWeeks(d, -1)), []);
    const onNext = useCallback(() => setCurrentWeekStart((d) => addWeeks(d, 1)), []);
    const onToday = useCallback(() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })), []);
    const handleSelectSlot = useCallback((slot: SlotInfo) => {
        console.log("Select slot:", slot.start, slot.end);
    }, []);

    return (
        <section className="w-full">
            <div className="mb-3 flex items-center justify-between">
                {/* Custom toolbar */}
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-md shadow-sm overflow-hidden border border-black/10">
                        <button
                            type="button"
                            onClick={onPrev}
                            className="h-9 px-3 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
                            aria-label="Semaine précédente"
                        >
                            {/* Left arrow */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={onToday}
                            className="h-9 px-3 bg-white hover:bg-neutral-50 text-neutral-700 border-l border-black/10 transition-colors"
                        >
                            Aujourd'hui
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            className="h-9 px-3 bg-white hover:bg-neutral-50 text-neutral-700 border-l border-black/10 transition-colors"
                            aria-label="Semaine suivante"
                        >
                            {/* Right arrow */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                    <div className="ml-2 text-sm font-semibold text-neutral-700">Semaine du {weekLabel}</div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md shadow-sm overflow-hidden border border-black/10">
                        <button
                            type="button"
                            onClick={() => setView(Views.DAY)}
                            className={`h-9 px-3 transition-colors ${view === Views.DAY ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}
                        >
                            Jour
                        </button>
                        <button
                            type="button"
                            onClick={() => setView(Views.WEEK)}
                            className={`h-9 px-3 border-l border-black/10 transition-colors ${view === Views.WEEK ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-neutral-50"}`}
                        >
                            Semaine
                        </button>
                    </div>
                    <RoomSelector rooms={rooms} value={room} onChange={setRoom} />
                    <ReserveButton />
                </div>
            </div>
                    <div className="rbc-epi rounded-2xl border border-black/20 bg-white p-3 md:p-4">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={(v) => setView(v)}
                    date={currentWeekStart}
                    onNavigate={(d) => setCurrentWeekStart(startOfWeek(d, { weekStartsOn: 1 }))}
                    views={[Views.WEEK, Views.DAY]}
                    step={30}
                    timeslots={2}
                    min={new Date(1970, 0, 1, 8, 0)}
                    max={new Date(1970, 0, 1, 20, 0)}
                    culture="fr"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    components={{ toolbar: () => null }}
                                style={{ height: 900 }}
                />
            </div>
        </section>
    );
}
