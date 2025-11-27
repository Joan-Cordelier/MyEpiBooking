import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';
import '../Service/api_service.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<dynamic>> _roomsFuture;

  @override
  void initState() {
    super.initState();
    _roomsFuture = ApiService.fetchRooms();
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'EPI BOOKING',
      child: FutureBuilder<List<dynamic>>(
        future: _roomsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Erreur: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Aucune salle disponible'));
          } else {
            final rooms = snapshot.data!;
            final sortedRooms = [...rooms]
              ..sort((a, b) => a['name'].compareTo(b['name']));

            return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 12),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24.0),
                    child: Text(
                      'Salles disponibles',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // carte blanche + tableau
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withAlpha(64),
                              offset: const Offset(0, 8),
                              blurRadius: 16,
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            const SizedBox(height: 12),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 12.0),
                              child: Row(
                                children: const [
                                  Expanded(
                                    child: Text(
                                      'Salle',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: Text(
                                      'Étage',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Divider(height: 16),
                            Expanded(
                              child: ListView.builder(
                                itemCount: sortedRooms.length,
                                itemBuilder: (context, index) {
                                  final room = sortedRooms[index];
                                  return InkWell(
                                    onTap: () {
                                      // futur : détail salle
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12.0,
                                        vertical: 8.0,
                                      ),
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              room['name'],
                                              style: const TextStyle(fontSize: 16),
                                            ),
                                          ),
                                          Expanded(
                                            child: Text(
                                              room['floor'],
                                              style: const TextStyle(fontSize: 16),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // boutons du bas
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                    child: Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/newReservation');
                            },
                            child: const Text('Réservation'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              Navigator.pushNamed(context, '/myReservations');
                            },
                            child: const Text('Mes réservations'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              );
          }
        },
      ),
    );
  }
}
