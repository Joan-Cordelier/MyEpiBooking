import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Provider/auth_provider.dart';
import '../Provider/reservation_provider.dart';
import '../Model/reservation.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReservationProvider>().fetchMyReservations();
      context.read<ReservationProvider>().fetchRooms();
    });
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));
    final reservationDate = DateTime(date.year, date.month, date.day);

    if (reservationDate == today) return "Aujourd'hui";
    if (reservationDate == tomorrow) return "Demain";
    
    final days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    final months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return '${days[date.weekday - 1]} ${date.day} ${months[date.month - 1]}';
  }

  Color _getTypeColor(String? type) {
    switch (type) {
      case 'MEETING': return Colors.blue;
      case 'WORK': return Colors.green;
      case 'KICK_OFF': return Colors.orange;
      case 'BOOTSTRAP': return Colors.purple;
      case 'WORKSHOP': return Colors.teal;
      case 'TALK': return Colors.indigo;
      case 'UNEXPECTED': return Colors.red;
      default: return Colors.grey;
    }
  }

  IconData _getTypeIcon(String? type) {
    switch (type) {
      case 'MEETING': return Icons.groups;
      case 'WORK': return Icons.work;
      case 'KICK_OFF': return Icons.rocket_launch;
      case 'BOOTSTRAP': return Icons.play_arrow;
      case 'WORKSHOP': return Icons.build;
      case 'TALK': return Icons.mic;
      case 'UNEXPECTED': return Icons.warning;
      default: return Icons.event;
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await context.read<ReservationProvider>().fetchMyReservations();
            await context.read<ReservationProvider>().fetchRooms();
          },
          color: const Color(0xFF3B26FF),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header avec gradient
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF3B26FF), Color(0xFF6B5BFF)],
                    ),
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(32),
                      bottomRight: Radius.circular(32),
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _getGreeting(),
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.8),
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                user?.firstName ?? user?.name ?? 'Utilisateur',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/profile'),
                            child: Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: user?.photo != null
                                  ? ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: Image.network(user!.photo!, fit: BoxFit.cover),
                                    )
                                  : const Icon(Icons.person, color: Colors.white, size: 28),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Stats rapides
                      Consumer<ReservationProvider>(
                        builder: (context, provider, _) {
                          final upcoming = provider.myReservations
                              .where((r) => r.startTime.isAfter(DateTime.now()))
                              .length;
                          final roomCount = provider.rooms.length;

                          return Row(
                            children: [
                              _buildStatCard(
                                icon: Icons.event_available,
                                value: upcoming.toString(),
                                label: 'À venir',
                              ),
                              const SizedBox(width: 16),
                              _buildStatCard(
                                icon: Icons.meeting_room,
                                value: roomCount.toString(),
                                label: 'Salles',
                              ),
                            ],
                          );
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Actions rapides
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Actions rapides',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionCard(
                              icon: Icons.add_circle_outline,
                              title: 'Réserver',
                              subtitle: 'Nouvelle réservation',
                              color: const Color(0xFF3B26FF),
                              onTap: () => Navigator.pushNamed(context, '/newBooking'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildActionCard(
                              icon: Icons.meeting_room_outlined,
                              title: 'Salles',
                              subtitle: 'Voir les salles',
                              color: Colors.teal,
                              onTap: () => Navigator.pushNamed(context, '/rooms'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: _buildActionCard(
                              icon: Icons.calendar_month_outlined,
                              title: 'Réservations',
                              subtitle: 'Mes réservations',
                              color: Colors.orange,
                              onTap: () => Navigator.pushNamed(context, '/myReservations'),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildActionCard(
                              icon: Icons.person_outline,
                              title: 'Profil',
                              subtitle: 'Mon compte',
                              color: Colors.pink,
                              onTap: () => Navigator.pushNamed(context, '/profile'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Prochaines réservations
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Prochaines réservations',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/myReservations'),
                        child: const Text(
                          'Voir tout',
                          style: TextStyle(color: Color(0xFF3B26FF)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                Consumer<ReservationProvider>(
                  builder: (context, provider, _) {
                    if (provider.isLoading && provider.myReservations.isEmpty) {
                      return const Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: CircularProgressIndicator(color: Color(0xFF3B26FF)),
                        ),
                      );
                    }

                    final upcoming = provider.myReservations
                        .where((r) => r.startTime.isAfter(DateTime.now()))
                        .toList()
                      ..sort((a, b) => a.startTime.compareTo(b.startTime));

                    if (upcoming.isEmpty) {
                      return _buildEmptyState();
                    }

                    return ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      itemCount: upcoming.take(3).length,
                      itemBuilder: (context, index) {
                        return _buildReservationCard(upcoming[index]);
                      },
                    );
                  },
                ),

                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(context, '/newBooking'),
        backgroundColor: const Color(0xFF3B26FF),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Réserver', style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.8),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReservationCard(Reservation reservation) {
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
          onTap: () => Navigator.pushNamed(context, '/myReservations'),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
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
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.meeting_room, size: 14, color: Colors.grey[500]),
                          const SizedBox(width: 4),
                          Text(
                            reservation.roomName ?? 'Salle',
                            style: TextStyle(color: Colors.grey[600], fontSize: 13),
                          ),
                          const SizedBox(width: 12),
                          Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                          const SizedBox(width: 4),
                          Text(
                            '${_formatDate(reservation.startTime)} • ${_formatTime(reservation.startTime)}',
                            style: TextStyle(color: Colors.grey[600], fontSize: 13),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, color: Colors.grey[400]),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      padding: const EdgeInsets.all(32),
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
      child: Column(
        children: [
          Icon(Icons.event_available, size: 48, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'Aucune réservation à venir',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Réservez une salle pour commencer',
            style: TextStyle(color: Colors.grey[500], fontSize: 14),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: () => Navigator.pushNamed(context, '/newBooking'),
            icon: const Icon(Icons.add, size: 18),
            label: const Text('Réserver maintenant'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF3B26FF),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
