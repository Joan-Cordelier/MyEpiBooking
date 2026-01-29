import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Provider/auth_provider.dart';
import '../Provider/reservation_provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ReservationProvider>().fetchMyReservations();
    });
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Déconnexion'),
        content: const Text('Êtes-vous sûr de vouloir vous déconnecter ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Annuler', style: TextStyle(color: Colors.grey[600])),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              await context.read<AuthProvider>().logout();
              if (mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Déconnexion'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final reservationProvider = context.watch<ReservationProvider>();
    final user = authProvider.user;

    final upcomingCount = reservationProvider.myReservations
        .where((r) => r.startTime.isAfter(DateTime.now()))
        .length;
    final pastCount = reservationProvider.myReservations
        .where((r) => r.startTime.isBefore(DateTime.now()))
        .length;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: CustomScrollView(
        slivers: [
          // Header avec gradient
          SliverToBoxAdapter(
            child: Container(
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
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Top bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            onPressed: () => Navigator.pop(context),
                            icon: const Icon(Icons.arrow_back, color: Colors.white),
                          ),
                          const Text(
                            'Mon Profil',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            onPressed: _showLogoutDialog,
                            icon: const Icon(Icons.logout, color: Colors.white),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Avatar
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 3),
                        ),
                        child: user?.photo != null
                            ? ClipOval(
                                child: Image.network(
                                  user!.photo!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => const Icon(
                                    Icons.person,
                                    size: 50,
                                    color: Colors.white,
                                  ),
                                ),
                              )
                            : const Icon(Icons.person, size: 50, color: Colors.white),
                      ),
                      const SizedBox(height: 16),

                      // Nom
                      Text(
                        '${user?.firstName ?? ''} ${user?.name ?? ''}'.trim().isEmpty
                            ? 'Utilisateur'
                            : '${user?.firstName ?? ''} ${user?.name ?? ''}'.trim(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),

                      // Email
                      Text(
                        user?.email ?? '',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 14,
                        ),
                      ),

                      // Promotion
                      if (user?.actualPromotion != null) ... [
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            user!.actualPromotion!,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],

                      const SizedBox(height: 24),

                      // Stats
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _buildStatItem(upcomingCount.toString(), 'À venir'),
                          Container(
                            width: 1,
                            height: 40,
                            color: Colors.white.withOpacity(0.3),
                            margin: const EdgeInsets.symmetric(horizontal: 32),
                          ),
                          _buildStatItem(pastCount.toString(), 'Passées'),
                          Container(
                            width: 1,
                            height: 40,
                            color: Colors.white.withOpacity(0.3),
                            margin: const EdgeInsets.symmetric(horizontal: 32),
                          ),
                          _buildStatItem(
                            reservationProvider.myReservations.length.toString(),
                            'Total',
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Contenu
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Informations',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Carte d'informations
                  Container(
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
                        _buildInfoTile(
                          icon: Icons.email_outlined,
                          title: 'Email',
                          value: user?.email ?? 'Non renseigné',
                        ),
                        _buildDivider(),
                        _buildInfoTile(
                          icon: Icons.person_outline,
                          title: 'Nom',
                          value: user?.name ?? 'Non renseigné',
                        ),
                        _buildDivider(),
                        _buildInfoTile(
                          icon: Icons.badge_outlined,
                          title: 'Prénom',
                          value: user?.firstName ?? 'Non renseigné',
                        ),
                        _buildDivider(),
                        _buildInfoTile(
                          icon: Icons.school_outlined,
                          title: 'Promotion',
                          value: user?.actualPromotion ?? 'Non renseigné',
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  const Text(
                    'Actions',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Actions
                  Container(
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
                        _buildActionTile(
                          icon: Icons.calendar_month,
                          title: 'Mes réservations',
                          color: Colors.blue,
                          onTap: () => Navigator.pushNamed(context, '/myReservations'),
                        ),
                        _buildDivider(),
                        _buildActionTile(
                          icon: Icons.add_circle_outline,
                          title: 'Nouvelle réservation',
                          color: Colors.green,
                          onTap: () => Navigator.pushNamed(context, '/newBooking'),
                        ),
                        _buildDivider(),
                        _buildActionTile(
                          icon: Icons.meeting_room_outlined,
                          title: 'Voir les salles',
                          color: Colors.orange,
                          onTap: () => Navigator.pushNamed(context, '/rooms'),
                        ),
                        _buildDivider(),
                        _buildActionTile(
                          icon: Icons.home_outlined,
                          title: 'Accueil',
                          color: Colors.purple,
                          onTap: () => Navigator.pushNamed(context, '/home'),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Bouton déconnexion
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: _showLogoutDialog,
                      icon: const Icon(Icons.logout, color: Colors.red),
                      label: const Text(
                        'Se déconnecter',
                        style: TextStyle(color: Colors.red),
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: Colors.red),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Version
                  Center(
                    child: Text(
                      'EPI Booking v1.0.0',
                      style: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withOpacity(0.8),
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF3B26FF).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFF3B26FF), size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.grey[500],
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Icon(Icons.chevron_right, color: Colors.grey[400]),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(
      height: 1,
      thickness: 1,
      color: Colors.grey[100],
      indent: 72,
    );
  }
}
