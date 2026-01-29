import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Provider/reservation_provider.dart';
import '../Model/room.dart';

class NewBookingPage extends StatefulWidget {
  const NewBookingPage({super.key});

  @override
  State<NewBookingPage> createState() => _NewBookingPageState();
}

class _NewBookingPageState extends State<NewBookingPage> {
  Room? _selectedRoom;
  DateTime? _selectedDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;
  final TextEditingController _reasonController = TextEditingController();
  final TextEditingController _titleController = TextEditingController();
  String _selectedType = 'MEETING';
  final List<String> _types = const ['MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReservationProvider>().fetchRooms();
    });
  }

  @override
  void dispose() {
    _reasonController.dispose();
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _selectStartTime(BuildContext context) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _startTime ?? TimeOfDay.now(),
    );
    if (picked != null) {
      setState(() => _startTime = picked);
    }
  }

  Future<void> _selectEndTime(BuildContext context) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: _endTime ?? const TimeOfDay(hour: 12, minute: 0),
    );
    if (picked != null) {
      setState(() => _endTime = picked);
    }
  }

  void _submitReservation() async {
    if (_selectedRoom == null || _selectedDate == null || _startTime == null || _endTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Le titre est requis')),
      );
      return;
    }

    final startDateTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _startTime!.hour,
      _startTime!.minute,
    );

    final endDateTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _endTime!.hour,
      _endTime!.minute,
    );

    if (endDateTime.isBefore(startDateTime) || endDateTime.isAtSameMomentAs(startDateTime)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('L\'heure de fin doit être après l\'heure de début')),
      );
      return;
    }

    final roomId = _selectedRoom!.apiId;

    final success = await context.read<ReservationProvider>().createReservation(
      roomId,
      startDateTime,
      endDateTime,
      _reasonController.text.isEmpty ? null : _reasonController.text,
      _titleController.text.trim(),
      _selectedType,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Réservation créée avec succès !')),
      );
      Navigator.of(context).pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(context.read<ReservationProvider>().error ?? 'Erreur lors de la réservation')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle Réservation'),
        backgroundColor: const Color(0xFF3B26FF),
      ),
      body: Consumer<ReservationProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.rooms.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Sélection de la salle
                const Text('Salle', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButton<Room>(
                  isExpanded: true,
                  value: _selectedRoom,
                  hint: const Text('Sélectionnez une salle'),
                  items: provider.rooms.map((room) {
                    return DropdownMenuItem(
                      value: room,
                      child: Text('${room.name} (Capacité: ${room.capacity})'),
                    );
                  }).toList(),
                  onChanged: (room) => setState(() => _selectedRoom = room),
                ),
                const SizedBox(height: 24),

                // Sélection de la date
                const Text('Date', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => _selectDate(context),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _selectedDate != null
                          ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                          : 'Sélectionnez une date',
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Heure de début
                const Text('Heure de début', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => _selectStartTime(context),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _startTime != null ? _startTime!.format(context) : 'Sélectionnez l\'heure de début',
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Heure de fin
                const Text('Heure de fin', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () => _selectEndTime(context),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _endTime != null ? _endTime!.format(context) : 'Sélectionnez l\'heure de fin',
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Raison (optionnel)
                const Text('Raison (optionnel)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                TextField(
                  controller: _reasonController,
                  decoration: InputDecoration(
                    hintText: 'Entrez la raison de la réservation',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 24),

                // Titre
                const Text('Titre', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                TextField(
                  controller: _titleController,
                  decoration: InputDecoration(
                    hintText: 'Entrez un titre',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                ),
                const SizedBox(height: 24),

                // Type
                const Text('Type', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedType,
                  items: _types
                      .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                      .toList(),
                  onChanged: (v) => setState(() => _selectedType = v ?? _selectedType),
                ),
                const SizedBox(height: 24),

                // Bouton de réservation
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: provider.isLoading ? null : _submitReservation,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B26FF),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: provider.isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)),
                          )
                        : const Text('Réserver', style: TextStyle(color: Colors.white, fontSize: 16)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}