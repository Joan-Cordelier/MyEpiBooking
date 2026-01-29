import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Provider/reservation_provider.dart';
import '../Model/reservation.dart';

class MyReservationsPage extends StatefulWidget {
  const MyReservationsPage({super.key});

  @override
  State<MyReservationsPage> createState() => _MyReservationsPageState();
}

class _MyReservationsPageState extends State<MyReservationsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReservationProvider>().fetchMyReservations();
    });
  }

  Color _getTypeColor(String? type) {
    switch (type) {
      case 'MEETING':
        return Colors.blue;
      case 'WORK':
        return Colors.green;
      case 'KICK_OFF':
        return Colors.orange;
      case 'BOOTSTRAP':
        return Colors.purple;
      case 'WORKSHOP':
        return Colors.teal;
      case 'TALK':
        return Colors.indigo;
      case 'UNEXPECTED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getTypeIcon(String? type) {
    switch (type) {
      case 'MEETING':
        return Icons.groups;
      case 'WORK':
        return Icons.work;
      case 'KICK_OFF':
        return Icons.rocket_launch;
      case 'BOOTSTRAP':
        return Icons.play_arrow;
      case 'WORKSHOP':
        return Icons.build;
      case 'TALK':
        return Icons.mic;
      case 'UNEXPECTED':
        return Icons.warning;
      default:
        return Icons.event;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));
    final reservationDate = DateTime(date.year, date.month, date.day);

    if (reservationDate == today) {
      return "Aujourd'hui";
    } else if (reservationDate == tomorrow) {
      return "Demain";
    } else {
      final days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      final months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      return '${days[date.weekday - 1]} ${date.day} ${months[date.month - 1]}';
    }
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  bool _isUpcoming(Reservation reservation) {
    return reservation.startTime.isAfter(DateTime.now());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      appBar: AppBar(
        title: const Text(
          'Mes Réservations',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF3B26FF),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<ReservationProvider>().fetchMyReservations(),
          ),
        ],
      ),
      body: Consumer<ReservationProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading && provider.myReservations.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(color: Color(0xFF3B26FF)),
                  SizedBox(height: 16),
                  Text('Chargement des réservations...'),
                ],
              ),
            );
          }

          if (provider.error != null && provider.myReservations.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 64, color: Colors.red),
                  const SizedBox(height: 16),
                  Text('Erreur: ${provider.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => provider.fetchMyReservations(),
                    child: const Text('Réessayer'),
                  ),
                ],
              ),
            );
          }

          if (provider.myReservations.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.event_busy, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text(
                    'Aucune réservation',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Vous n\'avez pas encore de réservations',
                    style: TextStyle(color: Colors.grey[500]),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () => Navigator.of(context).pushNamed('/newBooking'),
                    icon: const Icon(Icons.add),
                    label: const Text('Nouvelle réservation'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF3B26FF),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                  ),
                ],
              ),
            );
          }

          // Séparer les réservations à venir et passées
          final upcoming = provider.myReservations.where(_isUpcoming).toList()
            ..sort((a, b) => a.startTime.compareTo(b.startTime));
          final past = provider.myReservations.where((r) => !_isUpcoming(r)).toList()
            ..sort((a, b) => b.startTime.compareTo(a.startTime));

          return RefreshIndicator(
            onRefresh: () => provider.fetchMyReservations(),
            color: const Color(0xFF3B26FF),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Section À venir
                if (upcoming.isNotEmpty) ... [
                  _buildSectionHeader('À venir', upcoming.length, Colors.green),
                  const SizedBox(height: 12),
                  ...upcoming.map((r) => _buildReservationCard(r, isUpcoming: true)),
                ],

                // Section Passées
                if (past.isNotEmpty) ... [
                  const SizedBox(height: 24),
                  _buildSectionHeader('Passées', past.length, Colors.grey),
                  const SizedBox(height: 12),
                  ...past.map((r) => _buildReservationCard(r, isUpcoming: false)),
                ],

                const SizedBox(height: 80),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.of(context).pushNamed('/newBooking'),
        backgroundColor: const Color(0xFF3B26FF),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Réserver', style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildSectionHeader(String title, int count, Color color) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 24,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(width: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            count.toString(),
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReservationCard(Reservation reservation, {required bool isUpcoming}) {
    final typeColor = _getTypeColor(reservation.type);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => _showReservationDetails(reservation),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Icône du type
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: typeColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getTypeIcon(reservation.type),
                    color: typeColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),

                // Infos principales
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reservation.title ?? 'Réservation',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isUpcoming ? Colors.black : Colors.grey[600],
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.meeting_room,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            reservation.roomName ?? 'Salle',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.access_time,
                            size: 14,
                            color: Colors.grey[500],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${_formatDate(reservation.startTime)} • ${_formatTime(reservation.startTime)} - ${_formatTime(reservation.endTime)}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Badge type
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: typeColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    reservation.type ?? 'N/A',
                    style: TextStyle(
                      color: typeColor,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showReservationDetails(Reservation reservation) {
    final typeColor = _getTypeColor(reservation.type);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Titre et type
            Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: typeColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getTypeIcon(reservation.type),
                    color: typeColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reservation.title ?? 'Réservation',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: typeColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          reservation.type ?? 'N/A',
                          style: TextStyle(
                            color: typeColor,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Détails
            _buildDetailRow(Icons.meeting_room, 'Salle', reservation.roomName ?? 'N/A'),
            _buildDetailRow(Icons.calendar_today, 'Date', _formatDate(reservation.startTime)),
            _buildDetailRow(Icons.access_time, 'Horaires', '${_formatTime(reservation.startTime)} - ${_formatTime(reservation.endTime)}'),
            if (reservation.description != null && reservation.description!.isNotEmpty)
              _buildDetailRow(Icons.description, 'Description', reservation.description!),

            const SizedBox(height: 24),

            // Bouton fermer
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B26FF),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Fermer'),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[500]),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
