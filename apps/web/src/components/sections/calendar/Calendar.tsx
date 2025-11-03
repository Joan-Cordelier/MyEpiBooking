/*
** EPITECH PROJECT, 2025
** EPI BOOKING
** File description:
** Calendar system
*/

"use client";
import { addWeeks, startOfWeek, format, addDays } from "date-fns";
import { formatDuration } from "@/lib/formatDuration";
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
export type Room = {
    name: string;
    state: boolean;
};
export type CalendarEvent = {
    title: string;
    type: string;
    author: string;
    start: Date;
    end: Date;
    room?: Room;
    allDay?: boolean;
};

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
    "Kick-off": { bg: "#87bcfcff", border: "#3B82F6" },
    "Follow-up": { bg: "#fddb54ff", border: "#F59E0B" },
    "Meeting": { bg: "#85ffb0ff", border: "#22C55E" },
    "Bootstrap": { bg: "#9c86fcff", border: "#8B5CF6" },
    "Exams": { bg: "#ff7c7cff", border: "#EF4444" },
    "Workgroup": { bg: "#0284C7", border: "#375bffff" },
};

function eventStyleGetter(event: CalendarEvent) {
    const colors = TYPE_COLORS[event.type] ?? { bg: "#E5E7EB", border: "#D1D5DB" };
    return {
        style: {
            backgroundColor: colors.bg,
            borderColor: colors.border,
            color: "#111827",
            borderWidth: 1,
            borderStyle: "solid",
        },
    };
}

function EventRenderer({ event }: { event: CalendarEvent }) {
    return (
        <div className="flex h-full flex-col leading-tight">
            <div className="font-semibold truncate">{event.title}</div>
            <div className="mt-auto flex w-full items-end justify-between text-[11px]">
                <div className="truncate">{formatDuration(event.start, event.end)}</div>
                <div className="flex min-w-0 flex-col items-end text-right">
                    <div className="truncate opacity-80">{event.type}</div>
                    <div className="truncate opacity-80">{event.author}</div>
                </div>
            </div>
        </div>
    );
}

export default function BookingCalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.WEEK);
    const [room, setRoom] = useState<string>('601');
    const rooms: Room[] = [{name: '601', state: false}, {name: '602', state: true}, {name: '801', state: false}];
    const selectedRoom = useMemo(() => rooms.find(r => r.name === room), [rooms, room]);

        const allEvents = useMemo<CalendarEvent[]>(() => {
            return [
                {
                    title: "Kick-off my_printf", // Mercredi 22/10/2025 09:00–10:00 [601]
                    type: 'Kick-off',
                    author: 'Sebastien Goby',
                    start: new Date(2025, 9, 22, 9, 0),
                    end: new Date(2025, 9, 22, 10, 0),
                    room: rooms.find(r => r.name === '601')
                },
                {
                    title: "Bootstrap my_printf",
                    type: 'Bootstrap',
                    author: 'Sebastien Goby',
                    start: new Date(2025, 9, 22, 10, 0), // Mercredi 22/10/2025 10:00–12:00 [601]
                    end: new Date(2025, 9, 22, 12, 0),
                    room: rooms.find(r => r.name === '601')
                },
                {
                    title: "Kick-off Final Stumper",
                    type: 'Kick-off',
                    author: 'Sebastien Goby',
                    start: new Date(2025, 9, 25, 9, 0),
                    end: new Date(2025, 9, 25, 10, 0),
                    room: rooms.find(r => r.name === '601')
                },
                {
                    title: "Final Stumper",
                    type: 'Exams',
                    author: 'Sebastien Goby',
                    start: new Date(2025, 9, 25, 10, 0),
                    end: new Date(2025, 9, 25, 18, 0),
                    room: rooms.find(r => r.name === '601')
                },
                {
                    title: "Meeting R-Type",
                    type: 'Meeting',
                    author: 'Mike Mathieu',
                    start: new Date(2025, 9, 22, 10, 0),
                    end: new Date(2025, 9, 22, 11, 0),
                    room: rooms.find(r => r.name === '602')
                },
                {
                    title: "R-Type",
                    type: 'Workgroup',
                    author: 'Mike Mathieu',
                    start: new Date(2025, 9, 22, 11, 0),
                    end: new Date(2025, 9, 22, 13, 0),
                    room: rooms.find(r => r.name === '602')
                }
            ];
        }, []);

        const events = useMemo<CalendarEvent[]>(() => {
            return allEvents.filter((e) => !room || (e.room && e.room.name === room));
        }, [allEvents, room]);

    const navLabel = useMemo(() => {
        if (view === Views.DAY) {
            return `Jour du ${format(currentDate, "EEEE dd/MM", { locale: fr })}`;
        }
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = addDays(weekStart, 6);
        return `Semaine du ${format(weekStart, "dd/MM", { locale: fr })} - ${format(end, "dd/MM", { locale: fr })}`;
    }, [currentDate, view]);

    const onPrev = useCallback(() => {
        setCurrentDate((d) => (view === Views.DAY ? addDays(d, -1) : addWeeks(d, -1)));
    }, [view]);
    const onNext = useCallback(() => {
        setCurrentDate((d) => (view === Views.DAY ? addDays(d, 1) : addWeeks(d, 1)));
    }, [view]);
    const onToday = useCallback(() => setCurrentDate(new Date()), []);
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
                    <div className="ml-2 text-sm font-semibold text-neutral-700">{navLabel}</div>
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
                    <RoomSelector rooms={rooms.map(r => r.name)} value={room} onChange={setRoom} />
                    <ReserveButton disabled={!selectedRoom?.state} />
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
                    date={currentDate}
                    onNavigate={(d) => setCurrentDate(d)}
                    views={[Views.WEEK, Views.DAY]}
                    step={30}
                    timeslots={2}
                    min={new Date(1970, 0, 1, 8, 0)}
                    max={new Date(1970, 0, 1, 20, 0)}
                    culture="fr"
                    selectable
                    onSelectSlot={handleSelectSlot}
                    components={{ toolbar: () => null, event: EventRenderer }}
                    eventPropGetter={(e) => eventStyleGetter(e as CalendarEvent)}
                                style={{ height: 900 }}
                />
            </div>
        </section>
    );
}
