import 'package:flutter/material.dart';
import '../Service/api_service.dart';
import '../Service/auth_service.dart';

class NewBookingPage extends StatefulWidget {
  const NewBookingPage({super.key});

  @override
  State<NewBookingPage> createState() => _NewBookingPageState();
}

class _NewBookingPageState extends State<NewBookingPage> {
  final _formKey = GlobalKey<FormState>();
  List<dynamic> rooms = [];
  bool isLoadingRooms = true;

  String? selectedRoomId;
  DateTime? selectedDate;
  TimeOfDay? startTime;
  TimeOfDay? endTime;
  String? selectedType;
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();

  final types = ['MEETING', 'WORK', 'KICK_OFF', 'BOOTSTRAP', 'WORKSHOP', 'TALK', 'UNEXPECTED'];

  @override
  void initState() {
    super.initState();
    _fetchRooms();
  }

  Future<void> _fetchRooms() async {
    try {
      final data = await ApiService.fetchRooms();
      setState(() {
        rooms = data;
        isLoadingRooms = false;
      });
    } catch (e) {
      setState(() => isLoadingRooms = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors du chargement des salles: $e')),
        );
      }
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => selectedDate = picked);
    }
  }

  Future<void> _selectTime(bool isStart) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          startTime = picked;
        } else {
          endTime = picked;
        }
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    if (selectedRoomId == null || selectedDate == null || startTime == null || endTime == null || selectedType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez remplir tous les champs')),
      );
      return;
    }

    final startDateTime = DateTime(
      selectedDate!.year,
      selectedDate!.month,
      selectedDate!.day,
      startTime!.hour,
      startTime!.minute,
    );

    final endDateTime = DateTime(
      selectedDate!.year,
      selectedDate!.month,
      selectedDate!.day,
      endTime!.hour,
      endTime!.minute,
    );

    final reservationData = {
      'roomId': selectedRoomId,
      'type': selectedType,
      'title': titleController.text,
      'description': descriptionController.text,
      'startDate': startDateTime.toIso8601String(),
      'endDate': endDateTime.toIso8601String(),
    };

    try {
      final token = await AuthService.getToken();
      if (token != null) {
        await ApiService.createReservation(token, reservationData);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Réservation créée avec succès')),
          );
          Navigator.of(context).pop();
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nouvelle Réservation')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              if (isLoadingRooms)
                const Center(child: CircularProgressIndicator())
              else
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Salle'),
                  value: selectedRoomId,
                  items: rooms.map((room) {
                    return DropdownMenuItem(
                      value: room['id'] as String,
                      child: Text(room['name'] as String),
                    );
                  }).toList(),
                  onChanged: (value) => setState(() => selectedRoomId = value),
                  validator: (value) => value == null ? 'Sélectionnez une salle' : null,
                ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _selectDate,
                child: Text(selectedDate == null
                    ? 'Sélectionner une date'
                    : 'Date: ${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _selectTime(true),
                      child: Text(startTime == null ? 'Heure début' : startTime!.format(context)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _selectTime(false),
                      child: Text(endTime == null ? 'Heure fin' : endTime!.format(context)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Type'),
                value: selectedType,
                items: types.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) => setState(() => selectedType = value),
                validator: (value) => value == null ? 'Sélectionnez un type' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: titleController,
                decoration: const InputDecoration(labelText: 'Titre'),
                validator: (value) => value!.isEmpty ? 'Entrez un titre' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                maxLines: 3,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _submit,
                child: const Text('Créer la réservation'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}