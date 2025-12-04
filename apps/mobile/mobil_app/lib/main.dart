import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'Pages/home.dart';
import 'Pages/rooms.dart';
import 'Pages/profil.dart';
import 'Pages/my_reservation.dart';
import 'Pages/new_booking.dart';
import 'Pages/login.dart';
import 'Pages/register.dart';
import 'Provider/auth_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AuthProvider(),
      child: const EpiBookingApp(),
    ),
  );
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
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
        '/': (context) => const HomePage(),
        '/rooms': (context) => const RoomsPage(),
        '/profile': (context) => const ProfilePage(),
        '/myReservations': (context) => const MyReservationsPage(),
        '/newBooking': (context) => const NewBookingPage(),
      },
    );
  }
}
