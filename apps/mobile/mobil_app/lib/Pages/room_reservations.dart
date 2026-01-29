import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';
import '../Service/api_service.dart';
import '../Service/auth_service.dart';

class RoomReservationsPage extends StatefulWidget {
  final String roomId;
  final String roomName;
  final String? roomFloor;

  const RoomReservationsPage({
    super.key,
    required this.roomId,
    required this.roomName,
    this.roomFloor,
  });

  @override
  State<RoomReservationsPage> createState() => _RoomReservationsPageState();
}

class _RoomReservationsPageState extends State<RoomReservationsPage> {
  List<dynamic> reservations = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchReservations();
  }

  Future<void> _fetchReservations() async {
    try {
      final token = await AuthService.getToken();
      if (token == null) {
        setState(() {
          isLoading = false;
          errorMessage = 'Utilisateur non connecté';
        });
        return;
      }

      final data = await ApiService.fetchRoomReservations(token, widget.roomId);
      setState(() {
        reservations = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = 'Erreur lors du chargement: $e';
      });
    }
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}';
  }

  String _formatTime(String dateString) {
    final date = DateTime.parse(dateString);
    return '${date.hour.toString().padLeft(2, '0')}h${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Réservations',
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.25),
                offset: const Offset(0, 8),
                blurRadius: 16,
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  "Salle ${widget.roomName}${widget.roomFloor != null ? ' • ${widget.roomFloor}' : ''}",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                if (isLoading)
                  const Expanded(child: Center(child: CircularProgressIndicator()))
                else if (errorMessage != null)
                  Expanded(
                    child: Center(
                      child: Text(
                        errorMessage!,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )
                else if (reservations.isEmpty)
                  const Expanded(
                    child: Center(child: Text('Aucune réservation pour cette salle')),
                  )
                else
                  Expanded(
                    child: ListView.separated(
                      itemCount: reservations.length,
                      separatorBuilder: (_, __) => const Divider(height: 8),
                      itemBuilder: (context, index) {
                        final res = reservations[index];
                        final startDate = res['startDate'] ?? res['start_time'];
                        final endDate = res['endDate'] ?? res['end_time'];
                        return ListTile(
                          title: Text(res['title'] ?? 'Réservation'),
                          subtitle: Text(
                            '${_formatDate(startDate)} • ${_formatTime(startDate)} - ${_formatTime(endDate)}',
                          ),
                          trailing: Text(res['type'] ?? ''),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
