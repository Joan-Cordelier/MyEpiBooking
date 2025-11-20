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
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { useMemo, useState, useCallback, useEffect } from "react";
import RoomSelector from "@/components/ui/RoomSelector";
import ReserveButton from "@/components/ui/ReserveButton";
import { Room } from "@/lib/data";
import { handleRoom } from "@/lib/handleRooms";
import { Booking, handleMyBookings, createBooking, ReservationType } from "@/lib/handleBookings";

const locales = { fr } as const;
const localizer = dateFnsLocalizer({
    format,
    parse: (dateString: string, _formatString: string, _backupDate: Date) => new Date(dateString),
    startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
    getDay: (date: Date) => date.getDay(),
    locales,
});

const TYPE_COLORS: Record<string, { bg: string; border: string }> = {
    MEETING: { bg: "#85ffb0ff", border: "#22C55E" },
    WORK: { bg: "#0284C7", border: "#375bffff" },
    KICK_OFF: { bg: "#87bcfcff", border: "#3B82F6" },
    BOOTHING: { bg: "#9c86fcff", border: "#8B5CF6" },
    WORKSHOP: { bg: "#fddb54ff", border: "#F59E0B" },
    TALK: { bg: "#9DD6F9", border: "#0EA5E9" },
    UNEXPECTED: { bg: "#ff7c7cff", border: "#EF4444" },
    LECTURE: { bg: "#c4b5fd", border: "#7C3AED" },
    EXAM: { bg: "#fecaca", border: "#DC2626" },
    OTHER: { bg: "#e5e7eb", border: "#9CA3AF" },
};

