import 'package:flutter/material.dart';
import 'Pages/home.dart';
import 'Pages/rooms.dart';
import 'Pages/profil.dart';
import 'Pages/my_reservation.dart';

void main() {
  runApp(const EpiBookingApp());
}

class EpiBookingApp extends StatelessWidget {
  const EpiBookingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EPI Booking',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF3B26FF),
        fontFamily: 'Roboto',
      ),
      // Page affichée au démarrage
      initialRoute: '/',

      // Déclaration des routes (pages)
      routes: {
        '/': (context) => const HomePage(),
        '/rooms': (context) => const RoomsPage(),
        '/profile': (context) => const ProfilePage(),
        '/myReservations': (context) => const MyReservationsPage()
      },
    );
  }
}
