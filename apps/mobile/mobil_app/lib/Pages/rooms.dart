import 'package:flutter/material.dart';
import '../Widget/app_shell.dart';
import '../Service/api_service.dart';
import 'room_reservations.dart';

class RoomsPage extends StatefulWidget {
  const RoomsPage({super.key});

  @override
  State<RoomsPage> createState() => _RoomsPageState();
}

class _RoomsPageState extends State<RoomsPage> {
  late Future<List<dynamic>> _roomsFuture;

  @override
  void initState() {
    super.initState();
    _roomsFuture = ApiService.fetchRooms();
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Salles',
      child: FutureBuilder<List<dynamic>>(
        future: _roomsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Erreur: ${snapshot.error}'));
          }
          final rooms = snapshot.data ?? [];
          if (rooms.isEmpty) {
            return const Center(child: Text('Aucune salle disponible'));
          }

          return Column(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: ListView.separated(
                      itemCount: rooms.length,
                      separatorBuilder: (_, __) => Divider(
                        color: Colors.grey.shade300,
                        height: 1,
                      ),
                      itemBuilder: (context, index) {
                        final room = rooms[index];
                        return ListTile(
                          title: Text(room['name'] ?? 'Salle'),
                          subtitle: Text('Étage: ${room['floor'] ?? 'N/A'}'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => RoomReservationsPage(
                                  roomId: room['id'],
                                  roomName: room['name'] ?? 'Salle',
                                  roomFloor: room['floor'],
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          );
        },
      ),
    );
  }
}