function eventStyleGetter(event: any) {
    if (event.isGhost) {
        const baseColor = event.isConflict ? 'rgba(239,68,68,0.35)' : 'rgba(107,114,128,0.35)';
        const borderColor = event.isConflict ? '#EF4444' : '#6B7280';
        return {
            style: {
                backgroundColor: baseColor,
                borderColor,
                color: '#111827',
                borderWidth: 2,
                borderStyle: 'dashed',
                opacity: 0.85,
            }
        };
    }
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

function EventRenderer({ event }: { event: any }) {
    return (
        <div className="flex h-full flex-col leading-tight">
            <div className="font-semibold truncate flex items-center gap-1">
                <span>{event.title}</span>
                {event.isGhost && (
                    <span className={"text-[10px] font-medium uppercase tracking-wide rounded px-1 py-[1px] " + (event.isConflict ? 'bg-red-100 text-red-600' : 'bg-neutral-200 text-neutral-600')}>
                        Prévisualisation{event.isConflict ? ' (Conflit)' : ''}
                    </span>
                )}
            </div>
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
    const [room, setRoom] = useState<string>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<{ title: string; type: ReservationType; description: string }>({
        title: "",
        type: "MEETING",
        description: ""
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await handleRoom();
                if (mounted)
                    setRooms(Array.isArray(data) ? data : []);
            } catch {
                if (mounted)
                    setRooms([]);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const selectedRoom = useMemo(() => rooms.find(r => r.name === room), [rooms, room]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await handleMyBookings();
                if (mounted)
                    setBookings(Array.isArray(data) ? data : []);
            } catch {
                if (mounted)
                    setBookings([]);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const provisionalSlot = useMemo(() => {
        if (!startDate || !startTime || !endDate || !endTime) return null;
        try {
            const start = new Date(`${startDate}T${startTime}:00`);
            const end = new Date(`${endDate}T${endTime}:00`);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
            return { start, end };
        } catch { return null; }
    }, [startDate, startTime, endDate, endTime]);

    const hasConflict = useMemo(() => {
        if (!provisionalSlot || !room) return false;
        return bookings.some(b => b.room.name === room && provisionalSlot.start < b.end && provisionalSlot.end > b.start);
    }, [bookings, provisionalSlot, room]);

    const events = useMemo<any[]>(() => {
        const filtered: any[] = bookings.filter((e) => !room || room === 'Toutes' || (e.room && e.room.name === room));
        if (provisionalSlot && selectedRoom && selectedRoom.state && showForm) {
            filtered.push({
                id: 'ghost-' + (selectedRoom.id || selectedRoom.name),
                title: formValues.title || '(Prévisualisation)',
                type: formValues.type,
                author: 'Vous',
                start: provisionalSlot.start,
                end: provisionalSlot.end,
                room: selectedRoom,
                isGhost: true,
                isConflict: hasConflict,
            });
        }
        return filtered;
    }, [bookings, room, provisionalSlot, selectedRoom, showForm, formValues.title, formValues.type, hasConflict]);

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

    useEffect(() => {
        if (!room && rooms.length > 0) {
            const first = rooms.find(r => r.state);
            if (first) setRoom(first.name);
        }
    }, [rooms, room]);

    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    const onReserveClick = useCallback(() => {
        if (!selectedRoom || !selectedRoom.state) return;
        setShowForm(v => !v);
        setErrorMsg(null);
    }, [selectedRoom]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues(v => ({ ...v, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom || !selectedRoom.state)
            return setErrorMsg("Salle non réservable ou non sélectionnée.");
        if (!provisionalSlot)
            return setErrorMsg("Renseignez dates & heures.");
        if (provisionalSlot.end <= provisionalSlot.start)
            return setErrorMsg("Fin doit être après début.");
        if (hasConflict) 
            return setErrorMsg("Ce créneau est déjà pris pour cette salle.");
        setSubmitting(true);
        setErrorMsg(null);

        try {
            const booking = await createBooking({
                type: formValues.type,
                title: formValues.title || 'Sans titre',
                description: formValues.description || '',
                startDate: provisionalSlot.start,
                endDate: provisionalSlot.end,
                roomId: selectedRoom.id,
            });
            if (!booking) {
                setErrorMsg("Échec de la création de la réservation.");
            } else {
                setBookings(prev => [...prev, booking]);
                setShowForm(false);
                setStartDate(""); setStartTime(""); setEndDate(""); setEndTime("");
                setFormValues({ title: "", type: "MEETING", description: "" });
            }
        } catch (err: any) {
            setErrorMsg("Erreur: " + (err?.message || 'inconnue'));
        } finally {
            setSubmitting(false);
        }
    }, [provisionalSlot, selectedRoom, formValues, hasConflict]);

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
                    <RoomSelector rooms={["Toutes", ...rooms.map(r => r.name)]} value={room} onChange={setRoom} />
                    <ReserveButton disabled={!selectedRoom?.state} onClick={onReserveClick} />
                </div>
            </div>
            {provisionalSlot && (
                <div className="mb-4 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
                    Aperçu: {format(provisionalSlot.start, 'dd/MM HH:mm')} – {format(provisionalSlot.end, 'dd/MM HH:mm')} {hasConflict && <span className="ml-2 font-semibold text-red-600">(Conflit)</span>}
                </div>
            )}
            {showForm && selectedRoom && selectedRoom.state && (
                <form onSubmit={handleSubmit} className="mb-4 space-y-3 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[220px]">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Titre</label>
                            <input name="title" value={formValues.title} onChange={handleChange} placeholder="Titre" className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black placeholder:text-neutral-400" required />
                        </div>
                        <div className="w-40">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Type</label>
                            <select name="type" value={formValues.type} onChange={handleChange} className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black">
                                <option value="MEETING">Meeting</option>
                                <option value="WORK">Work</option>
                                <option value="KICK_OFF">Kick Off</option>
                                <option value="BOOTHING">Boothing</option>
                                <option value="WORKSHOP">Workshop</option>
                                <option value="TALK">Talk</option>
                                <option value="UNEXPECTED">Unexpected</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[220px]">
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Salle</label>
                            <input value={selectedRoom.name} disabled className="w-full rounded border border-neutral-300 bg-neutral-100 px-2 py-1 text-sm text-black" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Description</label>
                        <textarea name="description" value={formValues.description} onChange={handleChange} placeholder="Description" className="w-full rounded border border-neutral-300 px-2 py-1 text-sm h-20 resize-none text-black placeholder:text-neutral-400" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Début - Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Début - Heure</label>
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Fin - Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide">Fin - Heure</label>
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full rounded border border-neutral-300 px-2 py-1 text-sm text-black" />
                        </div>
                    </div>
                    <div className="text-xs text-neutral-600">
                        {provisionalSlot ? (
                            <>Début: {format(provisionalSlot.start, 'dd/MM HH:mm')} · Fin: {format(provisionalSlot.end, 'dd/MM HH:mm')}</>
                        ) : <span className="text-red-600">Renseignez dates & heures.</span>}
                    </div>
                    {errorMsg && <div className="text-sm font-medium text-red-600">{errorMsg}</div>}
                    <div className="flex gap-2">
                        <button type="submit" disabled={submitting || hasConflict || !provisionalSlot} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
                            {submitting ? 'Création...' : 'Confirmer la réservation'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); }} className="rounded-md bg-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-300">
                            Annuler
                        </button>
                    </div>
                </form>
            )}
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
                    selectable={false}
                    components={{ toolbar: () => null, event: EventRenderer }}
                    eventPropGetter={(e) => eventStyleGetter(e as Booking)}
                                style={{ height: 900 }}
                />
            </div>
        </section>
    );
}
